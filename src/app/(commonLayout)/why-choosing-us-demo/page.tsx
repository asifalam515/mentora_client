"use client";

import { useState } from "react";

import WhyChoosingUs from "@/components/home/WhyChoosingUs";
import { WHY_CHOOSING_US_MOCK_DATA } from "@/components/home/why-choosing-us-data";

const WhyChoosingUsDemoPage = () => {
  const [ctaMessage, setCtaMessage] = useState("CTA not clicked yet.");

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <WhyChoosingUs
          testimonials={WHY_CHOOSING_US_MOCK_DATA.testimonials}
          metrics={WHY_CHOOSING_US_MOCK_DATA.metrics}
          onCtaClick={() => setCtaMessage("CTA clicked from the demo page.")}
        />

        <p
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
          data-testid="cta-status"
        >
          {ctaMessage}
        </p>
      </div>
    </main>
  );
};

export default WhyChoosingUsDemoPage;
