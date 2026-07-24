import type { ServiceCardProps } from "@/types";

export default function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <article className="group bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* Top accent line */}
      <div
        className="h-1 bg-primary-light -mt-6 -mx-6 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
        style={{ width: "calc(100% + 3rem)" }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          {icon}
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold text-text-main mb-2">
            {title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
