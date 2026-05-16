"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { glossary, phases, simulators } from "@/lib/architecture";
import { useProgressStore } from "@/lib/progress-store";
import { isPhaseUnlocked, isSimulatorUnlocked, simulatorUnlockRequirement } from "@/lib/progression";

export default function Home() {
  const completed = useProgressStore((s) => s.completedPhases);
  const quizScores = useProgressStore((s) => s.quizScores);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const quizCount = Object.keys(quizScores).length;

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />
      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-12">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="glass-panel mb-10">
          <p className="eyebrow">Protocol Architecture Lab</p>
          <h1 className="display-title mt-3">Interactive First-Principles Blockchain Systems School</h1>
          <p className="mt-4 max-w-4xl text-base text-slate-300 sm:text-lg">Architecture-first, causal, validator-runtime mental model training from state fundamentals to advanced Solana protocol design.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="phase-order">Completed phases: {completed.length}/{phases.length}</span>
            <span className="phase-order">Quizzes attempted: {quizCount}</span>
            <button type="button" className="term-chip" onClick={resetProgress} aria-label="reset-progress">Reset Progress</button>
            <Link href="/architecture/defi-systems" className="term-chip">DeFi Case Studies</Link>
            <Link href="/architecture/validators" className="term-chip">System Diagrams</Link>
          </div>
        </motion.header>

        <section className="panel mb-8">
          <h2 className="section-title">Learning Progression</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {phases.map((phase) => {
              const unlocked = isPhaseUnlocked(completed, phase.id);
              const done = completed.includes(phase.id);
              return (
                <Link
                  key={phase.id}
                  href={unlocked ? `/learn/${phase.id}` : "#"}
                  className={`phase-card ${!unlocked ? "opacity-50 pointer-events-none" : ""}`}
                  aria-disabled={!unlocked}
                >
                  <span className="phase-order">Phase {phase.order} {done ? "• Complete" : ""}</span>
                  <span className="phase-title">{phase.title}</span>
                  <span className="phase-objective">{phase.objective}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panel mb-8">
          <h2 className="section-title">Runtime Simulators</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {simulators.map((sim) => {
              const unlocked = isSimulatorUnlocked(completed, sim.id);
              const req = simulatorUnlockRequirement[sim.id];
              const reqTitle = phases.find((p) => p.id === req)?.title ?? req;
              return (
                <Link key={sim.id} href={`/simulators/${sim.id}`} className={`sim-card ${!unlocked ? "opacity-70" : ""}`}>
                  <p className="sim-title">{sim.title} {unlocked ? "" : "(Locked)"}</p>
                  <p className="sim-focus">{sim.focus}</p>
                  <p className="sim-meta">Actors: {sim.actors.join(" • ")}</p>
                  {!unlocked ? <p className="sim-meta">Unlock by completing: {reqTitle}</p> : null}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <h2 className="section-title">Glossary In System Context</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {glossary.map((g) => (
              <article className="lens-item" key={g.term}>
                <p className="lens-question">{g.term}</p>
                <p className="lens-answer">{g.explanation}</p>
                <p className="term-why">Why it exists: {g.whyItExists}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
