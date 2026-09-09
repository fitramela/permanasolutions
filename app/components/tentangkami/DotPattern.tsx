"use client";

interface DotPatternProps {
  className?: string;
}

export default function DotPattern({
  className = "",
}: DotPatternProps) {
  const dots = Array.from({ length: 100 });

  return (
    <>
      {/* LEFT */}

      <div
        className={`
          absolute

          left-[-60px]
          top-[150px]

          grid
          grid-cols-10

          gap-[14px]

          opacity-20

          pointer-events-none
          select-none

          ${className}
        `}
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="
              h-[4px]
              w-[4px]

              rounded-full

              bg-[#AFC6D4]
            "
          />
        ))}
      </div>

      {/* RIGHT */}

      <div
        className={`
          absolute

          right-[-60px]
          bottom-[120px]

          grid
          grid-cols-10

          gap-[14px]

          opacity-20

          pointer-events-none
          select-none

          ${className}
        `}
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="
              h-[4px]
              w-[4px]

              rounded-full

              bg-[#AFC6D4]
            "
          />
        ))}
      </div>
    </>
  );
}