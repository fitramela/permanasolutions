
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type Product = {
  logo: string;
  title: string;
  description: string;
};

type ConnectivityService = {
  icon: string;
  title: string;
  description: string;
  color: string;
};

export default function ISP() {
  const t = useTranslations("ISP");

  const products = t.raw("products") as Product[];

  const connectivityServices = t.raw(
    "connectivity.services"
  ) as ConnectivityService[];

  return (
    <main className="overflow-hidden bg-white">

      {/* ================= HERO ================= */}

      <section className="relative h-[720px] overflow-hidden">

        {/* Background */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[100%]">
          <Image
            src="/images/image 704.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 lg:px-8">
          <div className="ml-0 max-w-full text-center md:ml-auto md:max-w-3xl md:text-left">

            <span className="mb-4 block text-xs font-extralight uppercase tracking-[0.25em] text-[#00628D] md:text-[30px] md:tracking-[0.3em]">
              {t("tagline")}
            </span>

            <h1 className="text-[38px] font-semibold leading-tight text-[#00628D] sm:text-[48px] md:text-7xl">

              {t("heading1")}

              <br />

              <span className="flex flex-wrap items-end justify-center gap-2 whitespace-normal md:flex-nowrap md:justify-start md:gap-5 md:whitespace-nowrap">
                {t("heading2")}

                <span className="text-[#04BCBC]">
                  {t("heading3")}
                </span>
              </span>

            </h1>

            {/* Underline */}
            <div className="mt-4 flex justify-center md:justify-start">
              <Image
                src="/images/underline.png"
                alt=""
                width={900}
                height={8}
                priority
                className="h-auto w-[220px] sm:w-[850px] md:w-[850px]"
              />
            </div>

          </div>
        </div>

        {/* Bottom Wave */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden">
          <Image
            src="/images/wv.svg"
            alt=""
            width={1440}
            height={713}
            priority
            className="block h-auto w-full -translate-y-[520px]"
          />
        </div>

      </section>


      {/* ================= PREMIUM SOLUTIONS ================= */}

      <section className="relative py-28">

        <div className="absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold leading-none text-black lg:text-5xl">
              {t("premiumTitle")}
              <br />

              <span className="text-[#04BCBC]">
                {t("premiumTitle2")}
              </span>
            </h2>
          </div>

          {/* Cards */}
          <div className="group grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => (
              <div
                key={product.title}
                className="
                  group/card
                  relative
                  transition-all
                  duration-300
                  group-hover:opacity-40
                  hover:!opacity-100
                "
              >

                {/* Highlight */}
                <div
                  className="
                    absolute
                    -left-4
                    bottom-0
                    h-24
                    w-24
                    rounded-tl-[1px]
                    rounded-tr-[28px]
                    rounded-bl-[28px]
                    rounded-br-[1px]
                    bg-[#04BCBC]
                    opacity-0
                    transition-all
                    duration-300
                    group-hover/card:opacity-100
                  "
                />

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-full
                    flex-col
                    rounded-[26px]
                    border
                    border-neutral-100
                    bg-white
                    px-6
                    py-8
                    text-center
                    shadow-md
                    transition-all
                    duration-300
                    group-hover/card:-translate-y-2
                    group-hover/card:shadow-2xl
                  "
                >

                  <div className="flex h-16 items-center justify-center">
                    <Image
                      src={product.logo}
                      alt={product.title}
                      width={90}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-black">
                    {product.title}
                  </h3>

                  <p className="mt-4 justify-center text-sm leading-7 text-black">
                    {product.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================= CONNECTIVITY & INFRASTRUCTURE ================= */}

      <section className="relative overflow-hidden py-24">

        {/* Background Blur */}
        <div className="absolute right-0 top-10 h-[520px] w-[520px] rounded-full bg-cyan-300/30 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <h2
              className="
                mb-10
                max-w-2xl
                text-[45px]
                font-bold
                leading-[1.1]
                text-[#04BCBC]
                md:text-[35px]
                lg:text-[40px]
                xl:text-[30px]
              "
            >
              {t("connectivity.title")}
            </h2>

            <div className="space-y-10">

              {connectivityServices.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-6"
                >

                  {/* Icon */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={35}
                      height={35}
                      className="object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div>

                    <h3 className="text-2xl font-bold text-black">
                      {item.title}
                    </h3>

                    <p className="mt-2 leading-7 text-neutral-600">
                      {item.description}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* RIGHT */}
          <div className="relative flex justify-center">

            {/* Glow */}
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#04BCBC]/40 blur-[90px]" />

            {/* Card */}
            <div className="relative rounded-[32px] bg-white p-6 shadow-2xl">
              <Image
                src="/images/connectivity.png"
                alt="Connectivity"
                width={560}
                height={390}
                className="rounded-3xl object-cover"
              />
            </div>

          </div>

        </div>

      </section>


      {/* ================= MANAGED CONNECTIVITY ================= */}

      <section className="py-12 lg:py-24">

        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-8">

          <div className="relative min-h-[770px] overflow-hidden rounded-[28px] bg-[#00628D] lg:min-h-[720px] lg:rounded-[40px]">

            {/* ================= DESKTOP IMAGE ================= */}

            <Image
              src="/images/ISP Connectivity new.png"
              alt="Managed Connectivity"
              fill
              priority
              sizes="100vw"
              className="hidden object-cover lg:block lg:rounded-[40px]"
            />

            {/* ================= MOBILE IMAGE ================= */}

            <Image
              src="/images/mobile.png"
              alt="Managed Connectivity"
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 block object-cover lg:hidden"
            />


            {/* ================= DESKTOP TITLE ================= */}

            <div
              className="
                absolute
                left-0
                top-0
                z-10
                hidden
                w-[45%]
                pl-16
                pt-20
                text-left
                lg:block
              "
            >

              <span className="block text-[32px] font-normal text-[#19D5D7] md:text-[40px] lg:text-[48px]">
                {t("managed.tag")}
              </span>

              <h2 className="mt-2 text-[44px] font-extrabold leading-[0.95] text-white md:text-[60px] lg:text-[75px]">
                {t("managed.title 1")}
              </h2>

              <h2 className="mt-2 text-[44px] font-extrabold leading-[0.95] text-white md:text-[60px] lg:text-[75px]">
                {t("managed.title 2")}
              </h2>

            </div>


            {/* ================= MOBILE CONTENT ================= */}

            <div className="relative z-10 block min-h-[770px] lg:hidden">

              {/* Mobile Title */}
              <div className="absolute left-[29px] top-[40px] z-20">

                <p className="block text-[25px] font-normal text-[#04BCBC]">
                  {t("managed.tag")}
                </p>

                <h2 className="mt-2 text-[30px] font-extrabold leading-[0.95] text-white md:text-[40px]">
                  {t("managed.title 1")}
                </h2>

                <h2 className="mt-2 text-[30px] font-extrabold leading-[0.95] text-white md:text-[60px]">
                  {t("managed.title 2")}
                </h2>

              </div>


              {/* Mobile Main Image */}
              <div className="absolute left-1/2 top-[285px] z-10 -translate-x-1/2">

                <Image
                  src="/images/model isp 2.png"
                  alt="Managed Connectivity"
                  width={420}
                  height={520}
                  className="h-auto w-[360px]"
                />

              </div>


              {/* Mobile Badge 1 */}
              <div className="absolute left-[30px] top-[170px] z-20 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <Image
                    src="/images/Wi-Fi.png"
                    alt=""
                    width={28}
                    height={28}
                  />

                  <div className="text-[10px] font-medium leading-[1.15] text-white">
                    <p>{t("managed.badge1.title")}</p>
                    <p>{t("managed.badge1.subtitle")}</p>
                  </div>

                </div>

              </div>


              {/* Mobile Badge 2 */}
              <div className="absolute right-[30px] top-[197px] z-20 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <Image
                    src="/images/monitor.png"
                    alt=""
                    width={28}
                    height={28}
                  />

                  <div className="text-[10px] font-medium leading-[1.15] text-white">
                    <p>{t("managed.badge2.title")}</p>
                    <p>{t("managed.badge2.subtitle")}</p>
                  </div>

                </div>

              </div>


              {/* Mobile Badge 3 */}
              <div className="absolute right-[35px] top-[304px] z-20 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <Image
                    src="/images/GPS Signal.png"
                    alt=""
                    width={28}
                    height={28}
                  />

                  <div className="text-[10px] font-medium leading-[1.15] text-white">
                    <p>{t("managed.badge3.title")}</p>
                    <p>{t("managed.badge3.subtitle")}</p>
                  </div>

                </div>

              </div>


              {/* Mobile Badge 4 */}
              <div className="absolute left-[50px] top-[250px] z-20 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <Image
                    src="/images/World Markets.png"
                    alt=""
                    width={28}
                    height={28}
                  />

                  <div className="text-[10px] font-medium leading-[1.15] text-white">
                    <p>{t("managed.badge4.title")}</p>
                    <p>{t("managed.badge4.subtitle")}</p>
                  </div>

                </div>

              </div>

            </div>


            {/* ================= DESKTOP BADGES ================= */}

            <div className="absolute right-0 top-0 hidden h-full w-[55%] lg:block">

              {/* Badge 1 */}
              <div
                className="
                  absolute
                  left-[12%]
                  top-[40%]
                  rounded-[15px]
                  border
                  border-white/20
                  bg-[#04BCBC]/20
                  px-5
                  py-5
                  shadow-xl
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">

                  <Image
                    src="/images/Wi-Fi.png"
                    alt=""
                    width={50}
                    height={50}
                  />

                  <div className="text-[15px] font-medium leading-5 text-white">
                    <p>{t("managed.badge1.title")}</p>
                    <p>{t("managed.badge1.subtitle")}</p>
                  </div>

                </div>
              </div>


              {/* Badge 2 */}
              <div
                className="
                  absolute
                  left-[62%]
                  top-[40%]
                  rounded-[15px]
                  border
                  border-white/20
                  bg-[#04BCBC]/20
                  px-5
                  py-5
                  shadow-xl
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">

                  <Image
                    src="/images/monitor.png"
                    alt=""
                    width={50}
                    height={50}
                  />

                  <div className="text-[15px] font-medium leading-5 text-white">
                    <p>{t("managed.badge2.title")}</p>
                    <p>{t("managed.badge2.subtitle")}</p>
                  </div>

                </div>
              </div>


              {/* Badge 3 */}
              <div
                className="
                  absolute
                  left-[3%]
                  top-[63%]
                  rounded-[15px]
                  border
                  border-white/20
                  bg-[#1A9BC7]/70
                  px-5
                  py-5
                  shadow-xl
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">

                  <Image
                    src="/images/GPS Signal.png"
                    alt=""
                    width={50}
                    height={50}
                  />

                  <div className="text-[15px] font-medium leading-5 text-white">
                    <p>{t("managed.badge3.title")}</p>
                    <p>{t("managed.badge3.subtitle")}</p>
                  </div>

                </div>
              </div>


              {/* Badge 4 */}
              <div
                className="
                  absolute
                  bottom-[17%]
                  left-[66%]
                  rounded-[15px]
                  border
                  border-white/20
                  bg-[#1A9BC7]/70
                  px-5
                  py-5
                  shadow-xl
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">

                  <Image
                    src="/images/World Markets.png"
                    alt=""
                    width={50}
                    height={50}
                  />

                  <div className="text-[15px] font-medium leading-5 text-white">
                    <p>{t("managed.badge4.title")}</p>
                    <p>{t("managed.badge4.subtitle")}</p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

