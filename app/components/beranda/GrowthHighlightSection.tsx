"use client";

import { useTranslations } from "next-intl";

export default function GrowthHighlightSection() {
  const t = useTranslations("WhoWeAre");

  return (
    <section
      aria-labelledby="growth-highlight-section-title"
      className="relative py-20"
    >
      {/* Background Full */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[95%] rounded-r-[180px] bg-[#05638B]"
      />

      {/* Shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 right-0 translate-x-3 translate-y-3 rounded-r-[180px] bg-[#04BCBC]/30 blur-2xl"
      />

      {/* Content */}
      {/* <div className="relative z-10 mx-auto w-full px-10 xl:px-16 text-center text-white">
        <h2
          id="growth-highlight-section-title"
          className="text-3xl font-bold md:text-4xl"
        >
          {t("title")}
        </h2>

        <p className="mx-auto mt-8 max-w-4xl text-justify text-base leading-8 md:text-lg">
          {t("description")}
        </p>
      </div> */}
    </section>
  );
}