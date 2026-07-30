"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";

export default function CompanySection() {
  const t = useTranslations("About.company");

  return (
    <section className="relative overflow-hidden bg-white">

      {/* ================= Glow ================= */}

      <div
        className="
          absolute
          left-1/2
          top-0
          -translate-x-1/2

          h-[220px]
          w-[900px]

          rounded-full
          bg-[#7FE9FF]/35
          blur-[120px]
        "
      />

      {/* ========================================================= */}

      <div className="relative mx-auto max-w-[1440px]">

        {/* ================= OUR PROFILE ================= */}

        <div className="relative pt-10 lg:pt-16">

          <Image
            src="/images/ourprofile.png"
            alt="Our Profile"
            width={340}
            height={95}
            className="
              w-[185px]

              sm:w-[220px]

              md:w-[255px]

              lg:w-[305px]
            "
          />

        </div>

        {/* ================= DESCRIPTION ================= */}

        <div
          className="
            relative

            mt-7

            flex

            flex-col

            gap-10

            px-6

            lg:flex-row

            lg:items-end

            lg:px-10
          "
        >

          {/* TEXT */}

          <div className="flex-1">

            <p
              className="
                max-w-[980px]

                text-[13px]

                leading-7

                text-[#5F6368]

                md:text-[14px]

                lg:text-[16px]
              "
            >
              {t("profileDescription")}
            </p>

          </div>

          {/* LOGO */}

          <div
            className="
              flex

              justify-end

              lg:w-[280px]
            "
          >

            <Image
              src="/images/pErmana.png"
              alt="Permana"

              width={185}
              height={60}

              className="
                w-[150px]

                md:w-[170px]

                lg:w-[190px]
              "
            />

          </div>

        </div>

        {/* ========================================================= */}

        <div
          className="
            relative

            mt-20

            px-6

            lg:px-10
          "
        >

          {/* DOT PATTERN */}

          <Image
            src="/images/bgkiripermana.png"
            alt=""

            width={340}
            height={520}

            className="
              absolute

              -left-16

              -top-12

              -z-10

              hidden

              opacity-90

              lg:block

              lg:w-[270px]
            "
          />

          {/* TITLE */}

          <h2
            className="
              font-serif

              text-[#005D86]

              text-[32px]

              font-bold

              lg:text-[44px]
            "
          >
            Permana Solutions
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-6

              max-w-[980px]

              text-[14px]

              leading-8

              text-[#5F6368]

              lg:text-[16px]
            "
          >
            {t("companyDescription")}
          </p>

        </div>
                {/* ========================================================= */}
        {/* VISION & MISSION */}
        {/* ========================================================= */}

        <div
          className="
            relative

            mt-24

            px-6

            lg:px-10
          "
        >

          {/* Background Dot */}

          <Image
            src="/images/bgkiripermana.png"
            alt=""
            width={320}
            height={520}
            className="
              absolute

              -left-12

              top-28

              -z-10

              hidden

              opacity-60

              lg:block

              lg:w-[240px]
            "
          />

          <div
            className="
              grid

              gap-16

              lg:grid-cols-[260px_1fr]

              lg:gap-24

              items-start
            "
          >

            {/* LEFT */}

            <div>

              <Image
                src="/images/visionmission.png"
                alt="Vision Mission"
                width={300}
                height={90}
                className="
                  w-[190px]

                  md:w-[230px]

                  lg:w-[260px]
                "
              />

            </div>

            {/* RIGHT */}

            <div className="max-w-[760px]">

              {/* Vision */}

              <h3
                className="
                  font-serif

                  text-[#005D86]

                  text-[34px]

                  font-bold

                  lg:text-[42px]
                "
              >
                {t("visionTitle")}
              </h3>

              <p
                className="
                  mt-5

                  text-[15px]

                  leading-8

                  text-[#5F6368]

                  lg:text-[16px]
                "
              >
                {t("vision")}
              </p>

              {/* Mission */}

              <h3
                className="
                  mt-12

                  font-serif

                  text-[#005D86]

                  text-[34px]

                  font-bold

                  lg:text-[42px]
                "
              >
                {t("missionTitle")}
              </h3>

              <ol
                className="
                  mt-6

                  space-y-4

                  pl-5

                  text-[15px]

                  leading-8

                  text-[#5F6368]

                  lg:text-[16px]
                "
              >
                <li>{t("mission1")}</li>
                <li>{t("mission2")}</li>
                <li>{t("mission3")}</li>
                <li>{t("mission4")}</li>
                <li>{t("mission5")}</li>
              </ol>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* MEET OUR TEAM HEADER */}
        {/* ========================================================= */}

        <div
          className="
            mt-28

            px-6

            text-center

            lg:px-10
          "
        >

          <h2
            className="
              font-sans

              font-bold

              text-[#005D86]

              text-[34px]

              leading-tight

              lg:text-[48px]
            "
          >
            Meet Our Exceptional Team
          </h2>

          <h3
            className="
              mt-2

              font-sans

              font-bold

              text-[#005D86]

              text-[28px]

              leading-tight

              lg:text-[42px]
            "
          >
            The People Behind Permana Solutions
          </h3>

          <p
            className="
              mx-auto

              mt-4

              max-w-[760px]

              text-[14px]

              leading-7

              text-[#6B7280]

              lg:text-[15px]
            "
          >
            Driven by innovation and united by shared values, our professionals
            work together to deliver reliable technology solutions and the best
            experience for every client.
          </p>

        </div>

      </div>

    </section>
  );
}