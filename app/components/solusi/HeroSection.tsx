"use client";

import Image from "next/image";
import Link from "next/link";

type HeroContent = {
  title?: string;
  description?: string;
  profileButton?: string;
  contactButton?: string;

  desktop_image?: string;
  mobile_image?: string;

  company_profile_id?: string;
  company_profile_en?: string;

  contact_href?: string;
};

type Props = {
  content?: HeroContent;
  locale: string;
};

export default function Solutions({
  content,
  locale,
}: Props) {
  if (!content) {
    return null;
  }

  const companyProfile =
    locale === "en"
      ? content.company_profile_en
      : content.company_profile_id;

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
        "
      >
        {/* ================= BACKGROUND DESKTOP ================= */}

        {content.desktop_image && (
          <Image
            src={content.desktop_image}
            alt="Solutions Hero Desktop"
            fill
            priority
            className="hidden object-cover md:block"
          />
        )}

        {/* ================= BACKGROUND MOBILE ================= */}

        {content.mobile_image && (
          <Image
            src={content.mobile_image}
            alt="Solutions Hero Mobile"
            fill
            priority
            className="object-cover md:hidden"
          />
        )}

        {/* ================= CONTENT ================= */}

        <div
          className="
            relative
            mx-auto
            flex
            h-full
            max-w-[1440px]
            items-center
            justify-center
            px-5
            sm:px-6
            lg:px-16
          "
        >
          <div
            className="
              max-w-[820px]
              text-center
              text-white
            "
          >
            {/* TITLE */}

            <h1
              className="
                text-3xl
                font-bold
                leading-tight
                sm:text-4xl
                md:text-6xl
              "
            >
              {content.title}
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-4
                max-w-[720px]
                text-sm
                leading-7
                text-white/90
                sm:mt-5
                sm:text-base
                sm:leading-8
                md:mt-6
                md:text-lg
              "
            >
              {content.description}
            </p>

            {/* BUTTONS */}

            <div
              className="
                mt-7
                flex
                flex-row
                flex-wrap
                items-center
                justify-center
                gap-2.5
                sm:mt-8
                sm:gap-3
                md:mt-10
                md:gap-4
              "
            >
              {/* COMPANY PROFILE */}

              {companyProfile && (
                <a
                  href={companyProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    rounded-lg
                    border
                    border-white/30
                    bg-[#00628D]/30
                    px-4
                    py-2
                    text-xs
                    font-medium
                    text-white
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-[#00628D]/50
                    sm:px-5
                    sm:py-2.5
                    sm:text-sm
                  "
                >
                  {content.profileButton}
                </a>
              )}

              {/* CONTACT */}

              {content.contact_href && (
                <Link
                  href={content.contact_href}
                  className="
                    rounded-lg
                    border
                    border-white/30
                    bg-white/20
                    px-4
                    py-2
                    text-xs
                    font-medium
                    text-white
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white/15
                    sm:px-5
                    sm:py-2.5
                    sm:text-sm
                  "
                >
                  {content.contactButton}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}