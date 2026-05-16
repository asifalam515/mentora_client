"use client";

import SectionReveal from "@/components/(shared)/SectionReveal";
import { motion } from "framer-motion";

const companies = [
  { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Nvidia", url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
  { name: "Ford", url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
  { name: "Coinbase", url: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Coinbase_wordmark.svg" },
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Shopify", url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
  { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
];

export default function TrustedCompanies() {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-slate-950">
      <SectionReveal>
        <div className="mx-auto max-w-4xl px-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Companies That Trust Our Services
          </h2>
        </div>
      </SectionReveal>

      <div className="relative border-y border-slate-100 bg-white py-8 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex min-w-max items-center gap-16 sm:gap-24 pr-16 sm:pr-24"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {/* Render items twice for seamless looping */}
            {[...companies, ...companies].map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center justify-center grayscale transition-all duration-300 hover:grayscale-0 opacity-70 hover:opacity-100 dark:brightness-200 dark:hover:brightness-100"
              >
                <img
                  src={company.url}
                  alt={`${company.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradients to fade out edges for a smoother look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-48 bg-gradient-to-r from-white to-transparent dark:from-slate-950"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-48 bg-gradient-to-l from-white to-transparent dark:from-slate-950"></div>
      </div>
    </section>
  );
}
