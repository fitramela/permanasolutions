"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type Feature = {
  title: string;
  description: string;
};

const icons = [
  "/images/Wi-Fi Lock.png",
  "/images/Gears.png",
  "/images/Combo Chart.png",
  "/images/Idea.png",
  "/images/Check File.png",
  "/images/Launch.png",
];

export default function WhyChoose() {
  const t = useTranslations("WhyChoose");

  const items = t.raw("items") as Feature[];

  return (
    <section className="bg-grey py-16 lg:py-5">
      <div className="mx-auto max-w-[1700px] px-5 sm:px-6 lg:px-16">

        {/* ================= TITLE ================= */}
        <h2 className="mb-10 text-center text-3xl font-bold text-[#111111] sm:text-4xl lg:mb-16 lg:text-5xl">
          {t("title")}
        </h2>

        {/* ================= 6 CARDS ================= */}
        <div
          className="
            mb-10
            grid
            grid-cols-2
            gap-4
            sm:gap-5
            lg:mb-16
            lg:grid-cols-3
            lg:gap-x-5
            lg:gap-y-10
          "
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                group
                relative
                h-[175px]
                w-full
                max-w-[275px]
                overflow-hidden
                rounded-[18px]
                border
                border-[#E5E5E5]
                bg-white
                px-4
                py-4
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-md

                ${
                  index < 3
    ? "lg:translate-x-[50px]"
    : "lg:translate-x-[150px]"
                }
              `}
            >

              {/* ================= ICON ================= */}
              <div
                className="
                  flex
                  h-[52px]
                  w-[52px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E2E2E2]
                  bg-[#FAFAFA]
                  transition-all
                  duration-300
                  group-hover:border-[#04BCBC]
                  group-hover:bg-[#F0FFFF]
                "
              >
                <Image
                  src={icons[index]}
                  alt=""
                  width={38}
                  height={38}
                  className="h-[38px] w-[38px] object-contain"
                />
              </div>

              {/* ================= TITLE ================= */}
              <h3 className="mt-3 text-xs font-bold leading-4 text-[#00628D]">
                {item.title}
              </h3>

              {/* ================= GREEN LINE ================= */}
              <div className="mt-1 h-[3px] w-[45px]">
                <Image
                  src="/images/line.png"
                  alt=""
                  width={45}
                  height={3}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* ================= DESCRIPTION ================= */}
              <p className="mt-2 text-[10px] leading-4 text-[#6B7280]">
                {item.description}
              </p>

              {/* ================= BOTTOM ACCENT ================= */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[3px]
                  w-0
                  bg-[#04BCBC]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </div>
          ))}
        </div>

        {/* ================= BOTTOM IMAGE ================= */}
        <div className="flex justify-center">
          <div
            className="
              relative
              h-[220px]
              w-full
              overflow-hidden
              rounded-tl-[24px]
              rounded-tr-[70px]
              rounded-bl-[70px]
              rounded-br-[24px]

              sm:h-[300px]
              sm:rounded-tl-[30px]
              sm:rounded-tr-[110px]
              sm:rounded-bl-[110px]
              sm:rounded-br-[30px]

              lg:h-[430px]
              lg:max-w-[900px]
              lg:rounded-tl-[36px]
              lg:rounded-tr-[170px]
              lg:rounded-bl-[170px]
              lg:rounded-br-[36px]
            "
          >
            <Image
              src="/images/image 695.png"
              alt="Why Choose Us"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
