"use client";

import { useState } from "react";
import type { Experience } from "@/schemas/content";
import { ConciergeRequestForm } from "@/components/forms/ConciergeRequestForm";
import { ExperiencePricing } from "./ExperiencePricing";

interface Props {
  experience: Experience;
  locale: string;
  options: { slug: string; title: string }[];
}

export function ExperienceRequestPanel({ experience, locale, options }: Props) {
  const [pricingSelection, setPricingSelection] = useState("");

  return (
    <>
      <ExperiencePricing experience={experience} onSelectionChange={setPricingSelection} />
      <div className="mt-8">
        <ConciergeRequestForm
          options={options}
          preselected={[experience.slug]}
          pricingSelection={pricingSelection}
        />
      </div>
    </>
  );
}
