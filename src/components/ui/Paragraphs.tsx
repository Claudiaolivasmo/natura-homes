/**
 * Renders plain-text content as paragraphs (split on blank lines).
 * Content is never parsed as HTML, so data files cannot inject markup.
 */
export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div className={`space-y-5 ${className}`}>
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-line">{p}</p>
      ))}
    </div>
  );
}
