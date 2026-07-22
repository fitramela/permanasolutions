"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Product = {
  logo: string;
  title: string;
  description: string;
};

export default function ISP() {
  const t = useTranslations("ISP");

  const products = t.raw("products") as Product[];

  return (
    <main className="overflow-hidden bg-white">

      {/* ================= HERO ================= */}

<section className="relative isolate overflow-hidden">

  {/* Background */}
  <div className="absolute inset-y-0 left-0 w-full md:w-[100%]">
    <Image
      src="/images/image 703.png"
      alt=""
      fill
      priority
      className="object-contain object-left md:object-left object-center"
    />
  </div>

  {/* Hero Content */}
  <div className="relative mx-auto flex min-h-[620px] md:min-h-[860px] max-w-7xl items-center px-6 lg:px-8">

    <div className="ml-0 md:ml-auto max-w-full md:max-w-3xl text-center md:text-left">

      <span className="mb-4 block text-xs md:text-[30px] font-extralight uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#00628D]">
        {t("tagline")}
      </span>

      <h1 className="text-[38px] leading-tight font-semibold text-[#00628D] sm:text-[48px] md:text-7xl">

        {t("heading1")}

        <br />

        <span className="flex flex-wrap md:flex-nowrap justify-center md:justify-start items-end gap-2 md:gap-5 whitespace-normal md:whitespace-nowrap">

          {t("heading2")}

          <span className="text-[#04BCBC]">
            {t("heading3")}
          </span>

        </span>

      </h1>

      {/* underline */}
<div className="mt-4 flex justify-center md:justify-start"></div>  
  <Image
    src="/images/underline.png"
    alt=""
    width={850}
    height={8}
    priority
    className="h-auto w-[220px] sm:w-[320px] md:w-[850px]"
  />
    </div>

  </div>

{/* Bottom Wave */}
<div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none overflow-hidden">
  <Image
    src="/images/wv.svg"
    alt=""
    width={1440}
    height={713}
    priority
    className="block w-full h-auto -translate-y-[520px]"
  />
</div>

</section>



      {/* ================= PREMIUM SOLUTIONS ================= */}


<section className="relative py-28">

  <div className="absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-[120px]" />

  <div className="relative mx-auto max-w-7xl px-6">

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
          w-20
          rounded-bl-3xl
          rounded-tr-3xl
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

        <p className="mt-4 text-sm leading-7 text-neutral-600">
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

          {/* ================= LEFT ================= */}

          <div>

            <h2 className="
  mb-10
  max-w-2xl
  text-[45px]
  md:text-[35px]
  font-bold
  leading-[1.1]
  text-[#04BCBC]
  lg:text-[40px]
    xl:text-[30px]
">
  {t("connectivity.title")}

</h2>

            <div className="space-y-10">

              {(t.raw("connectivity.services") as {
                icon: string;
                title: string;
                description: string;
                color: string;
              }[]).map((item) => (

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

          {/* ================= RIGHT ================= */}

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
  <div className="mx-auto w-full px-4 sm:px-6">
    <div className="relative overflow-hidden rounded-[28px] lg:rounded-[40px] bg-[#006A93]">
      <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-12 items-center">

        {/* ================= LEFT ================= */}
        <div className="order-1 lg:order-1 lg:col-span-5 z-20 px-6 pt-10 pb-0 text-center lg:pl-16 lg:py-0 lg:text-left">

          <span className="block text-[32px] md:text-[40px] lg:text-[48px] font-light text-[#19D5D7]">
            {t("managed.tag")}
          </span>

          <h2 className="mt-2 text-[44px] md:text-[56px] lg:text-[72px] font-bold leading-[0.95] text-white">
            {t("managed.title 1")}
          </h2>

          <h2 className="mt-2 text-[44px] md:text-[56px] lg:text-[72px] font-bold leading-[0.95] text-white">
            {t("managed.title 2")}
          </h2>

        </div>

        {/* ================= RIGHT ================= */}
<div className="relative order-2 lg:order-2 lg:col-span-7 h-[430px] sm:h-[480px] lg:h-[520px]">

          {/* Group Model */}
<div
  className="
    absolute
    left-1/2
    top-16
    -translate-x-1/2

    h-[320px]
    w-[320px]

    sm:top-8
    sm:h-[520px]
    sm:w-[570px]

    lg:left-auto
    lg:right-4
    lg:top-auto
    lg:bottom-0
    lg:h-[500px]
    lg:w-[600px]
    lg:translate-x-0
  "
>

            <Image
              src="/images/model isp 2.png"
              alt="Managed Connectivity"
              fill
              priority
              className="object-contain"
            />

            {/* Badge 1 */}
            <div className="absolute left-0 top-2 rounded-2xl border border-white/20 bg-[#1289B4]/70 px-3 py-2 backdrop-blur-xl shadow-2xl sm:left-4 sm:top-6 lg:left-4 lg:top-6 lg:px-4 lg:py-3">
              <div className="flex items-center gap-2 lg:gap-3">
                <Image
                  src="/images/users.png"
                  alt=""
                  width={18}
                  height={18}
                  className="lg:h-[22px] lg:w-[22px]"
                />
                <span className="text-[10px] sm:text-xs lg:text-sm font-medium leading-5 text-white">
                  {t("managed.badge1.title")}
                  <br />
                  {t("managed.badge1.subtitle")}
                </span>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="absolute right-0 top-10 rounded-2xl border border-white/20 bg-[#1289B4]/70 px-3 py-2 backdrop-blur-xl shadow-2xl sm:top-20 lg:right-0 lg:top-20 lg:px-4 lg:py-3">
              <div className="flex items-center gap-2 lg:gap-3">
                <Image
                  src="/images/monitor.png"
                  alt=""
                  width={18}
                  height={18}
                  className="lg:h-[22px] lg:w-[22px]"
                />
                <span className="text-[10px] sm:text-xs lg:text-sm font-medium leading-5 text-white">
                  {t("managed.badge2.title")}
                  <br />
                  {t("managed.badge2.subtitle")}
                </span>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="absolute left-0 top-[150px] rounded-2xl border border-white/20 bg-[#1289B4]/70 px-3 py-2 backdrop-blur-xl shadow-2xl sm:top-[210px] lg:-left-8 lg:top-[250px] lg:px-4 lg:py-3">
              <div className="flex items-center gap-2 lg:gap-3">
                <Image
                  src="/images/Location.png"
                  alt=""
                  width={18}
                  height={18}
                  className="lg:h-[22px] lg:w-[22px]"
                />
                <span className="text-[10px] sm:text-xs lg:text-sm font-medium leading-5 text-white">
                  {t("managed.badge3.title")}
                  <br />
                  {t("managed.badge3.subtitle")}
                </span>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="absolute right-0 bottom-0 rounded-2xl border border-white/20 bg-[#1289B4]/70 px-3 py-2 backdrop-blur-xl shadow-2xl sm:bottom-10 lg:right-[-15px] lg:bottom-12 lg:px-4 lg:py-3">
              <div className="flex items-center gap-2 lg:gap-3">
                <Image
                  src="/images/Location.png"
                  alt=""
                  width={18}
                  height={18}
                  className="lg:h-[22px] lg:w-[22px]"
                />
                <span className="text-[10px] sm:text-xs lg:text-sm font-medium leading-5 text-white">
                  {t("managed.badge4.title")}
                  <br />
                  {t("managed.badge4.subtitle")}
                </span>
              </div>
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