"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function VisionMission() {
  const t = useTranslations("About");
  const missions = t.raw("visionMission.missions") as string[];

  return (
    <section className="relative overflow-visible py-[170px]">

      {/* Background Ribbon */}
      <Image
        src="/images/visimisits.png"
        alt=""
        width={1800}
        height={450}
        priority
        className="
          absolute
          left-[-270px]
          top-[5px]

          w-[630px]
          h-auto

          pointer-events-none
          select-none
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-[1320px]

          grid
          grid-cols-[330px_1fr]

          gap-x-[90px]
          items-start
        "
      >
        {/* ================= LEFT ================= */}

        <div className="relative h-[170px]">
          <h2
            className="
              absolute
              left-[-40px]
              top-[-110px]

              text-[40px]
              font-bold
              leading-[1.05]

              text-[#005D86]
            "
          >
            {t("visionMission.title")}
          </h2>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="mt-[-140px]">

          <h2
            className="
              text-[40px]
              font-bold
              leading-none
              text-[#005D86]
            "
          >
            {t("visionMission.visionTitle")}
          </h2>

          <p
            className="
              mt-5
              max-w-[760px]

              text-[17px]
              leading-[28px]

              text-[#5C5C5C]
            "
          >
            {t("visionMission.visionDescription")}
          </p>

          <h2
            className="
              mt-[40px]

              text-[40px]
              font-bold
              leading-none

              text-[#005D86]
            "
          >
            {t("visionMission.missionTitle")}
          </h2>

          <ol
            className="
              mt-6
              pl-7

              max-w-[820px]

              list-decimal
              space-y-5

              text-[17px]
              leading-[28px]

              text-[#5C5C5C]
            "
          >
            {missions.map((mission, index) => (
              <li key={index}>{mission}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}