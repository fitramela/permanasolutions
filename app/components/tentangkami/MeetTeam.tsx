"use client";

import { useTranslations } from "next-intl";

export default function MeetTeam() {
  const t = useTranslations("About");

  return (
    <section className="py-[30px]">
      <div
        className="
          mx-auto
          flex
          flex-col
          items-center
          text-center
           -mt-[110px]   /* naik */
        "
      >
        {/* Title */}

        <h2
          className="
            text-[40px]
            font-bold
            leading-none
            text-[#005D86]
          "
        >
          {t("team.title")}
        </h2>

        {/* Subtitle */}

        <h3
          className="
            mt-[8px]

            text-[43px]
            font-bold
            leading-none

            text-[#005D86]
          "
        >
          {t("team.subtitle")}
        </h3>

        {/* Description */}

        <p
          className="
            mt-[8px]

            max-w-[1020px]

            text-[15px]
            leading-[28px]

            text-[#666666]
          "
        >
          {t("team.description")}
        </p>
      </div>
    </section>
  );
}