
"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type ShowcaseItem = {
  title: string;
  description: string;
};

export default function SmartSystemShowcaseSection() {
  const t = useTranslations("SmartSystemShowcase");

  const showcaseItems = t.raw("items") as ShowcaseItem[];

  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = scrollRef.current;

    setShowLeftArrow(scrollLeft > 10);

    setShowRightArrow(
      scrollLeft + clientWidth < scrollWidth - 10
    );
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="smart-system-showcase-heading"
      className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* ================= HEADING ================= */}

        <header className="mb-12 flex flex-col items-center">
          <div className="flex flex-col items-center md:flex-row md:gap-3">

            <span className="text-5xl font-bold text-[#00628d]">
              {t("why")}
            </span>

            <h2
              id="smart-system-showcase-heading"
              className="
                px-4
                text-center
                text-4xl
                font-thin
                leading-tight
                break-words
                text-black
                sm:px-6
                md:px-0
                md:text-5xl
                lg:text-6xl
              "
            >
              {t("heading")}
            </h2>

          </div>
        </header>


        {/* ================= CARDS ================= */}

        <div className="relative">

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            role="list"
            aria-label={t("aria")}
            className="
              no-scrollbar
              flex
              gap-4
              overflow-x-auto
              snap-x
              snap-mandatory
              scroll-smooth
              md:gap-2
              md:flex-row
              md:overflow-x-auto
              md:pb-4
            "
          >

            {showcaseItems.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                role="listitem"
                className="
                  min-w-full
                  snap-center
                  rounded-xl
                  bg-white
                  p-6
                  md:min-w-[300px]
                "
              >

                {/* Service Title */}

                <div className="mb-5 flex justify-center">
                  <div
                    className="
                      flex
                      h-[78px]
                      w-[250px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#04bcbc]
                      shadow
                    "
                  >
                    <h3
                      className="
                        px-5
                        text-center
                        text-base
                        font-semibold
                        leading-tight
                        text-white
                      "
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>


                {/* Description */}

                <p
                  className="
                    mx-auto
                    max-w-[350px]
                    text-center
                    text-[14px]
                    font-medium
                    leading-[22px]
                    tracking-[0.01em]
                    text-[#5F6368]
                  "
                >
                  {item.description}
                </p>

              </article>
            ))}

          </div>


          {/* ================= LEFT ARROW ================= */}

          {showLeftArrow && (
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="
                absolute
                left-[-12px]
                top-1/2
                z-10
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/90
                shadow-xl
                backdrop-blur-sm
                transition
                duration-300
                hover:scale-110
                md:left-[-24px]
                md:h-12
                md:w-12
              "
            >
              <span
                className="
                  text-2xl
                  leading-none
                  text-[#04BCBC]/70
                  md:text-3xl
                "
              >
                ❮
              </span>
            </button>
          )}


          {/* ================= RIGHT ARROW ================= */}

          {showRightArrow && (
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Scroll right"
              className="
                absolute
                right-[-12px]
                top-1/2
                z-10
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/90
                shadow-xl
                backdrop-blur-sm
                transition
                duration-300
                hover:scale-110
                md:right-[-24px]
                md:h-12
                md:w-12
              "
            >
              <span
                className="
                  text-2xl
                  leading-none
                  text-[#04BCBC]/70
                  md:text-3xl
                "
              >
                ❯
              </span>
            </button>
          )}

        </div>

      </div>
    </section>
  );
}

