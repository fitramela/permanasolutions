"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

type ShowcaseItem = {
  title: string;
  description: string;
};

export default function SmartSystemShowcaseSection() {
  const t = useTranslations("SmartSystemShowcase");

  const showcaseItems = t.raw("items") as ShowcaseItem[];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="smart-system-showcase-heading"
      className="w-full bg-[#04bcbc0a] py-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <header className="mb-12 flex flex-col items-center">
          <div className="flex flex-col items-center md:flex-row md:gap-3">
            <span className="text-6xl font-bold text-[#00628d]">
              {t("why")}
            </span>

            <h2
              id="smart-system-showcase-heading"
              className="text-center text-4xl font-extralight text-black md:text-5xl"
            >
              {t("heading")}
            </h2>
          </div>
        </header>

        {/* Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            role="list"
            aria-label={t("aria")}
            className="
              flex gap-4
              overflow-x-auto
              snap-x snap-mandatory
              scroll-smooth
              no-scrollbar

              md:gap-2
              md:flex-row
              md:overflow-x-auto
              md:pb-4
            "
          >
            {showcaseItems.map((item, index) => (
              <article
                key={index}
                role="listitem"
                className="
                  snap-center
                  min-w-full
                  rounded-xl
                  bg-white
                  p-6
                  shadow-md

                  md:min-w-[300px]
                "
              >
                <div className="mb-5 flex justify-center">
                  <div className="flex h-[78px] w-[250px] items-center justify-center rounded-full bg-[#04bcbc] shadow">
                    <h3 className="px-5 text-center text-base font-semibold leading-tight text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-center text-sm leading-7 text-gray-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

       {/* Swipe Indicator */}
<button
  type="button"
  onClick={scrollRight}
  className="
    absolute
    z-10

    right-[-12px]
    md:right-[-24px]

    top-1/2
    -translate-y-1/2

    flex
    h-10
    w-10
    md:h-12
    md:w-12
    items-center
    justify-center

    rounded-full
    bg-white/90
    shadow-xl
    backdrop-blur-sm

    transition
    duration-300
    hover:scale-110
  "
>
  <span className="text-2xl md:text-3xl leading-none text-[#04BCBC]/70">
    ❯
  </span>
</button>
        </div>
      </div>
    </section>
  );
}