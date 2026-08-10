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
    width={900}
    height={8}
    priority
    className="h-auto w-[220px] sm:w-[850px] md:w-[850px]"
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
    <div className="mb-12 text-center">
  <h2 className="text-4xl font-bold leading-none lg:text-5xl text-black">
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
          rounded-tl-[1px] //kanan atas 
      rounded-tr-[28px] //kiri atas 
      rounded-bl-[28px] //kanan bawah 
      rounded-br-[1px]  //kiri bawah 
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

        <p className="mt-4 text-sm leading-7 text-medium text-black justify-center">
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
  <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-8">

   <div className="relative aspect-[9/20] overflow-hidden rounded-[28px] lg:aspect-auto lg:min-h-[720px] lg:rounded-[40px]">
    
      {/* ================= DESKTOP IMAGE ================= */}
      <Image
        src="/images/ISP Connectivity new.png"
        alt="Managed Connectivity"
        width={2048}
        height={848}
        priority
        className="absolute inset-0 hidden h-full w-full object-fill lg:block"
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

      {/* Content */}
      <div className="relative z-10 grid min-h-[650px] grid-cols-1 items-center lg:min-h-[720px] lg:grid-cols-12">

        {/* ================= LEFT ================= */}
<div
  className="
    hidden lg:block
    lg:col-span-5
    lg:pl-16
    lg:pt-20
    text-left
  "
>
  <span className="block text-[32px] md:text-[40px] lg:text-[48px] font-regular text-[#19D5D7]">
    {t("managed.tag")}
  </span>

  <h2 className="mt-2 text-[44px] md:text-[60px] lg:text-[75px] font-extrabold leading-[0.95] text-white">
    {t("managed.title 1")}
  </h2>

  <h2 className="mt-2 text-[44px] md:text-[60px] lg:text-[75px] font-extrabold leading-[0.95] text-white">
    {t("managed.title 2")}
  </h2>
</div>

{/* ================= RIGHT CONTENT ================= */}

<div className="absolute inset-0 pointer-events-none">



  {/* ================= MOBILE ================= */}
<div className="block lg:hidden">
  <div
    className="
      relative
      mx-auto
      h-[770px]
      w-full
      max-w-[380px]
      overflow-hidden
      rounded-[38px]
    "
  >

    

    {/* ================= MOBILE TITLE ================= */}
    <div className="absolute left-[29px] top-[40px] z-10">
      <p className="block text-[25px] md:text-[20px] lg:text-[48px] font-regular text-[#04BCBC]">
    {t("managed.tag")}
  </p>

    <h2 className="mt-2 text-[30px] md:text-[40px] lg:text-[75px] font-extrabold leading-[0.95] text-white">
    {t("managed.title 1")}
  </h2>
  
  <h2 className="mt-2 text-[30px] md:text-[60px] lg:text-[75px] font-extrabold leading-[0.95] text-white">
    {t("managed.title 2")}
  </h2>

    </div>

    {/* ================= BADGE 1 ================= */}
    <div className="absolute left-[30px] top-[170px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image src="/images/Wi-Fi.png" alt="" width={28} height={28} />

        <div className="text-[10px] font-medium leading-[1.15] text-white">
          <p>{t("managed.badge1.title")}</p>
          <p>{t("managed.badge1.subtitle")}</p>
        </div>
      </div>
    </div>

    {/* ================= BADGE 2 ================= */}
    <div className="absolute right-[30px] top-[197px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-8 py-2 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image src="/images/monitor.png" alt="" width={28} height={28} />

        <div className="text-[10px] font-medium leading-[1.15] text-white">
          <p>{t("managed.badge2.title")}</p>
          <p>{t("managed.badge2.subtitle")}</p>
        </div>
      </div>
    </div>

    {/* ================= BADGE 3 ================= */}
     <div className="absolute right-[35px] top-[304px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-8 py-2 backdrop-blur-xl">
    
      <div className="flex items-center gap-2">
        <Image src="/images/GPS Signal.png" alt="" width={28} height={28} />

        <div className="text-[10px] font-medium leading-[1.15] text-white">
          <p>{t("managed.badge3.title")}</p>
          <p>{t("managed.badge3.subtitle")}</p>
        </div>
      </div>
    </div>

    {/* ================= BADGE 4 ================= */}
   <div className="absolute left-[50px] top-[250px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image src="/images/World Markets.png" alt="" width={28} height={28} />

        <div className="text-[10px] font-medium leading-[1.15] text-white">
          <p>{t("managed.badge4.title")}</p>
          <p>{t("managed.badge4.subtitle")}</p>
        </div>
      </div>
    </div>

  </div>
</div>
       



 


  {/* ================= DESKTOP ================= */}
 <div className="hidden lg:block absolute right-0 top-0 h-full w-[55%]">

    {/* Badge 1 */}
    <div
      className="
        absolute
        top-[40%]
        left-[12%]
        rounded-[15px]
        border border-white/20
        bg-[#04BCBC]/20
        px-5 py-5
        backdrop-blur-xl
        shadow-xl
      "
    >
      <div className="flex items-center gap-3">
        <Image src="/images/Wi-Fi.png" alt="" width={50} height={50} />
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
        top-[40%]
        left-[62%]
        rounded-[15px]
        border border-white/20
         bg-[#04BCBC]/20
        px-5 py-5
        backdrop-blur-xl
        shadow-xl
      "
    >
      <div className="flex items-center gap-3">
        <Image src="/images/monitor.png" alt="" width={50} height={50} />
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
        top-[63%]
        left-[3%]
        rounded-[15px]
        border border-white/20
         bg-[#04BCBC]/20
        px-5 py-5
        backdrop-blur-xl
        shadow-xl
      "
    >
      <div className="flex items-center gap-3">
        <Image src="/images/GPS Signal.png" alt="" width={50} height={50} />
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
        left-[66%]
        bottom-[17%]
        rounded-[15px]
        border border-white/20
        bg-[#04BCBC]/20
        px-5 py-5
        backdrop-blur-xl
        shadow-xl
      "
    >
      <div className="flex items-center gap-3">
        <Image src="/images/World Markets.png" alt="" width={50} height={50} />
        <div className="text-[15px] font-medium leading-5 text-white">
          <p>{t("managed.badge4.title")}</p>
          <p>{t("managed.badge4.subtitle")}</p>
        </div>
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