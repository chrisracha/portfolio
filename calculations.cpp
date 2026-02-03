#include "headerfile.h"
using namespace std;

// global variables for parameters 
int Max_iterations, N, numCrops;
const int m = 12;  
int randomWalk, n, radiusReductionScheme; 
double alpha, mu, phi;

bool repairFlag = false;

// global data matrices
vector<vector<double>> costMatrix;
vector<vector<double>> returnMatrix;
vector<vector<double>> constraintMatrix;

// constraint parameters extracted from constraint.csv 
vector<double> MHA; 
vector<double> TLA;  
vector<int> k_multi;
vector<int> growth_periods;

vector<string> cropNames; 
constexpr array<const char*, 12> monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

// global random generators - using time-based seed for true randomness
mt19937 gen(chrono::steady_clock::now().time_since_epoch().count());
uniform_real_distribution<double> randDist(0.0, 1.0);
uniform_int_distribution<int> randInt1to2(1, 2);  
uniform_int_distribution<int> randInt0to1(0, 1);  
uniform_int_distribution<int> randInt1to5(1, 5);  

// function to read csv file into matrix
vector<vector<double>> readCSV(const string& fileName) {
    vector<vector<double>> matrix;
    ifstream file(fileName);
    if (!file) {
        cout << "Error: Cannot open file " << fileName << endl;
        return matrix;
    }
    
    string line;
    while (getline(file, line)) {
        if (!line.empty() && line[0] != '#') {
            vector<double> row;
            stringstream ss(line);
            string cell;
            
            while (getline(ss, cell, ',')) {
                try {
                    row.push_back(stod(cell));
                } catch (const exception& e) {
                    cout << "Error parsing value: " << cell << " in file " << fileName << endl;
                }
            }
            if (!row.empty()) {
                matrix.push_back(row);
            }
        }
    }
    file.close();
    return matrix;
}

// read input files and determine dimensions
void readInputFiles() {
    // read cost matrix to determine number of crops
    costMatrix = readCSV("input/cost.csv");
    
    // read returns matrix
    returnMatrix = readCSV("input/return.csv");
    
    // read constraint matrix
    constraintMatrix = readCSV("input/constraint.csv");
    
    // count number of crops
    if ((costMatrix.size() == returnMatrix.size()) && costMatrix.size() == constraintMatrix.size()) {
        numCrops = costMatrix.size();
    } else {
        cout << "Error: Number of crops do not match across input files." << endl;
        cout << "  Cost matrix rows: " << costMatrix.size() << endl;
        cout << "  Return matrix rows: " << returnMatrix.size() << endl;
        cout << "  Constraint matrix rows: " << constraintMatrix.size() << endl;
        exit(1);
    }
    
    // initialize dynamic crop names based on number of crops detected
    cropNames.clear();
    cropNames.resize(numCrops);
    for (int i = 0; i < numCrops; i++) {
        cropNames[i] = "Crop " + to_string(i + 1);
    }
    
    // extract constraint parameters
    MHA.resize(numCrops);
    TLA.resize(numCrops);
    k_multi.resize(numCrops);
    growth_periods.resize(numCrops);
    
    for (int i = 0; i < numCrops && i < constraintMatrix.size(); i++) {
        if (constraintMatrix[i].size() >= 4) {
            TLA[i] = constraintMatrix[i][0];
            MHA[i] = constraintMatrix[i][1];
            k_multi[i] = (int)constraintMatrix[i][2];
            growth_periods[i] = (int)constraintMatrix[i][3];
        }
    }
}

// read parameters from params.txt
void readParameters(const string& fileName) {
    ifstream textFile(fileName);
    if (!textFile) {
        cout << "Error: Cannot open parameters file " << fileName << endl;
        return;
    }
    
    string line;
    vector<double> paramArray;
    
    while (getline(textFile, line)) {
        if (!line.empty()) {
            paramArray.push_back(stod(line));
        }
    }
    textFile.close();
    
    if (paramArray.size() >= 8) {
        N = (int)paramArray[0];                     // population Size (N)
        Max_iterations = (int)paramArray[1];        // maximum Iterations (Max_iterations)
        alpha = paramArray[2];                      // sine chaos coefficient control (Î± âˆˆ [0,1]) - eq. 24,25
        n = (int)paramArray[3];                     // small-hole imaging reverse learning strategy factor (n)
        mu = paramArray[4];                         // collision mechanism coefficient (Î¼)
        phi = paramArray[5];                        // collision influence factor (Ï†)
        radiusReductionScheme = (int)paramArray[6]; // radius reduction scheme (linear reduction)
        randomWalk = (int)paramArray[7];            // random walk

    } else {
        cout << "Error: Insufficient parameters in file" << endl;
    }
}

// repair mechanism stage 1: non-negativity and maximum harvest allocation constraint repair
void repairStage1(Solution& x) {
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            if (x[i][j] < 0) {
                repairFlag = true;
                x[i][j] = 0;  // non-negativity constraint
            } else if (x[i][j] > MHA[i]) {
                repairFlag = true;
                x[i][j] = MHA[i];  // maximum harvest allocation constraint
            }
        }
    }
}

