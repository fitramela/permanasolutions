"use client";

import Image from "next/image";

type Feature = {
  title: string;
  description: string;
  icon_url?: string;
};

type WhyChooseContent = {
  title?: string;
  items?: Feature[];
  image_url?: string;
  line_image?: string;
};

type Props = {
  content?: WhyChooseContent;
  locale: string;
};

export default function WhyChoose({
  content,
  locale,
}: Props) {
  if (!content) {
    return null;
  }

  const items = content.items ?? [];

  return (
    <section className="bg-grey py-16 lg:py-5">
      <div className="mx-auto max-w-[1700px] px-5 sm:px-6 lg:px-16">
        {/* ================= TITLE ================= */}

        <h2
          className="
            mb-10
            text-center
            text-3xl
            font-bold
            text-[#111111]
            sm:text-4xl
            lg:mb-16
            lg:w-[620px]
            lg:text-5xl
          "
        >
          {content.title}
        </h2>

        {/* ================= DESKTOP ================= */}

        <div className="lg:flex lg:items-center lg:justify-center lg:gap-10">
          {/* ================= 6 CARDS ================= */}

          <div className="lg:w-[620px] lg:shrink-0">
            <div
              className="
                mb-10
                grid
                grid-cols-2
                gap-4
                sm:gap-5
                lg:mb-0
                lg:grid-cols-3
                lg:gap-4
              "
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="
                    group
                    relative
                    h-[175px]
                    w-full
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
                    lg:h-[155px]
                    lg:px-3
                    lg:py-3
                  "
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
                      lg:h-[46px]
                      lg:w-[46px]
                    "
                  >
                    {item.icon_url && (
                      <Image
                        src={item.icon_url}
                        alt=""
                        width={38}
                        height={38}
                        className="h-[38px] w-[38px] object-contain lg:h-[32px] lg:w-[32px]"
                      />
                    )}
                  </div>

                  {/* ================= TITLE ================= */}

                  <h3
                    className={`mt-3 font-bold leading-4 text-[#00628D] ${
                      locale === "id"
                        ? "text-[11px]"
                        : "text-xs"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* ================= GREEN LINE ================= */}

                  {content.line_image && (
                    <div className="mt-1 h-[3px] w-[45px]">
                      <Image
                        src={content.line_image}
                        alt=""
                        width={45}
                        height={3}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

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
          </div>

          {/* ================= DESKTOP IMAGE ================= */}

          {content.image_url && (
            <div className="hidden lg:block lg:flex-1">
              <div
                className="
                  relative
                  h-[430px]
                  w-full
                  overflow-hidden
                  rounded-tl-[36px]
                  rounded-tr-[170px]
                  rounded-bl-[170px]
                  rounded-br-[36px]
                "
              >
                <Image
                  src={content.image_url}
                  alt="Why Choose Us"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= MOBILE IMAGE ================= */}

        {content.image_url && (
          <div className="flex justify-center lg:hidden">
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
              "
            >
              <Image
                src={content.image_url}
                alt="Why Choose Us"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}