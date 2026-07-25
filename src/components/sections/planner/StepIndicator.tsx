interface StepIndicatorProps {
  steps: string[];
  current: number;
  onSelect?: (index: number) => void;
  maxReached: number;
}

export default function StepIndicator({
  steps,
  current,
  onSelect,
  maxReached,
}: StepIndicatorProps) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
      {steps.map((label, index) => {
        const isCurrent = index === current;
        const isDone = index < current;
        const isReachable = index <= maxReached;

        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={!isReachable || !onSelect}
              onClick={() => onSelect?.(index)}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                isCurrent
                  ? "bg-primary text-white"
                  : isDone
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-white text-text-muted border border-gray-200"
              } ${isReachable && onSelect ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  isCurrent
                    ? "bg-white text-primary"
                    : isDone
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-muted"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {index < steps.length - 1 && (
              <span className="w-4 sm:w-8 h-px bg-gray-300" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
