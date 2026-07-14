"use client";

import { useState } from "react";
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

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 md:px-10 lg:flex-row lg:gap-20 lg:px-20">
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
                  openIndex === index
                    ? "mt-5 max-h-[500px]"
                    : "max-h-0"
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
        <div className="hidden flex-1 gap-12 overflow-x-auto pb-4 scrollbar-hide lg:flex">
          {items.map((item, index) => (
            <div
              key={index}
              className="min-w-[260px] max-w-[260px] flex-shrink-0"
            >
              <h3 className="min-h-[65px] text-[20px] font-bold leading-7 text-[#00628D]">
                {item.title}
              </h3>

              <div className="group relative mt-4">
                {/* Default */}
                <div className="transition-all duration-300 group-hover:hidden">
                  <p className="text-sm leading-7 text-[#6B7280]">
                    {item.description}
                  </p>

                  <button className="mt-6 flex items-center gap-2 font-semibold text-[#04BCBC] transition-all duration-300 group-hover:gap-3">
                    {t("button")}
                    <span>→</span>
                  </button>
                </div>

                {/* Hover */}
                <div className="hidden rounded-[22px] border border-[#E8EEF3] bg-white p-5 shadow-[0_10px_25px_rgba(0,0,0,0.12)] group-hover:block">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}