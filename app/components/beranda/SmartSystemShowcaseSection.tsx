"use client";

import { useTranslations } from "next-intl";

type ShowcaseItem = {
  title: string;
  description: string;
};

export default function SmartSystemShowcaseSection() {
  const t = useTranslations("SmartSystemShowcase");

  const showcaseItems = t.raw("items") as ShowcaseItem[];

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
        <div
          role="list"
          aria-label={t("aria")}
          className="flex gap-2 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
        >
          {showcaseItems.map((item, index) => (
            <article
              key={index}
              role="listitem"
              className="min-w-[300px] rounded-xl bg-white p-6 shadow-md"
            >
              <div className="mb-5 flex justify-center">
                <div className="rounded-full bg-[#04bcbc] px-6 py-4 shadow">
                  <h3 className="text-center text-base font-semibold text-white">
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
      </div>
    </section>
  );
}