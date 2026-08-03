"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function VisionMission() {
  const t = useTranslations("About");

  const missions = t.raw("visionMission.missions") as string[];

  return (
    <section
      className="
        relative
        py-[130px]
      "
    >
      {/* Left Decoration */}

      <Image
        src="/images/bgkiripng.png"
        alt=""
        aria-hidden
        width={310}
        height={1200}
        className="
          absolute
          left-[-110px]
          top-[60px]
          w-[310px]
          h-auto
          opacity-90
          select-none
        "
      />

      <div
        className="
          relative
          grid
          items-start
          gap-[90px]
          lg:grid-cols-[360px_1fr]
        "
      >
        {/* ================= LEFT ================= */}

        <div>
          <Image
            src="/images/ourProfileRibbon.png"
            alt="Vision & Mission"
            width={430}
            height={80}
            priority
            className="
              w-[430px]
              h-auto
              select-none
            "
          />
        </div>

        {/* ================= RIGHT ================= */}

        <div>
          {/* Vision */}

          <h2
            className="
              text-[50px]
              font-bold
              leading-none
              text-[#005D86]
            "
          >
            {t("visionMission.visionTitle")}
          </h2>

          <p
            className="
              mt-8
              max-w-[760px]
              text-[16px]
              leading-[34px]
              text-[#666666]
            "
          >
            {t("visionMission.visionDescription")}
          </p>

          {/* Mission */}

          <h2
            className="
              mt-[80px]
              text-[50px]
              font-bold
              leading-none
              text-[#005D86]
            "
          >
            {t("visionMission.missionTitle")}
          </h2>

          <ol
            className="
              mt-8
              max-w-[800px]
              space-y-6
              pl-6
              list-decimal
              text-[16px]
              leading-[34px]
              text-[#666666]
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