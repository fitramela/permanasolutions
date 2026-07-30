"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAbout() {
  const t = useTranslations("About.hero");

  return (
    <section className="relative w-full overflow-hidden">

      {/* ================= HERO ================= */}

      <div
        className="
          relative
          h-[420px]
          sm:h-[500px]
          lg:h-[650px]
          xl:h-[680px]
        "
      >

        {/* Background */}

        <Image
          src="/images/orngdkk.png"
          alt="About Us"
          fill
          priority
          sizes="100vw"
          className="
            object-cover

            object-[72%_center]

            md:object-[76%_center]

            lg:object-[82%_center]
          "
        />

        {/* Gradient Overlay */}

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-r

            from-[#6A95AA]/75

            via-[#88AFC0]/35

            to-transparent
          "
        />

        {/* Content */}

        <div className="relative z-10 h-full">

          <div
            className="
              mx-auto

              flex

              h-full

              max-w-[1440px]

              items-center

              px-7

              md:px-10

              lg:px-14
            "
          >

            <div
              className="
                max-w-[460px]

                lg:max-w-[470px]
              "
            >

              {/* Title */}

              <h1
                className="
                  font-serif

                  font-semibold

                  text-white

                  text-[38px]

                  leading-tight

                  md:text-[44px]

                  lg:text-[50px]

                  lg:leading-[58px]
                "
              >
                {t("title")}
              </h1>

              {/* Description */}

              <p
                className="
                  mt-7

                  text-white

                  text-[14px]

                  leading-[24px]

                  md:text-[15px]

                  md:leading-[26px]

                  lg:max-w-[430px]
                "
              >
                {t("description")}
              </p>

              {/* Decoration */}

              <Image
                src="/images/Decore.png"
                alt=""
                width={220}
                height={16}
                className="
                  mt-6

                  w-[170px]

                  lg:w-[220px]
                "
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}