// repair mechanism stage 2: land allocation constraint repair
void repairStage2(Solution& x) {
    for (int i = 0; i < numCrops; i++) {
        int growthPeriod = growth_periods[i];
        
        // iterate through all possible harvest months
        for (int j = 0; j < m; j++) {
            double CLA_im = 0.0;
            vector<int> windowIndices;
            
            for (int k = 0; k < growthPeriod; k++) {
                int plantMonth = (j - k + m) % m;
                windowIndices.push_back(plantMonth);
                CLA_im += x[i][plantMonth];
            }
            
            if (CLA_im > TLA[i]) {
                repairFlag = true;
                // apply scaling factor
                double scalingFactor = TLA[i] / CLA_im;
                
                for (int plantMonth : windowIndices) {
                    x[i][plantMonth] = x[i][plantMonth] * scalingFactor;
                }
            }
        }
    }
}

// repair mechanism stage 3: multi-cropping constraint repair
void repairStage3(Solution& x) {
    for (int i = 0; i < numCrops; i++) {
        // calculate cumulative land allocation for the entire time period
        double CLA_i = 0.0;
        for (int j = 0; j < m; j++) {
            CLA_i += x[i][j];
        }
        
        // calculate multi-cropping limit
        double multiCroppingLimit = k_multi[i] * TLA[i];
        
        // check if constraint is violated
        if (CLA_i > multiCroppingLimit) {
            repairFlag = true;
            // apply scaling factor
            double scalingFactor = multiCroppingLimit / CLA_i;
            
            for (int j = 0; j < m; j++) {
                x[i][j] = x[i][j] * scalingFactor;
            }
        }
    }
}

// comprehensive repair mechanism: apply all three stages
void applyRepairMechanism(Solution& x) {
    repairStage1(x);  // stage 1: non-negativity and max harvest allocation
    repairStage2(x);  // stage 2: land allocation constraint repair
    repairStage3(x);  // stage 3: multi-cropping constraint repair
}

// apply repair mechanism to entire population
void applyRepairMechanismToPopulation(Population& X) {
    for (int i = 0; i < N; i++) {
        applyRepairMechanism(X[i]);
    }
}

// initialize population using sine chaotic map
Population initializePopulation() {
    Population X;
    X.resize(N);
    
    for (int i = 0; i < N; i++) {
        
        X[i].resize(numCrops);

        for (int j = 0; j < numCrops; j++) {
            X[i][j] = vector<double>(m);
            double x_i = randDist(gen);
            for (int k = 0; k < m; k++) {
                double ub = MHA[j];

                // sine chaotic map initialization
                double sine_chaos = alpha * sin(PI * x_i);
                x_i = sine_chaos;
                X[i][j][k] = sine_chaos * ub;
            }
        }
    }
    
    return X;
}

// maximize net profit: return - cost
double calculateObjective(const Solution& x) {
    double totalNetProfit = 0.0;
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) { 
            
            // map month to season: dry (dec-may) = 0, wet (jun-nov) = 1
            const int seasonIndex = ((j >= 0 && j <= 4) || j == 11) ? 0 : 1;
            
            // profit = land * (return - cost)
            double profit = x[i][j] * (returnMatrix[i][j] - costMatrix[i][seasonIndex]);
            totalNetProfit += profit;
        }
    }
    return totalNetProfit;
}

// find dominant hippopotamus (best solution)
int findDominantHippopotamus(const vector<double>& objectives) {
    int bestIndex = 0;
    double bestObjective = objectives[0];
    for (int i = 1; i < N; i++) {
        if (objectives[i] > bestObjective) {
            bestObjective = objectives[i];
            bestIndex = i;
        }
    }
    return bestIndex;
}

// print raw solution matrix
void printSolutionMatrix(const Solution& x, int precision = 5) {
    cout << "[";
    for (int i = 0; i < x.size(); i++) {
        cout << "[";
        for (int j = 0; j < x[i].size(); j++) {
            cout << fixed << setprecision(precision) << x[i][j];
            if (j < x[i].size() - 1) cout << ", ";
        }
        cout << "]";
        if (i < x.size() - 1) cout << "," << endl;
    }
    cout << "]";
}

// print solution with label
void printSolution(const Solution& x, int index = -1) {
    if (index >= 0) {
        cout << "ftho[" << index << "] = ";
    }
    printSolutionMatrix(x);
    cout << endl;
}

// print solution with label and objective value
void printSolutionWithObjective(const Solution& x, double objective, int index = -1) {
    if (index >= 0) {
        cout << "ftho[" << index << "] = ";
    }
    printSolutionMatrix(x);
    cout << " = " << fixed << setprecision(2) << objective << endl;
}

// pass solution
void printSingleSolution(const Solution& x, int precision = 5) {
    cout << "[";
    for (int i = 0; i < x.size(); i++) {
        cout << "[";
        for (int j = 0; j < x[i].size(); j++) {
            cout << fixed << setprecision(precision) << x[i][j];
            if (j < x[i].size() - 1) cout << ", ";
        }
        cout << "]";
        if (i < x.size() - 1) cout << "," << endl << " ";
    }
    cout << "]";
    cout << endl;
}

// pass index
void printSingleSolution(const Population& X, int index, int precision = 5) {
    if (index < 0 || index >= X.size()) {
        cout << "Invalid index: " << index << endl;
        return;
    }
    printSingleSolution(X[index], precision);
}

// print algorithm parameters
void printAlgorithmParameters() {
    cout << "FTHO Algorithm Parameters:" << endl;
    cout << "  Population Size (N): " << N << endl;
    cout << "  Maximum Iterations: " << Max_iterations << endl;
    cout << "  Sine Chaos Coefficient (alpha): " << alpha << endl;
    cout << "  Reverse Learning Factor (n): " << n << endl;
    cout << "  Collision Coefficient (mu): " << mu << endl;
    cout << "  Collision Influence (phi): " << phi << endl;
    cout << "  Random Walk: " << (randomWalk == 1 ? "Levy flight" : "Brownian motion") << endl;
    cout << "  Radius Reduction Scheme: " << (radiusReductionScheme == 1 ? "Linear reduction" : "No reduction") << endl;
    cout << endl;
}

