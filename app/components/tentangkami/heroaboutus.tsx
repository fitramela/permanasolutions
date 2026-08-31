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
    "/images/cchero.png";

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
    <main className="overflow-x-hidden bg-white">

      {/* ================= HERO ================= */}

      <section
        className="
          relative
          h-[600px]
          overflow-hidden
          sm:h-[650px]
          md:h-[720px]
          lg:h-[1200px]
        "
      >

        {/* ================= BACKGROUND DESKTOP ================= */}

        <Image
          src={
            desktopImage
          }
          alt="About Permana Solutions"
          fill
          priority
          className="
            hidden
            object-cover
            object-center
            lg:block
            lg:scale-[1.22]
            select-none
          "
        />

        {/* ================= BACKGROUND MOBILE ================= */}

        <Image
          src={
            mobileImage
          }
          alt="About Permana Solutions Mobile"
          fill
          priority
          className="
            object-cover
            object-top
            lg:hidden
            select-none
          "
        />

        {/* ================= CONTENT ================= */}

        <div
          className="
            relative
            z-20
            mx-auto
            flex
            h-full
            w-full
            max-w-[1440px]
            items-center
            px-5
            sm:px-6
            lg:px-[100px]
          "
        >

          {/* ================= DESKTOP ================= */}

          <div
            className="
              hidden
              max-w-[640px]
              lg:block
              lg:-mt-[500px]
              lg:ml-[-30px]
            "
          >

            <h1
              className="
                text-[58px]
                font-bold
                leading-none
                text-white
              "
            >
              {text(
                hero,
                "title"
              )}
            </h1>

            <p
              className="
                mt-8
                max-w-[900px]
                text-[15px]
                leading-[20px]
                text-white/95
              "
            >
              {text(
                hero,
                "description"
              )}
            </p>

            <Image
              src={
                decorationImage
              }
              alt=""
              width={750}
              height={8}
              priority
              className="
                mt-3
                h-auto
                w-[750px]
                select-none
                pointer-events-none
              "
            />

          </div>

          {/* ================= MOBILE / TABLET ================= */}

          <div
            className="
              absolute
              left-[6%]
              top-[13%]
              z-20
              w-[400px]
              lg:hidden
            "
          >

            <h1
              className="
                max-w-[240px]
                text-[34px]
                font-bold
                leading-[1.05]
                tracking-[-0.02em]
                text-white
                sm:max-w-[280px]
                sm:text-[40px]
              "
            >
              {text(
                hero,
                "title"
              )}
            </h1>

            <p
              className="
                mt-1
                max-w-[280px]
                text-[11px]
                leading-[1.5]
                text-white/95
                sm:max-w-[350px]
                sm:text-[13px]
              "
            >
              {text(
                hero,
                "description"
              )}
            </p>

            <Image
              src={
                decorationImage
              }
              alt=""
              width={330}
              height={8}
              priority
              className="
                mt-4
                h-auto
                w-[280px]
                select-none
                pointer-events-none
                sm:w-[330px]
              "
            />

          </div>

        </div>

      </section>

    </main>
  );
}