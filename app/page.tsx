import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-20%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-[25%] h-[380px] w-[380px] rounded-full bg-indigo-500/30 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[20%] h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute inset-0 bg-grid-lines [background-size:120px_120px] opacity-40" />
      </div>

      <Navbar />
      <main className="relative z-10 space-y-28 pb-0 pt-32 md:pt-36">
        <Hero />
        <Projects />
        <Skills />
        <Timeline />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