// print problem constraints
void printProblemConstraints() {
    cout << "Problem Dimensions:" << endl;
    cout << "  " << numCrops << " crops x " << m << " months" << endl;
    
    cout << "\nCrop Constraints:" << endl;
    cout << setw(18) << "Crop Name" << setw(12) << "TLA (ha)" << setw(12) << "MHA (ha)" 
         << setw(10) << "k" << setw(12) << "Growth(mo)" << endl;
    cout << string(66, '-') << endl;
    
    for (int i = 0; i < numCrops; i++) {
        cout << setw(18) << (i < cropNames.size() ? cropNames[i] : "Crop " + to_string(i+1))
             << setw(12) << fixed << setprecision(2) << TLA[i]
             << setw(12) << fixed << setprecision(2) << MHA[i]
             << setw(10) << k_multi[i]
             << setw(12) << growth_periods[i] << endl;
    }
    cout << endl;
}

// print cost matrix
void printCostMatrix() {
    cout << "Cost Matrix (php/ha):" << endl;
    cout << setw(18) << "Crop Name" << setw(12) << "Dry Season" << setw(12) << "Wet Season" << endl;
    cout << string(42, '-') << endl;
    for (int i = 0; i < numCrops && i < costMatrix.size(); i++) {
        cout << setw(18) << (i < cropNames.size() ? cropNames[i] : "Crop " + to_string(i+1));
        if (costMatrix[i].size() >= 2) {
            cout << setw(12) << fixed << setprecision(2) << costMatrix[i][0]
                 << setw(12) << fixed << setprecision(2) << costMatrix[i][1];
        }
        cout << endl;
    }
    cout << endl;
}

// print returns matrix
void printReturnsMatrix() {
    cout << "Returns Matrix (php/ha):" << endl;
    cout << setw(18) << "Crop Name";
    for (int j = 0; j < m && j < monthNames.size(); j++) {
        cout << setw(8) << monthNames[j];
    }
    cout << endl;
    cout << string(18 + m * 8, '-') << endl;
    
    for (int i = 0; i < numCrops && i < returnMatrix.size(); i++) {
        cout << setw(18) << (i < cropNames.size() ? cropNames[i] : "Crop " + to_string(i+1));
        for (int j = 0; j < m && j < returnMatrix[i].size(); j++) {
            cout << setw(8) << fixed << setprecision(1) << returnMatrix[i][j];
        }
        cout << endl;
    }
    cout << endl;
}

// print complete problem information
void printProblemInfo() {
    printAlgorithmParameters();
    printProblemConstraints();
    printCostMatrix();
    printReturnsMatrix();
}

// print entire population
void printPopulationOnly(const Population& X) {
    for (int i = 0; i < N; i++) {
        printSolution(X[i], i+1);
        cout << endl;
    }
}

// print entire population with objectives
void printPopulation(const Population& X, const vector<double>& objectives, bool showBest = true) {
    for (int i = 0; i < N; i++) {
        printSolutionWithObjective(X[i], objectives[i], i+1);
        cout << endl;
    }
    
    if (showBest) {
        int bestIndex = findDominantHippopotamus(objectives);
        cout << "\nBest Solution:" << endl;
        printSolutionWithObjective(X[bestIndex], objectives[bestIndex], bestIndex+1);
        cout << endl;
    }
}


// calculate objective values for all solutions
vector<double> calculateAllObjectives(const Population& X) {
    vector<double> objectives;
    objectives.reserve(N);  // pre-allocate memory
    
    for (const auto& x : X) {
        objectives.push_back(calculateObjective(x));
    }
    return objectives;
}

// calculate initial maximum territory radius
double calculateInitialMaxRadius() {
    double product = 1.0;
    
    for (int i = 0; i < numCrops; i++) {
        double ub = MHA[i];
        double lb = 0.0;
        // each crop has m months
        for (int j = 0; j < m; j++) {
            product *= (ub - lb);
        }
    }
    
    // nth root where n = totalDimensions
    double R_max_prime = pow(product / N, 1 / (numCrops * m)) / 2;
    return R_max_prime;
}

double calculateReducedMaxRadius(double R_max_prime) {
    return mu * R_max_prime;
}

// calculate euclidean distance between two solutions
double calculateDistance(const Solution& x1, const Solution& x2) {
    double sumSquares = 0.0;
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double diff = x1[i][j] - x2[i][j];
            sumSquares += diff * diff;
        }
    }
    return sqrt(sumSquares);
}

// apply collision mechanism to a hippopotamus
Solution applyCollisionMechanism(const Solution& X_i, const Solution& X_j, double F_i, 
                                double F_j, double R_t) {
    Solution X_collision = X_i;
    Solution phi_collision(numCrops, vector<double>(m, 0.0));

    if (F_i > F_j) {
        
        double distance = calculateDistance(X_i, X_j);

        int dimensions = m * numCrops;

        double scalar_factor = (2.0 * R_t) - distance;

        for (int i = 0; i < numCrops; i++) {
            for (int j = 0; j < m; j++) {
                phi_collision[i][j] = phi * scalar_factor * (X_i[i][j] - X_j[i][j]) / distance; 
            }
        }
    } 

    return phi_collision;
}

