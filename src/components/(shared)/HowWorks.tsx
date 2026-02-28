"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";

const workflow = [
  {
    number: "01",
    title: "Creating Account and Applying  ",
    description:
      "After Creating Account we manually check every request for being at TUTOR then make sure they have enought skill",
    icon: ShieldCheck,
    tag: "Intelligence",
    features: ["Vetted Instructors", "Skill Gap Analysis"],
  },
  {
    number: "02",
    title: "Seamless Integration",
    description:
      "Coordinate across time zones with automated scheduling and direct calendar synchronization. Focus on learning, not logistics.",
    icon: Globe,
    tag: "Efficiency",
    features: ["Auto-Timezone Sync", "Calendar Push"],
  },
  {
    number: "03",
    title: "Accelerated Growth",
    description:
      "Engage in an immersive digital classroom equipped with interactive whiteboards, code-sharing, and session recording for review.",
    icon: Zap,
    tag: "Performance",
    features: ["HD Collaboration", "Resource Vault"],
  },
];

export function PremiumHowItWorks() {
  return (
    <section className="relative py-24 bg-[#050505] text-white overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Side: Sticky Content */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:h-fit">
            <Badge className="mb-6 bg-white/5 hover:bg-white/10 text-primary border-primary/20 backdrop-blur-md px-4 py-1">
              Methodology
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              Modern Platform for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                rapid mastery.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We've distilled the learning process into a high-performance
              workflow designed for professionals and ambitious students.
            </p>
            <button className="group flex items-center gap-2 font-semibold text-primary hover:text-white transition-colors">
              Explore the platform{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Side: Step Cards */}
          <div className="lg:w-2/3 space-y-8">
            {workflow.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Background Large Number */}
                <span className="absolute -right-4 -top-8 text-[12rem] font-bold text-white/[0.02] select-none group-hover:text-primary/[0.03] transition-colors">
                  {step.number}
                </span>

                <div className="relative p-8 md:p-12 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    {/* Icon Square */}
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/20 flex items-center justify-center">
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
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-xs font-medium text-slate-500">
                          {step.tag}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-lg max-w-xl">
                        {step.description}
                      </p>

                      {/* Feature Pills */}
                      <div className="flex flex-wrap gap-2 pt-4">
                        {step.features.map((feat) => (
                          <span
                            key={feat}
                            className="text-[10px] uppercase tracking-tighter font-bold px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300"
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
