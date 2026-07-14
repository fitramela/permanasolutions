"use client";

import { useTranslations } from "next-intl";

export default function Company() {
  const t = useTranslations("About.company");

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">

        <h2 className="font-serif text-4xl font-bold text-[#005D86]">
          {t("title")}
        </h2>

        <p className="mt-5 max-w-5xl text-gray-600 leading-8">
          {t("description")}
        </p>

      </div>
    </section>
  );
}