// generate random vector h based on
vector<vector<double>> generateRandomVector() {
    vector<vector<double>> h(numCrops, vector<double>(m));

    int caseNumber = randInt1to5(gen);

    switch (caseNumber) {
        case 1: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    h[i][j] = randInt1to2(gen) * randDist(gen) - 1 + !(randInt0to1(gen));
                }
            }
            break;
        }
        case 2: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    h[i][j] = 2 * randDist(gen) - 1;
                }
            }
            break;
        }
        case 3: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    h[i][j] = randDist(gen);
                }
            }
            break;
        }
        case 4: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    h[i][j] = randInt1to2(gen) * randDist(gen) + !(randInt0to1(gen));
                }
            }
            break;
        }
        case 5: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    h[i][j] = randDist(gen);
                }
            }
            break;
        }
    }

    return h;
}

// calculate mean of randomly selected hippopotamuses
Solution calculateMeanOfRandomHippopotamuses(const Population& X) {
    Solution MG(numCrops, vector<double>(m, 0.0));
    
    uniform_int_distribution<int> randNumHippos(1, N-1);
    uniform_int_distribution<int> randPopIndex(0, N-1);
    int numSelected = randNumHippos(gen);
    
    vector<int> selectedIndices;
    selectedIndices.reserve(numSelected);
    for (int count = 0; count < numSelected; count++) {
        int idx = randPopIndex(gen);
        selectedIndices.push_back(idx);
    }
    
    // calculate mean
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double sum = 0.0;
            for (int idx : selectedIndices) {
                sum += X[idx][i][j];
            }
            MG[i][j] = sum / numSelected;
        }
    }

    return MG;
}

// update male hippopotamus position
Solution updateMaleHippopotamus(const Solution& x, const Solution& D_hippo) {
    Solution x_Mhippo(numCrops, vector<double>(m));
    
    // generate random vector h1
    vector<vector<double>> h1 = generateRandomVector();
    
    // randomly choose I1 as 1 or 2
    int I1 = randInt1to2(gen);

    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            x_Mhippo[i][j] = x[i][j] + h1[i][j] * (D_hippo[i][j] - I1 * x[i][j]);
        }
    }
    
    return x_Mhippo;
}

// update female/young hippopotamus position
Solution updateFemaleHippopotamus(const Solution& x, const Solution& D_hippo, 
                                  const Solution& MG_i, double T) {
    Solution x_FBhippo(numCrops, vector<double>(m));
    
    if (T > 0.95) {
        vector<vector<double>> h1 = generateRandomVector();
        int I2 = randInt1to2(gen);
        
        for (int i = 0; i < numCrops; i++) {
            for (int j = 0; j < m; j++) {
                x_FBhippo[i][j] = x[i][j] + h1[i][j] * (D_hippo[i][j] - I2 * MG_i[i][j]);
            }
        }
    } else {
        // check if completely strayed from mother but not from herd
        if (randDist(gen) > 0.5) {
            vector<vector<double>> h2 = generateRandomVector();
            
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    x_FBhippo[i][j] = x[i][j] + h2[i][j] * (MG_i[i][j] - D_hippo[i][j]);
                }
            }
        } else {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                double lb_j = 0.0; 
                double ub_j = MHA[i];
                x_FBhippo[i][j] = lb_j + randDist(gen) * (ub_j - lb_j);
                }
            }
        }
    }
    
    return x_FBhippo;
}

// calculate position of ith hippopotamus
void calculatePosition(Solution& x_male, Solution& x_female, 
                      const Solution& current, const Solution& D_hippo, 
                      const Population& X, int currentIteration) {
    double T = 1.0 - pow(static_cast<double>(currentIteration) / Max_iterations, 6);
    Solution MG_i = calculateMeanOfRandomHippopotamuses(X);
    
    x_male = updateMaleHippopotamus(current, D_hippo);
    x_female = updateFemaleHippopotamus(current, D_hippo, MG_i, T);
}

// collision mechanism
void applyCollision(Solution& x_male, Solution& x_female,
                   const Solution& current, const vector<double>& objectives,
                   int currentIteration) {
    double T = 1.0 - pow(static_cast<double>(currentIteration) / Max_iterations, 6);
    double R_max_prime = calculateInitialMaxRadius();
    double R_max = calculateReducedMaxRadius(R_max_prime);
    
    // apply radius reduction based on scheme parameter
    double R_t;
    R_t = R_max * (1.0 - static_cast<double>(currentIteration) / Max_iterations);

    double F_j = calculateObjective(current);

    const Solution& male_collisionvector = applyCollisionMechanism(x_male, current, calculateObjective(x_male), F_j, R_t);
    const Solution& female_collisionvector = applyCollisionMechanism(x_female, current, calculateObjective(x_female), F_j, R_t);
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            x_male[i][j] = x_male[i][j] + male_collisionvector[i][j];
            x_female[i][j] = x_female[i][j] + female_collisionvector[i][j];
        }
    }
}

int collisionCounter = 0;
int reverseImproveCount = 0;

// update ith hippopotamus
void updateHippopotamus(Solution& current, double& currentObjective, 
                       const Solution& x_male, const Solution& x_female) {
    double F_male = calculateObjective(x_male);
    double F_female = calculateObjective(x_female);
    
    if (F_male > currentObjective && F_male >= F_female) {
        collisionCounter += 1;
        current = x_male;
        currentObjective = F_male;
    } else if (F_female > currentObjective) {
        collisionCounter += 1;
        current = x_female;
        currentObjective = F_female;
    }
}

