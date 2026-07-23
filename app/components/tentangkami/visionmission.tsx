"use client";

import { useTranslations } from "next-intl";

export default function VisionMission() {
  const t = useTranslations("About.visionMission");

  const missions = t.raw("missions") as string[];

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-16">

        {/* Left */}

        <div>

          <div className="inline-flex items-center rounded-r-full bg-[#E4F3FB] px-10 py-5">
            <h2 className="font-serif text-4xl font-bold text-[#005D86]">
              {t("title")}
            </h2>
          </div>

        </div>

        {/* Right */}

        <div>

          <h3 className="font-serif text-4xl font-bold text-[#005D86]">
            {t("visionTitle")}
          </h3>

          <p className="mt-4 text-gray-600 leading-8">
            {t("visionDescription")}
          </p>

          <h3 className="mt-12 font-serif text-4xl font-bold text-[#005D86]">
            {t("missionTitle")}
          </h3>

          <ol className="mt-6 space-y-4 text-gray-600">

            {missions.map((item, index) => (
              <li key={index}>
                {index + 1}. {item}
              </li>
            ))}

          </ol>

        </div>

      </div>
    </section>
  );
}