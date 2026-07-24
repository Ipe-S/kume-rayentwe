import type { SectionHeaderProps } from "@/types";

export default function SectionHeader({
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
          light ? "text-white" : "text-text-main"
        }`}
      >
        {title}
      </h2>

      {/* Decorative line */}
      <div
        className={`h-1 w-16 rounded-full mb-4 ${
          centered ? "mx-auto" : ""
        } ${light ? "bg-secondary" : "bg-primary-light"}`}
        aria-hidden="true"
      />

      {subtitle && (
        <p
          className={`text-lg leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/80" : "text-text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
