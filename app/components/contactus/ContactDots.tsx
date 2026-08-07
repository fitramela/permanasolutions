interface ContactDotsProps {
  variant?: "light" | "dark";
}

export default function ContactDots({
  variant = "light",
}: ContactDotsProps) {
  const color =
    variant === "light"
      ? "bg-white/35"
      : "bg-white/20";

  return (
    <div
      className="
        grid
        grid-cols-2

        gap-[18px]
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <span
          key={index}
          className={`
            w-[13px]
            h-[13px]
            rounded-full
            ${color}
          `}
        />
      ))}
    </div>
  );
}