// generate LÃ©vy flight step using Mantegna algorithm
double generateLevyStep() {
    // calculate sigma
    double beta = 1.5;
    double numerator = tgamma(1 + beta) * sin(PI * beta / 2.0);
    double denominator = tgamma((1 + beta) / 2.0) * beta * pow(2.0, (beta - 1) / 2.0);
    double sigma = pow(numerator / denominator, 1.0 / beta);
    
    // generate random variables from normal distribution
    normal_distribution<double> normalDist(0.0, 1.0);
    double mu_sigma = normalDist(gen) * sigma;
    double v = normalDist(gen);
    
    // calculate LÃ©vy step
    double step = mu_sigma / pow(abs(v), 1.0 / beta);
    return step;
}

// generate LÃ©vy flight vector for foraging 
Solution generateLevyFlight(const Solution& current) {
    Solution levy(numCrops, vector<double>(m));
    uniform_real_distribution<double> uDist(0.0, 1.0);
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double u = uDist(gen);
            int sign = (randDist(gen) - 0.5 >= 0) ? 1 : -1;
            double levyStep = generateLevyStep();
            levy[i][j] = current[i][j] + u * sign * levyStep;
        }
    }
    return levy;
}

// generate Brownian motion for foraging
Solution generateBrownianMotion(const Solution& current, const Solution& best) {
    Solution brownian(numCrops, vector<double>(m));
    
    // standard normal distribution for Brownian motion (RB)
    normal_distribution<double> normalDist(0.0, 1.0);
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double s = randDist(gen);
            
            double RB = normalDist(gen);
            
            brownian[i][j] = current[i][j] + s * RB * (best[i][j] - RB * current[i][j]);
        }
    }
    return brownian;
}

// phase 2: nocturnal foraging
Solution calculateForagingPosition(const Solution& current, const Solution& best, int randomWalkType) {
    Solution x_foraging;
    
    if (randomWalkType == 1) {
        x_foraging = generateLevyFlight(current);
    } else if (randomWalkType == 2) {
        x_foraging = generateBrownianMotion(current, best);
    }
    
    return x_foraging;
}

// update hippopotamus after foraging 
void updateHippopotamusForaging(Solution& current, double& currentObjective, 
                                const Solution& x_foraging) {
    double F_foraging = calculateObjective(x_foraging);
    
    if (F_foraging > currentObjective) {
        current = x_foraging;
        currentObjective = F_foraging;
    }
}

// generate random predator position
Solution generatePredator() {
    Solution predator(numCrops, vector<double>(m));

    double lb_j = 0.0;
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double ub_j = MHA[i];
            predator[i][j] = lb_j + randDist(gen) * (ub_j - lb_j);
        }
    }
    return predator;
}

// phase 3: defense against predator
Solution calculateDefensePosition(const Solution& current, const Solution& predator,
                                  double F_current, double F_predator) {
    Solution x_defense(numCrops, vector<double>(m));
    
    uniform_real_distribution<double> fDist(-1.0, 1.0);
    uniform_real_distribution<double> cDist(2.0, 4.0);
    uniform_real_distribution<double> dDist(1.0, 1.5);
    uniform_real_distribution<double> gDist(-1.0, 1.0);
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double f = fDist(gen);
            double c = cDist(gen);
            double d = dDist(gen);
            double g = gDist(gen);
            
            // generate Levy distributed random vector
            double RL = generateLevyStep();
            
            double distance = abs(predator[i][j] - current[i][j]);
            
            // equation 18
            // predator is better than current
            if (F_predator > F_current) {
                x_defense[i][j] = RL + predator[i][j] + (f / (c - d * cos(2 * PI * g))) * (1.0 / distance);
            // predator is not better
            } else {
                x_defense[i][j] = RL + predator[i][j] + (f / (c - d * cos(2 * PI * g))) * (1.0 / (2 * distance + F_predator));
            }
        }
    }
    return x_defense;
}

// update hippopotamus after defense
void updateHippopotamusDefense(Solution& current, double& currentObjective, 
                               const Solution& x_defense) {
    double F_defense = calculateObjective(x_defense);
    
    if (F_defense > currentObjective) {
        current = x_defense;
        currentObjective = F_defense;
    }
}

// calculate new bounds for escape phase
void calculateEscapeBounds(vector<double>& lb_local, vector<double>& ub_local, 
                          int currentIteration) {
    lb_local.resize(numCrops);
    ub_local.resize(numCrops);
    
    for (int i = 0; i < numCrops; i++) {
        double lb = 0.0;
        double ub = MHA[i];
        
        lb_local[i] = lb / static_cast<double>(currentIteration);
        ub_local[i] = ub / static_cast<double>(currentIteration);
    }
}

// generate random scenarios for escape
vector<vector<double>> generateEscapeScenario() {
    vector<vector<double>> s(numCrops, vector<double>(m));
    
    int caseNumber = randInt1to5(gen) % 3 + 1;  // cases 1-3
    
    switch (caseNumber) {
        case 1: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    s[i][j] = 2 * randDist(gen) -1;
                }
            }
            break;
        }
        case 2: {
            for (int i = 0; i < numCrops; i++) {
                for (int j = 0; j < m; j++) {
                    s[i][j] = randDist(gen);
                }
            }
        }
        case 3: {
            for (int i = 0; i < numCrops; i++) {
                for (int j =0; j < m; j++) {
                    s[i][j] = randDist(gen);
                }
            }
        }
    }
    return s;
}

