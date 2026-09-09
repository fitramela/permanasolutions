"use client";

import Image from "next/image";

import type {
  CmsSectionContent,
} from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
};

function objectValue(
  source:
    | Record<string, unknown>
    | undefined,
  key: string
): Record<string, unknown> {
  const value =
    source?.[key];

  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as Record<
    string,
    unknown
  >;
}

function text(
  source:
    | Record<string, unknown>
    | undefined,
  key: string
): string {
  const value =
    source?.[key];

  return typeof value ===
    "string"
    ? value
    : "";
}

export default function HeroAboutUs({
  content,
}: Props) {
  const hero =
    objectValue(
      content,
      "hero"
    );

  const desktopImage =
    text(
      hero,
      "desktop_image"
    ) ||
    "/images/about-us.png";

  const mobileImage =
    text(
      hero,
      "mobile_image"
    ) ||
    "/images/herohp.png";

  const decorationImage =
    text(
      hero,
      "decoration_image"
    ) ||
    "/images/Decore.png";

  return (
    <main className="w-full overflow-x-hidden bg-white">

      {/* =====================================================
          HERO DESKTOP
      ===================================================== */}
      <section
        className="
          relative
          left-1/2
          hidden
          w-screen
          max-w-none
          -translate-x-1/2
          overflow-hidden
          lg:block
        "
      >
        {/* BACKGROUND DESKTOP */}
        <img
          src={desktopImage}
          alt="About Permana Solutions"
          className="
            block
            h-auto
            w-full
            max-w-none
            select-none
            pointer-events-none
          "
          draggable={false}
        />

        {/* =================================================
            CONTENT DESKTOP
        ================================================= */}
        <div className="absolute inset-0 z-20">

          {/* ABOUT US + DESCRIPTION + LINE */}
          <div
            className="
              absolute
              left-[5.5%]

              top-[31%]
              -translate-y-1/2

              w-[52%]
              max-w-[900px]
            "
          >
            {/* TITLE */}
            <h1
              className="
                text-[42px]
                font-bold
                leading-none
                text-white

                xl:text-[48px]
                2xl:text-[52px]
              "
            >
              {text(
                hero,
                "title"
              )}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-6
                max-w-[850px]

                text-[14px]
                leading-[1.5]
                text-white/95

                xl:text-[15px]
                2xl:text-[16px]
              "
            >
              {text(
                hero,
                "description"
              )}
            </p>

            {/* DECORATION LINE */}
            <Image
              src={decorationImage}
              alt=""
              width={750}
              height={8}
              priority
              className="
                mt-3
                block
                h-auto
                w-[90%]
                max-w-[750px]
                select-none
                pointer-events-none
              "
            />
          </div>

        </div>
      </section>


      {/* =====================================================
          HERO MOBILE / TABLET
      ===================================================== */}
      <section
        className="
          relative
          left-1/2
          block
          w-screen
          max-w-none
          -translate-x-1/2
          overflow-hidden
          lg:hidden
        "
      >
        {/* BACKGROUND MOBILE */}
        <img
          src={mobileImage}
          alt="About Permana Solutions Mobile"
          className="
            block
            h-auto
            w-full
            max-w-none
            select-none
            pointer-events-none
          "
          draggable={false}
        />

        {/* =================================================
            CONTENT MOBILE / TABLET
        ================================================= */}
        <div
          className="
            absolute
            left-[6%]
            top-[13%]
            z-20
            w-[88%]
          "
        >
          {/* TITLE */}
          <h1
            className="
              max-w-[240px]
              text-[34px]
              font-bold
              leading-[1.05]
              tracking-[-0.02em]
              text-white

              sm:max-w-[300px]
              sm:text-[42px]

              md:max-w-[380px]
              md:text-[50px]
            "
          >
            {text(
              hero,
              "title"
            )}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-2
              max-w-[280px]

              text-[11px]
              leading-[1.5]
              text-white/95

              sm:max-w-[370px]
              sm:text-[13px]

              md:max-w-[470px]
              md:text-[15px]
            "
          >
            {text(
              hero,
              "description"
            )}
          </p>

          {/* DECORATION LINE */}
          <Image
            src={decorationImage}
            alt=""
            width={500}
            height={8}
            priority
            className="
              mt-4
              h-auto
              w-[280px]

              sm:w-[360px]
              md:w-[460px]

              select-none
              pointer-events-none
            "
          />
        </div>

      </section>

    </main>
  );
}
