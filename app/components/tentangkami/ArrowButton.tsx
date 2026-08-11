"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}

export default function ArrowButton({
  direction,
  onClick,
  className = "",
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center

        w-[64px]
        h-[64px]

        rounded-full

        bg-white

        shadow-[0_15px_35px_rgba(0,0,0,.12)]

        transition-all
        duration-300

        hover:scale-105
        hover:shadow-[0_20px_40px_rgba(0,0,0,.18)]

        ${className}
      `}
    >
      {direction === "left" ? (
        <ChevronLeft
          size={26}
          strokeWidth={2.5}
          className="text-[#0F172A]"
        />
      ) : (
        <ChevronRight
          size={26}
          strokeWidth={2.5}
          className="text-[#0F172A]"
        />
      )}
    </button>
  );
}