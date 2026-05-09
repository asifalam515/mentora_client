"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";

const workflow = [
  {
    number: "01",
    title: "Apply & Get Approved",
    description:
      "Create your account and submit your tutor profile. Every application is manually reviewed to ensure subject expertise and teaching quality.",
    icon: ShieldCheck,
    tag: "Trust",
    features: ["Manual Screening", "Quality Standards"],
  },
  {
    number: "02",
    title: "Smart Scheduling",
    description:
      "Coordinate across time zones with automated availability and calendar sync. Focus on learning, not logistics.",
    icon: Globe,
    tag: "Efficiency",
    features: ["Timezone Aware", "Calendar Sync"],
  },
  {
    number: "03",
    title: "Accelerate Outcomes",
    description:
      "Learn inside an immersive classroom with interactive tools, code sharing, and recordings for continuous improvement.",
    icon: Zap,
    tag: "Performance",
    features: ["Live Collaboration", "Session Replay"],
  },
];

export function PremiumHowItWorks() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100 py-24 text-slate-900 dark:from-slate-950 dark:via-[#050505] dark:to-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.06),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_26%)]" />
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* Left Side: Sticky Content */}
          <div className="lg:sticky lg:top-32 lg:h-fit lg:w-1/3">
            <Badge className="mb-6 border border-primary/20 bg-primary/10 px-4 py-1 text-primary shadow-sm backdrop-blur-md hover:bg-primary/15 dark:bg-white/5 dark:hover:bg-white/10">
              Methodology
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight leading-[1.1] md:text-5xl">
              Modern Platform for <br />
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent dark:to-blue-400">
                rapid mastery
              </span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              We distilled the learning journey into a high-performance workflow
              built for ambitious learners and serious tutors.
            </p>
            <button className="group inline-flex items-center gap-2 rounded-full border border-transparent bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100">
              Explore the platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Side: Step Cards */}
          <div className="lg:w-2/3 space-y-8">
            {workflow.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Background Large Number */}
                <span className="absolute -right-4 -top-8 select-none text-[12rem] font-bold text-slate-200/70 transition-colors group-hover:text-primary/10 dark:text-white/[0.02] dark:group-hover:text-primary/[0.03]">
                  {step.number}
                </span>

                <div className="relative rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_16px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(15,23,42,0.16)] md:p-12 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/[0.15] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-60" />
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    {/* Icon Square */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-blue-500/10 shadow-sm dark:from-primary/20">
                      <step.icon
                        className="h-7 w-7 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-primary tracking-widest uppercase">
                          Phase {step.number}
                        </span>
                        <div className="h-px w-8 bg-slate-300 dark:bg-white/10" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {step.tag}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                        {step.description}
                      </p>

                      {/* Feature Pills */}
                      <div className="flex flex-wrap gap-2 pt-4">
                        {step.features.map((feat) => (
                          <span
                            key={feat}
                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
