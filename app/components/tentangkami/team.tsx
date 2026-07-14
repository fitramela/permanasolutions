"use client";

import { useTranslations } from "next-intl";

export default function Team() {
  const t = useTranslations("About.team");

  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-6 text-center lg:px-16">

        <h2 className="font-serif text-4xl font-bold text-[#005D86]">
          {t("title")}
        </h2>

        <h3 className="mt-2 text-3xl font-bold text-[#005D86]">
          {t("subtitle")}
        </h3>

        <p className="mx-auto mt-4 max-w-4xl text-gray-600">
          {t("description")}
        </p>

      </div>

    </section>
  );
}