"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SolutionItem = {
  title: string;
  description: string;
  includesTitle: string;
  includes: string[];
};

export default function BestSolutionsSection() {
  const t = useTranslations("Solutions.bestSolutions");

  const items = t.raw("items") as SolutionItem[];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-15 px-6 md:px-10 lg:flex-row lg:gap-20 lg:px-20">
        {/* Left */}
        <div className="w-full lg:w-[280px] lg:shrink-0">
          <p className="text-3xl font-bold text-[#04BCBC] md:text-4xl">
            {t("our")}
          </p>

          <h2 className="mt-2 text-3xl font-bold leading-tight text-[#00628D] md:text-4xl">
            {t("title")}
          </h2>
        </div>

        {/* ================= MOBILE & TABLET ================= */}
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:hidden">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#E8EEF3] bg-white p-6 shadow-sm"
            >
              <h3 className="min-h-[60px] text-xl font-bold leading-7 text-[#00628D]">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                {item.description}
              </p>

              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="mt-6 flex items-center gap-2 font-semibold text-[#04BCBC]"
              >
                {t("button")}
                <span
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-90" : ""
                  }`}
                >
                  →
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "mt-5 max-h-[500px]" : "max-h-0"
                }`}
              >
                <h4 className="mb-3 text-sm font-semibold text-[#04BCBC]">
                  {item.includesTitle}
                </h4>

                <ul className="space-y-2">
                  {item.includes.map((include, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[#6B7280]"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#04BCBC]" />
                      <span>{include}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="relative hidden flex-1 lg:block">
          <div
            ref={scrollRef}
            className="flex gap-12 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="min-w-[calc((100%-6rem)/3)] max-w-[calc((100%-6rem)/3)] flex-shrink-0"
              >
                <h3 className="min-h-[65px] text-[20px] font-bold leading-7 text-[#00628D]">
                  {item.title}
                </h3>

                <div className="mt-4">
                  {openIndex === index ? (
  <div
    onClick={() => setOpenIndex(null)}
    className="
      mt-5
      w-fit
      max-w-full
      cursor-pointer
      rounded-tl-[28px]
      rounded-tr-[1px]
      rounded-bl-[28px]
      rounded-br-[1px]
      border border-[#E6EDF2]
      bg-white
      px-5
      py-4
      shadow-[0_4px_12px_rgba(0,0,0,0.25)]
      transition-all
      duration-300
    "
  >
    <h4 className="mb-2 text-[13px] font-semibold text-[#04BCBC]">
      {item.includesTitle}
    </h4>

    <ul className="space-y-1">
      {item.includes.map((include, i) => (
        <li
          key={i}
          className="ml-4 list-disc text-[13px] leading-6 text-[#6B7280]"
        >
          {include}
        </li>
      ))}
    </ul>
  </div>
) : (
                    <>
                      <p className="text-sm leading-7 text-[#6B7280]">
                        {item.description}
                      </p>

                      <button
                        onClick={() => setOpenIndex(index)}
                        className="mt-6 flex items-center gap-2 font-semibold text-[#04BCBC] transition-all duration-300 hover:gap-3"
                      >
                        {t("button")}
                        <span>→</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Swipe Indicator */}
          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-[-24px] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition duration-300 hover:scale-110"
          >
            <span className="text-3xl leading-none text-[#04BCBC]/70">
              ❯
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}