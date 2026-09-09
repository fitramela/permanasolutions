"use client";

import Image from "next/image";

import type {
  CmsSectionContent,
} from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
  locale: string;
};

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

export default function HeroContact({
  content,
  locale,
}: Props) {
  if (!content) {
    return null;
  }

  const desktopImage =
    text(
      content,
      "desktop_image"
    ) ||
    "/images/heroContact.png";

  const mobileImage =
    text(
      content,
      "mobile_image"
    ) ||
    "/images/contactMobile.png";

  return (
    <section className="bg-white py-4 lg:py-7">

      <div className="mx-auto max-w-[1590px] px-4 lg:px-10">

        {/* ================= DESKTOP ================= */}

        <div className="relative hidden lg:block">

          <Image
            src={
              desktopImage
            }
            alt="Contact Permana Solutions"
            width={1600}
            height={700}
            priority
            className="h-auto w-full"
          />

          {/* TEXT DESKTOP */}

          <div
            className="
              absolute
              left-[11%]
              top-[27%]
              z-20
              w-[30%]
            "
          >

            {/* Contact Us */}

            <div
              className="
                mb-5
                inline-flex
                rounded-full
                border
                border-[#04BCBC]
                px-3
                py-1
                text-[10px]
                font-medium
                text-[#04AEB3]
              "
            >
              {text(
                content,
                "contactUs"
              )}
            </div>

            {/* Title */}

            <h1
              className={`
                font-semibold
                leading-[1.05]
                tracking-[-0.02em]
                text-[#006A93]

                ${
                  locale ===
                  "id"
                    ? "max-w-[360px] text-[30px] xl:max-w-[500px] xl:text-[50px]"
                    : "max-w-[300px] text-[40px] xl:max-w-[420px] xl:text-[55px]"
                }
              `}
            >
              {text(
                content,
                "titleStart"
              )}{" "}

              <span className="text-[#00B9BF]">
                {text(
                  content,
                  "titleEnd"
                )}
              </span>
            </h1>

            {/* Office */}

            <h2
              className="
                mt-2
                text-[15px]
                font-semibold
                text-[#006A93]
                xl:text-[17px]
              "
            >
              {text(
                content,
                "office"
              )}
            </h2>

            {/* Address */}

            <p
              className="
                mt-3
                max-w-[250px]
                whitespace-pre-line
                text-[50px]
                leading-[1.5]
                text-[#006A93]
                xl:text-[11px]
              "
            >
              {text(
                content,
                "address"
              )}
            </p>

          </div>

        </div>

        {/* ================= MOBILE ================= */}

        <div className="relative block lg:hidden">

          <Image
            src={
              mobileImage
            }
            alt="Contact Permana Solutions"
            width={800}
            height={1000}
            priority
            className="h-auto w-full"
          />

          {/* TEXT MOBILE */}

          <div
            className="
              absolute
              left-[14%]
              top-[10%]
              z-20
              w-[58%]
            "
          >

            <div
              className="
                mb-5
                inline-flex
                rounded-full
                border
                border-[#04BCBC]
                px-3
                py-1
                text-[8px]
                font-regular
                text-[#04AEB3]
              "
            >
              {text(
                content,
                "contactUs"
              )}
            </div>

            <h1
              className={`
                font-semibold
                leading-[1.05]
                tracking-[-0.02em]
                text-[#006A93]

                ${
                  locale ===
                  "id"
                    ? `
                        max-w-[210px]
                        text-[23px]
                        sm:max-w-[240px]
                        sm:text-[30px]
                      `
                    : `
                        max-w-[195px]
                        text-[33px]
                        sm:max-w-[225px]
                        sm:text-[40px]
                      `
                }
              `}
            >
              {text(
                content,
                "titleStart"
              )}{" "}

              <span className="text-[#00B9BF]">
                {text(
                  content,
                  "titleEnd"
                )}
              </span>
            </h1>

            <h2
              className="
                mt-2
                text-[15px]
                font-semibold
                leading-tight
                text-[#006A93]
              "
            >
              {text(
                content,
                "office"
              )}
            </h2>

            <p
              className="
                mt-2
                max-w-[190px]
                whitespace-pre-line
                text-[10px]
                leading-[1.45]
                text-[#006A93]
              "
            >
              {text(
                content,
                "address"
              )}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}