export interface Fact {
  label: string;
  value: string;
}

/** Horizontal list of key facts. Missing values are simply not passed in. */
export function FactsBar({ facts, className = "" }: { facts: Fact[]; className?: string }) {
  if (facts.length === 0) return null;
  return (
    <dl className={`grid grid-cols-2 border-y border-line sm:flex sm:flex-wrap ${className}`}>
      {facts.map((f, i) => (
        <div key={f.label} className={`py-6 pr-8 sm:min-w-40 ${i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}`}>
          <dt className="eyebrow text-mist">{f.label}</dt>
          <dd className="mt-2 font-display text-[1.625rem] leading-none text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
