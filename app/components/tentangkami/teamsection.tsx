"use client";

import useEmblaCarousel from "embla-carousel-react";

import TeamCard from "./teamcard";
import { teamData } from "./teamdata";
import ArrowButton from "./ArrowButton";
import DotPattern from "./DotPattern";

export default function TeamSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: true,
    loop: false,
  });

  return (
   <section
  className="
    relative

    w-full
    min-h-screen

    overflow-hidden

    bg-[#F3F3F3]

    pt-24
    md:pt-28
    lg:pt-32

    pb-24
    md:pb-32
  "
>

      {/* Pattern kiri */}

      <DotPattern
        className="
          absolute
          hidden
          lg:block

          left-10
          top-40
          z-0
        "
      />

      {/* Pattern kanan */}

      <DotPattern
        className="
          absolute
          hidden
          lg:block

          right-10
          bottom-20
          rotate-180
          z-0
        "
      />

   <div className="relative w-full z-10">
        {/* Arrow kiri */}

        <ArrowButton
          direction="left"
          onClick={() => emblaApi?.scrollPrev()}
          className="
            absolute

            left-2
            md:left-4
            lg:left-6

            top-[320px]
            lg:top-[360px]

            -translate-y-1/2
            z-30
          "
        />

        {/* Arrow kanan */}

        <ArrowButton
          direction="right"
          onClick={() => emblaApi?.scrollNext()}
          className="
            absolute

            right-2
            md:right-4
            lg:right-6

            top-[320px]
            lg:top-[360px]

            -translate-y-1/2
            z-30
          "
        />

        {/* Embla */}

       <div
  ref={emblaRef}
  className="
    overflow-hidden
    cursor-grab
    active:cursor-grabbing
  "
>
          <div
            className="
              flex

              gap-6
              lg:gap-[34px]

              items-start

              pt-[110px]
              pb-5
            "
          >
            {teamData.map((member) => (
              <div
                key={member.id}
                className="
                  flex-[0_0_320px]
                  select-none
                "
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}