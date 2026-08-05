"use client";

import { useRef } from "react";
import TeamCard from "./teamcard";
import { teamData } from "./teamdata";

export default function TeamSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const cardWidth = 320 + 24; // lebar card + gap

    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="
        relative
        py-[90px]

        overflow-visible
      "
    >
      {/* Glow kiri */}

      <div
        className="
          absolute
          left-[-180px]
          top-[180px]

          h-[340px]
          w-[340px]

          rounded-full

          bg-[#F3F3F3]

          blur-[120px]
        "
      />

      {/* Glow kanan */}

      <div
        className="
          absolute
          right-[-180px]
          bottom-[60px]

          h-[340px]
          w-[340px]

          rounded-full

          bg-[#B5F1FF]/20

          blur-[120px]
        "
      />

      <div className="relative">

        {/* Arrow Left */}

        <button
          onClick={() => scroll("left")}
          className="
            absolute

            left-[20px]
            top-1/2

            -translate-y-1/2

            z-30

            flex
            items-center
            justify-center

            w-[54px]
            h-[54px]

            rounded-full

            bg-white

            shadow-lg

            transition

            hover:scale-105
          "
        >
          ❮
        </button>

        {/* Arrow Right */}

        <button
          onClick={() => scroll("right")}
          className="
            absolute

            right-[20px]
            top-1/2

            -translate-y-1/2

            z-30

            flex
            items-center
            justify-center

            w-[54px]
            h-[54px]

            rounded-full

            bg-white

            shadow-lg

            transition

            hover:scale-105
          "
        >
          ❯
        </button>

        {/* Slider */}

        <div
          ref={sliderRef}
          className="
            flex

            gap-6

            overflow-x-auto
            overflow-y-visible
            
            w-full
            h-auto
            
            scroll-smooth
            scrollbar-hide

            px-[70px]
            pt-[80px]
            pb-[30px]
          "
        >
          {teamData.map((member) => (
            <div
              key={member.id}
              className="
                shrink-0

                w-[320px]

                md:w-[310px]

                xl:w-[300px]
              "
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}