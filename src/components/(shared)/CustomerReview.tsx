"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    role: "Postdoctoral Researcher",
    org: "Stanford University",
    content:
      "The caliber of mentors on Mentora is exceptional. I found a Neural Networks specialist who helped me skip months of trial and error in my research.",
    avatar: "https://i.pravatar.cc/150?u=aris",
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    role: "Senior VP of Engineering",
    org: "TechFlow Systems",
    content:
      "We use Mentora for executive upskilling. Its ability to vet for both technical depth and teaching quality sets it apart.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    id: 3,
    name: "Elena Rossi",
    role: "UX Design Lead",
    org: "Creative Collective",
    content:
      "Seamless, intuitive, and effective. The one-on-one classroom feels in-person and transformed our internal training workflow.",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
];

export function PremiumReviews() {
  return (
    <section className="relative overflow-hidden py-24 text-slate-900 dark:bg-[#050505] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.06),transparent_24%)] dark:bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.08),transparent_24%)]" />
      <div className="container mx-auto px-6">
        <div className="grid items-start gap-16 lg:grid-cols-12">
          {/* Left Column: The "Hero" Social Proof */}
          <div className="lg:sticky lg:top-32 lg:col-span-5">
            <Badge className="mb-6 rounded-full border border-primary/20 bg-primary/10 px-4 text-primary shadow-sm dark:bg-white/5 dark:text-primary-200">
              Social Proof
            </Badge>
            <h2 className="mb-8 text-4xl font-bold tracking-tighter leading-[1.08] md:text-6xl">
              Validated by <br />
              <span className="font-serif italic text-slate-600 dark:text-slate-300">
                industry leaders
              </span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar
                      key={i}
                      className="h-10 w-10 border-2 border-white shadow-sm dark:border-[#050505]"
                    >
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                      />
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Join{" "}
                  <span className="text-slate-900 dark:text-white">
                    12,400+
                  </span>{" "}
                  certified professionals
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:border-white/[0.05] dark:bg-white/[0.02] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    99.2% Satisfaction Rate
                  </p>
                  <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Post-session audit 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Testimonial Feed */}
          <div className="space-y-6 lg:col-span-7">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-primary/25 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:p-10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-primary/30 dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-70" />
                <Quote className="absolute right-8 top-8 h-12 w-12 text-slate-900/[0.05] transition-colors group-hover:text-primary/10 dark:text-white/[0.03]" />

                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-primary text-primary"
                    />
                  ))}
                </div>

                <blockquote className="mb-10 text-xl font-medium leading-relaxed text-slate-700 italic font-serif md:text-2xl dark:text-slate-200">
                  &ldquo;{t.content}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 grayscale transition-all duration-500 hover:grayscale-0">
                      <AvatarImage src={t.avatar} />
                      <AvatarFallback>{t.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="mb-1 text-lg font-bold leading-none text-slate-900 dark:text-white">
                        {t.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t.role} @{" "}
                        <span className="text-primary/90">{t.org}</span>
                      </p>
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
