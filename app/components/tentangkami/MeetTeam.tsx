"use client";

import { useTranslations } from "next-intl";

export default function MeetTeam() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        z-20

        w-full

        -mt-10
        md:-mt-16
        lg:-mt-24

        pb-8
        md:pb-12
      "
    >
      <div
        className="
          mx-auto

          w-full
          max-w-[1200px]

          px-6
          md:px-10

          flex
          flex-col
          items-center
          text-center
        "
      >
        {/* Title */}

        <h2
          className="
            font-bold

            text-[#005D86]

            text-[28px]
            sm:text-[34px]
            lg:text-[40px]

            leading-tight
          "
        >
          {t("team.title")}
        </h2>

        {/* Subtitle */}

        <h3
          className="
            mt-2

            font-bold

            text-[#005D86]

            text-[30px]
            sm:text-[38px]
            lg:text-[44px]

            leading-tight
          "
        >
          {t("team.subtitle")}
        </h3>

        {/* Description */}

        <p
          className="
            mt-1

            max-w-[1000px]

            text-[#666666]

            text-[14px]
            md:text-[15px]
            lg:text-[15px]

            leading-7
          "
        >
          {t("team.description")}
        </p>
      </div>
    </section>
  );
}