// phase 4: escape from predator
Solution calculateEscapePosition(const Solution& current, int currentIteration) {
    Solution x_escape(numCrops, vector<double>(m));
    
    // calculate new bounds
    vector<double> lb_local, ub_local;
    calculateEscapeBounds(lb_local, ub_local, currentIteration);
    
    // generate random scenario
    vector<vector<double>> s1 = generateEscapeScenario();
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double r10 = randDist(gen);
            x_escape[i][j] = current[i][j] + r10 * (lb_local[i] + s1[i][j] * (ub_local[i] - lb_local[i]));
        }
    }
    return x_escape;
}

// update hippopotamus after escape
void updateHippopotamusEscape(Solution& current, double& currentObjective, 
                              const Solution& x_escape) {
    double F_escape = calculateObjective(x_escape);

    if (F_escape > currentObjective) {
        current = x_escape;
        currentObjective = F_escape;
    }
}

// phase 5: small-hole imaging reverse learning
Solution calculateReversePosition(const Solution& bestSolution) {
    Solution x_reverse(numCrops, vector<double>(m));
    
    for (int i = 0; i < numCrops; i++) {
        for (int j = 0; j < m; j++) {
            double a = MHA[i];  // upper bound
            double b = 0.0;     // lower bound
            
            x_reverse[i][j] = bestSolution[i][j] + randDist(gen) * (a - bestSolution[i][j]);
        }
    }
    return x_reverse;
}

// update best solution with reverse learning
void updateBestSolutionReverse(Solution& bestSolution, double& bestObjective, 
                               const Solution& x_reverse) {
    double F_reverse = calculateObjective(x_reverse);

    if (F_reverse > bestObjective) {
        reverseImproveCount++;
        bestSolution = x_reverse;
        bestObjective = F_reverse;
    }
}

// ==================== PERFORMANCE METRICS ====================

// helper function to extract folder name from path
string getFolderName() {
    char buffer[1024];
    
    #ifdef _WIN32
        if (_getcwd(buffer, sizeof(buffer)) != nullptr) {
            string path(buffer);
            size_t pos = path.find_last_of("\\/");
            if (pos != string::npos) {
                return path.substr(pos + 1);
            }
            return path;
        }
    #else
        if (getcwd(buffer, sizeof(buffer)) != nullptr) {
            string path(buffer);
            size_t pos = path.find_last_of("/");
            if (pos != string::npos) {
                return path.substr(pos + 1);
            }
            return path;
        }
    #endif
    
    return "output";  // fallback name
}

// helper function to create output directory
void createOutputDirectory() {
    #ifdef _WIN32
        _mkdir("output");
    #else
        mkdir("output", 0777);
    #endif
}

// structure to hold run statistics
struct RunStatistics {
    double runTime;
    double bestFitness;
    double worstFitness;
    double averageFitness;  // average of best fitnesses across all iterations
    vector<double> iterationBestFitnesses;  // best fitness at each iteration
    vector<double> iterationWorstFitnesses;  // worst fitness at each iteration
    vector<double> iterationBestTimes;       // CPU time when best was obtained
    Solution bestSolution;
    
    // random walk metrics
    double randomWalkTotalCPUTime;           // total CPU time spent in random walk phase
    int randomWalkImprovementCount;          // number of improvements from random walk
    int randomWalkTotalAttempts;             // total random walk attempts
    double randomWalkImprovementRatio;       // improvement count / total attempts
    vector<double> iterationRandomWalkTime;  // random walk CPU time per iteration
    vector<int> iterationRandomWalkImproves; // improvements from random walk per iteration
    
    // collision and reverse learning metrics
    int collisionCount;                      // number of collision improvements
    int reverseImproveCount;                 // number of reverse learning improvements
};

// structure to hold all runs data
struct AllRunsData {
    vector<RunStatistics> runs;
    string paramFileName;
};

// global variable to store performance data
AllRunsData performanceData;

// initialize performance tracking for a new run
void initializeRunTracking() {
    RunStatistics newRun;
    newRun.runTime = 0.0;
    newRun.bestFitness = -1e100;  // initialize to very small number for maximization
    newRun.worstFitness = 1e100;  // initialize to very large number for maximization
    newRun.averageFitness = 0.0;
    
    // initialize random walk metrics
    newRun.randomWalkTotalCPUTime = 0.0;
    newRun.randomWalkImprovementCount = 0;
    newRun.randomWalkTotalAttempts = 0;
    newRun.randomWalkImprovementRatio = 0.0;
    
    // initialize collision and reverse learning metrics
    newRun.collisionCount = 0;
    newRun.reverseImproveCount = 0;
    
    // reset global counters for this run
    collisionCounter = 0;
    reverseImproveCount = 0;
    
    performanceData.runs.push_back(newRun);
}

// update iteration statistics
void updateIterationStatistics(int runIndex, double bestFitness, double worstFitness, 
                                double cpuTime) {
    if (runIndex >= 0 && runIndex < performanceData.runs.size()) {
        performanceData.runs[runIndex].iterationBestFitnesses.push_back(bestFitness);
        performanceData.runs[runIndex].iterationWorstFitnesses.push_back(worstFitness);
        performanceData.runs[runIndex].iterationBestTimes.push_back(cpuTime);
    }
}

