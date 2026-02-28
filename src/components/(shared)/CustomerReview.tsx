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
      "The caliber of mentors on SkillBridge is unparalleled. I was able to find a specialist in Neural Networks who helped me bypass months of trial and error in my research.",
    avatar: "https://i.pravatar.cc/150?u=aris",
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    role: "Senior VP of Engineering",
    org: "TechFlow Systems",
    content:
      "We use SkillBridge for our executive upskilling. The platform's ability to vet for both technical depth and pedagogical skill is what sets it apart from competitors.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    id: 3,
    name: "Elena Rossi",
    role: "UX Design Lead",
    org: "Creative Collective",
    content:
      "Seamless, intuitive, and effective. The 1-on-1 interface feels like being in the same room. It has completely transformed our internal training workflow.",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
];

export function PremiumReviews() {
  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: The "Hero" Social Proof */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 rounded-full px-4">
              Social Proof
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-8">
              Validated by <br />
              <span className="text-slate-500 italic font-serif">
                industry leaders.
              </span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar
                      key={i}
                      className="border-2 border-[#050505] h-10 w-10"
                    >
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                      />
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  Join <span className="text-white">12,400+</span> certified
                  professionals
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    99.2% Satisfaction Rate
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Post-session audit 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Testimonial Feed */}
          <div className="lg:col-span-7 space-y-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] hover:border-primary/30 transition-all duration-500 group"
              >
                <Quote className="absolute top-8 right-10 h-12 w-12 text-white/[0.03] group-hover:text-primary/10 transition-colors" />

                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-primary text-primary"
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 mb-10 italic font-serif">
                  "{t.content}"
                </blockquote>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 grayscale hover:grayscale-0 transition-all duration-500">
                      <AvatarImage src={t.avatar} />
                      <AvatarFallback>{t.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-white text-lg leading-none mb-1">
                        {t.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {t.role} @{" "}
                        <span className="text-primary/80">{t.org}</span>
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
