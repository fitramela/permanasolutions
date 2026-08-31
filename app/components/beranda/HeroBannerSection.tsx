"use client";

import Image from "next/image";
import SlotCounter from "react-slot-counter";
import type { CmsSectionContent } from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
};

function text(
  content: CmsSectionContent | undefined,
  key: string,
  fallback = ""
) {
  const value = content?.[key];
  return typeof value === "string" && value.trim()
    ? value
    : fallback;
}

export default function HeroBannerSection({
  content,
}: Props) {
  const backgroundImage = text(
    content,
    "background_image"
  );

  return (
    <section className="bg-white py-4 lg:py-7">
      <div className="mx-auto max-w-[1590px] px-4 lg:px-8">
        <div className="overflow-hidden rounded-[20px] lg:rounded-[35px]">
          {/* HERO IMAGE */}
          <div
            className="
          relative
          h-[500px]
          sm:h-[620px]
          lg:h-[700px]
          xl:h-[760px]
        "
          >
            <Image
              src={backgroundImage}
              alt="Permana Solutions Hero"
              width={2048}
              height={848}
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="w-full px-[clamp(24px,5vw,80px)]">
                <h1
                  className="
        max-w-[clamp(340px,60vw,1050px)]
        text-white
        font-semibold
         text-[clamp(24px,5vw,50px)]
      
        leading-[1.2]
        tracking-[-0.0em]
        drop-shadow-[0_5px_1px_rgba(1,10,10)]
      "
                >
                  {text(content, "heading1")} {text(content, "heading2")}
                </h1>
              </div>
            </div>

            {/* Desktop Stats */}
            {/* <div
              className="
    hidden
    lg:block
    absolute
    bottom-0
    right-0
    rounded-tl-[55px]
    px-[clamp(24px,4vw,56px)]
    py-[clamp(16px,2vw,24px)]
  "
            >
              <div className="flex gap-[clamp(20px,4vw,50px)]">
                <Statistic number="20" label={text(content, "partner")} />
                <Statistic number="20" label={text(content, "customer")} />
                <Statistic number="30" label={text(content, "employee")} />
              </div>
            </div> */}
          </div>

          {/* Mobile Stats */}
          {/* <div className="bg-white py-5 lg:hidden">
            <div className="flex justify-center gap-6">
              <Statistic number="20" label={text(content, "partner")} />
              <Statistic number="20" label={text(content, "customer")} />
              <Statistic number="30" label={text(content, "employee")} />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

function Statistic({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="min-w-[80px] sm:min-w-[110px] lg:min-w-[120px] text-center">
      <h2 className="text-[#05638B] font-bold leading-none text-[32px] sm:text-[42px] lg:text-[58px]">
        <SlotCounter
          value={number}
          duration={4}
          animateOnVisible
        />
        +
      </h2>

      <p className="mt-2 text-[#05638B] font-medium text-[11px] sm:text-[14px] lg:text-[22px]">
        {label}
      </p>
    </div>
  );
}