// update random walk statistics for an iteration
void updateRandomWalkStatistics(int runIndex, double rwTime, int rwImproves) {
    if (runIndex >= 0 && runIndex < performanceData.runs.size()) {
        performanceData.runs[runIndex].iterationRandomWalkTime.push_back(rwTime);
        performanceData.runs[runIndex].iterationRandomWalkImproves.push_back(rwImproves);
        performanceData.runs[runIndex].randomWalkTotalCPUTime += rwTime;
        performanceData.runs[runIndex].randomWalkImprovementCount += rwImproves;
        performanceData.runs[runIndex].randomWalkTotalAttempts += N;  // N attempts per iteration
        
        // calculate improvement ratio
        if (performanceData.runs[runIndex].randomWalkTotalAttempts > 0) {
            performanceData.runs[runIndex].randomWalkImprovementRatio = 
                static_cast<double>(performanceData.runs[runIndex].randomWalkImprovementCount) / 
                performanceData.runs[runIndex].randomWalkTotalAttempts;
        }
    }
}

// finalize run statistics - call this at the end of each run
void finalizeRunStatistics(int runIndex, double runTime, double bestFitness, double worstFitness, 
                           double averageFitness, const Solution& bestSolution) {
    if (runIndex >= 0 && runIndex < performanceData.runs.size()) {
        performanceData.runs[runIndex].runTime = runTime;
        performanceData.runs[runIndex].bestFitness = bestFitness;
        performanceData.runs[runIndex].worstFitness = worstFitness;
        performanceData.runs[runIndex].averageFitness = averageFitness;
        performanceData.runs[runIndex].bestSolution = bestSolution;
        
        // save collision and reverse learning counters
        performanceData.runs[runIndex].collisionCount = collisionCounter;
        performanceData.runs[runIndex].reverseImproveCount = reverseImproveCount;
    }
}

// write performance metrics to csv files
void writePerformanceMetricsToCSV(const string& baseFileName) {
    // extract base name without extension
    string baseName = baseFileName;
    size_t dotPos = baseName.find_last_of('.');
    if (dotPos != string::npos) {
        baseName = baseName.substr(0, dotPos);
    }
    
    int numRuns = performanceData.runs.size();
    if (numRuns == 0) return;
    
    // 1. Write RunTime.csv - one value per run
    ofstream runtimeFile(baseName + "_FTHO_RunTime.csv");
    for (int i = 0; i < numRuns; i++) {
        runtimeFile << fixed << setprecision(2) << performanceData.runs[i].runTime;
        if (i < numRuns - 1) runtimeFile << "\n";
    }
    runtimeFile.close();
    
    // 2. Write BestFitness.csv - best fitness per run
    ofstream bestFitnessFile(baseName + "_FTHO_BestFitness.csv");
    for (int i = 0; i < numRuns; i++) {
        bestFitnessFile << fixed << setprecision(4) << performanceData.runs[i].bestFitness;
        if (i < numRuns - 1) bestFitnessFile << "\n";
    }
    bestFitnessFile.close();
    
    // 3. Write WorstFitness.csv - worst fitness per run
    ofstream worstFitnessFile(baseName + "_FTHO_WorstFitness.csv");
    for (int i = 0; i < numRuns; i++) {
        worstFitnessFile << fixed << setprecision(4) << performanceData.runs[i].worstFitness;
        if (i < numRuns - 1) worstFitnessFile << "\n";
    }
    worstFitnessFile.close();
    
    // 4. Write AverageFitness.csv - average fitness per run
    ofstream avgFitnessFile(baseName + "_FTHO_AverageFitness.csv");
    for (int i = 0; i < numRuns; i++) {
        avgFitnessFile << fixed << setprecision(4) << performanceData.runs[i].averageFitness;
        if (i < numRuns - 1) avgFitnessFile << "\n";
    }
    avgFitnessFile.close();
    
    // 5. Write BestSolution.csv - best solution for each run (crops x months matrix)
    ofstream bestSolutionFile(baseName + "_FTHO_BestSolution.csv");
    for (int run = 0; run < numRuns; run++) {
        const Solution& bestSol = performanceData.runs[run].bestSolution;
        for (int i = 0; i < bestSol.size(); i++) {
            for (int j = 0; j < bestSol[i].size(); j++) {
                bestSolutionFile << fixed << setprecision(5) << bestSol[i][j];
                if (j < bestSol[i].size() - 1) bestSolutionFile << ",";
            }
            if (i < bestSol.size() - 1) bestSolutionFile << ",";
        }
        if (run < numRuns - 1) bestSolutionFile << "\n";
    }
    bestSolutionFile.close();
    
    // 6. Write GenerationBestFitnesses.csv - matrix of best fitness per iteration per run
    // Rows = iterations, Columns = runs
    int numIterations = performanceData.runs[0].iterationBestFitnesses.size();
    ofstream genBestFile(baseName + "_FTHO_GenerationBestFitnesses.csv");
    for (int iter = 0; iter < numIterations; iter++) {
        for (int run = 0; run < numRuns; run++) {
            genBestFile << fixed << setprecision(4) 
                       << performanceData.runs[run].iterationBestFitnesses[iter];
            if (run < numRuns - 1) genBestFile << ",";
        }
        if (iter < numIterations - 1) genBestFile << "\n";
    }
    genBestFile.close();
    
    // 7. Write GenerationWorstFitnesses.csv - matrix of worst fitness per iteration per run
    ofstream genWorstFile(baseName + "_FTHO_GenerationWorstFitnesses.csv");
    for (int iter = 0; iter < numIterations; iter++) {
        for (int run = 0; run < numRuns; run++) {
            genWorstFile << fixed << setprecision(4) 
                        << performanceData.runs[run].iterationWorstFitnesses[iter];
            if (run < numRuns - 1) genWorstFile << ",";
        }
        if (iter < numIterations - 1) genWorstFile << "\n";
    }
    genWorstFile.close();
    
    // 8. Write BestFitTime.csv - matrix of CPU time when best was obtained per iteration per run
    ofstream bestTimeFile(baseName + "_FTHO_BestFitTime.csv");
    for (int iter = 0; iter < numIterations; iter++) {
        for (int run = 0; run < numRuns; run++) {
            bestTimeFile << fixed << setprecision(4) 
                        << performanceData.runs[run].iterationBestTimes[iter];
            if (run < numRuns - 1) bestTimeFile << ",";
        }
        if (iter < numIterations - 1) bestTimeFile << "\n";
    }
    bestTimeFile.close();
    
    // 9. Write RandomWalkCPUTime.csv - total random walk CPU time per run
    ofstream rwTimeFile(baseName + "_FTHO_RandomWalkCPUTime.csv");
    for (int i = 0; i < numRuns; i++) {
        rwTimeFile << fixed << setprecision(6) << performanceData.runs[i].randomWalkTotalCPUTime;
        if (i < numRuns - 1) rwTimeFile << "\n";
    }
    rwTimeFile.close();
    
    // 10. Write RandomWalkImprovementCount.csv - random walk improvement count per run
    ofstream rwImpCountFile(baseName + "_FTHO_RandomWalkImprovementCount.csv");
    for (int i = 0; i < numRuns; i++) {
        rwImpCountFile << performanceData.runs[i].randomWalkImprovementCount;
        if (i < numRuns - 1) rwImpCountFile << "\n";
    }
    rwImpCountFile.close();
    
    // 11. Write RandomWalkImprovementRatio.csv - random walk improvement ratio per run
    ofstream rwImpRatioFile(baseName + "_FTHO_RandomWalkImprovementRatio.csv");
    for (int i = 0; i < numRuns; i++) {
        rwImpRatioFile << fixed << setprecision(6) << performanceData.runs[i].randomWalkImprovementRatio;
        if (i < numRuns - 1) rwImpRatioFile << "\n";
    }
    rwImpRatioFile.close();
    
    // 12. Write GenerationRandomWalkTime.csv - matrix of random walk CPU time per iteration per run
    if (!performanceData.runs[0].iterationRandomWalkTime.empty()) {
        ofstream genRWTimeFile(baseName + "_FTHO_GenerationRandomWalkTime.csv");
        for (int iter = 0; iter < numIterations; iter++) {
            for (int run = 0; run < numRuns; run++) {
                if (iter < performanceData.runs[run].iterationRandomWalkTime.size()) {
                    genRWTimeFile << fixed << setprecision(6) 
                                 << performanceData.runs[run].iterationRandomWalkTime[iter];
                } else {
                    genRWTimeFile << "0.0";
                }
                if (run < numRuns - 1) genRWTimeFile << ",";
            }
            if (iter < numIterations - 1) genRWTimeFile << "\n";
        }
        genRWTimeFile.close();
    }
    
    // 13. Write GenerationRandomWalkImproves.csv - matrix of random walk improvements per iteration per run
    if (!performanceData.runs[0].iterationRandomWalkImproves.empty()) {
        ofstream genRWImpFile(baseName + "_FTHO_GenerationRandomWalkImproves.csv");
        for (int iter = 0; iter < numIterations; iter++) {
            for (int run = 0; run < numRuns; run++) {
                if (iter < performanceData.runs[run].iterationRandomWalkImproves.size()) {
                    genRWImpFile << performanceData.runs[run].iterationRandomWalkImproves[iter];
                } else {
                    genRWImpFile << "0";
                }
                if (run < numRuns - 1) genRWImpFile << ",";
            }
            if (iter < numIterations - 1) genRWImpFile << "\n";
        }
        genRWImpFile.close();
    }
    
    // 14. Write CollisionCount.csv - collision improvement count per run
    ofstream collisionFile(baseName + "_FTHO_CollisionCount.csv");
    for (int i = 0; i < numRuns; i++) {
        collisionFile << performanceData.runs[i].collisionCount;
        if (i < numRuns - 1) collisionFile << "\n";
    }
    collisionFile.close();
    
    // 15. Write ReverseImproveCount.csv - reverse learning improvement count per run
    ofstream reverseFile(baseName + "_FTHO_ReverseImproveCount.csv");
    for (int i = 0; i < numRuns; i++) {
        reverseFile << performanceData.runs[i].reverseImproveCount;
        if (i < numRuns - 1) reverseFile << "\n";
    }
    reverseFile.close();
}

// print execution summary
void printExecutionSummary() {
    int numRuns = performanceData.runs.size();
    if (numRuns == 0) return;
    
    // calculate total and average time
    double totalTime = 0.0;
    double bestOverall = -1e100;
    double worstOverall = 1e100;
    double sumAvgFitness = 0.0;
    
    for (const auto& run : performanceData.runs) {
        totalTime += run.runTime;
        if (run.bestFitness > bestOverall) bestOverall = run.bestFitness;
        if (run.worstFitness < worstOverall) worstOverall = run.worstFitness;
        sumAvgFitness += run.averageFitness;
    }
    
    double avgTime = totalTime / numRuns;
    double avgOfAvgFitness = sumAvgFitness / numRuns;
}