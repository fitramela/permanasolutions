"use client";

import Image from "next/image";

import type {
  CmsSectionContent,
} from "@/app/services/cms";

type Product = {
  logo?: string;
  title?: string;
  description?: string;
};

type ConnectivityService = {
  icon?: string;
  title?: string;
  description?: string;
  color?: string;
};

type ManagedBadge = {
  title?: string;
  subtitle?: string;
  icon_url?: string;
};

type ManagedContent = {
  tag?: string;

  "title 1"?: string;

  "title 2"?: string;

  badge1?: ManagedBadge;
  badge2?: ManagedBadge;
  badge3?: ManagedBadge;
  badge4?: ManagedBadge;
};

type ConnectivityContent = {
  title?: string;
  services?: ConnectivityService[];
};

type Props = {
  content?: CmsSectionContent;
};

function text(
  content:
    | Record<string, unknown>
    | undefined,
  key: string
) {
  const value =
    content?.[key];

  return typeof value ===
    "string"
    ? value
    : "";
}

function objectValue(
  content:
    | Record<string, unknown>
    | undefined,
  key: string
): Record<string, unknown> {
  const value =
    content?.[key];

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

function getProducts(
  content?: CmsSectionContent
): Product[] {
  const raw =
    content?.products;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter(
      (
        item
      ): item is Record<
        string,
        unknown
      > =>
        !!item &&
        typeof item ===
          "object" &&
        !Array.isArray(
          item
        )
    )
    .map(
      (item) => ({
        logo:
          typeof item.logo ===
          "string"
            ? item.logo
            : "",

        title:
          typeof item.title ===
          "string"
            ? item.title
            : "",

        description:
          typeof item.description ===
          "string"
            ? item.description
            : "",
      })
    );
}

function getConnectivityServices(
  connectivity:
    | Record<string, unknown>
    | undefined
): ConnectivityService[] {
  const raw =
    connectivity?.services;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter(
      (
        item
      ): item is Record<
        string,
        unknown
      > =>
        !!item &&
        typeof item ===
          "object" &&
        !Array.isArray(
          item
        )
    )
    .map(
      (item) => ({
        icon:
          typeof item.icon ===
          "string"
            ? item.icon
            : "",

        title:
          typeof item.title ===
          "string"
            ? item.title
            : "",

        description:
          typeof item.description ===
          "string"
            ? item.description
            : "",

        color:
          typeof item.color ===
          "string"
            ? item.color
            : "#04BCBC",
      })
    );
}

function getBadge(
  managed:
    | Record<string, unknown>
    | undefined,
  key:
    | "badge1"
    | "badge2"
    | "badge3"
    | "badge4"
): ManagedBadge {
  const value =
    managed?.[key];

  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  const badge =
    value as Record<
      string,
      unknown
    >;

  return {
    title:
      typeof badge.title ===
      "string"
        ? badge.title
        : "",

    subtitle:
      typeof badge.subtitle ===
      "string"
        ? badge.subtitle
        : "",

    icon_url:
      typeof badge.icon_url ===
      "string"
        ? badge.icon_url
        : "",
  };
}

export default function ISP({
  content,
}: Props) {
  if (!content) {
    return null;
  }

  const products =
    getProducts(
      content
    );

  const connectivity =
    objectValue(
      content,
      "connectivity"
    ) as ConnectivityContent;

  const connectivityServices =
    getConnectivityServices(
      connectivity as Record<
        string,
        unknown
      >
    );

  const managed =
    objectValue(
      content,
      "managed"
    ) as ManagedContent;

  const badge1 =
    getBadge(
      managed as Record<
        string,
        unknown
      >,
      "badge1"
    );

  const badge2 =
    getBadge(
      managed as Record<
        string,
        unknown
      >,
      "badge2"
    );

  const badge3 =
    getBadge(
      managed as Record<
        string,
        unknown
      >,
      "badge3"
    );

  const badge4 =
    getBadge(
      managed as Record<
        string,
        unknown
      >,
      "badge4"
    );

  const heroImage =
    text(
      content,
      "hero_image"
    );

  const underlineImage =
    text(
      content,
      "underline_image"
    );

  const waveImage =
    text(
      content,
      "wave_image"
    );

  const connectivityImage =
    text(
      content,
      "connectivity_image"
    );

  const managedDesktopImage =
    text(
      content,
      "managed_desktop_image"
    );

  const managedMobileImage =
    text(
      content,
      "managed_mobile_image"
    );

  return (
    <main className="overflow-hidden bg-white">

      {/* ================= HERO ================= */}

      <section className="relative h-[720px] overflow-hidden">

        {/* Background */}

        <div className="absolute inset-y-0 left-0 w-full md:w-[100%]">

          {heroImage && (
            <Image
              src={
                heroImage
              }
              alt=""
              fill
              priority
              className="object-cover"
            />
          )}

        </div>

        {/* Hero Content */}

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 md:min-h-[860px] lg:px-8">

          <div className="ml-0 max-w-full text-center md:ml-auto md:max-w-3xl md:text-left">

            <span className="mb-4 block text-xs font-extralight uppercase tracking-[0.25em] text-[#00628D] md:text-[30px] md:tracking-[0.3em]">

              {text(
                content,
                "tagline"
              )}

            </span>

            <h1 className="text-[38px] font-semibold leading-tight text-[#00628D] sm:text-[48px] md:text-7xl">

              {text(
                content,
                "heading1"
              )}

              <br />

              <span className="flex flex-wrap items-end justify-center gap-2 whitespace-normal md:flex-nowrap md:justify-start md:gap-5 md:whitespace-nowrap">

                {text(
                  content,
                  "heading2"
                )}

                <span className="text-[#04BCBC]">

                  {text(
                    content,
                    "heading3"
                  )}

                </span>

              </span>

            </h1>

            {/* underline */}

            <div className="mt-4 flex justify-center md:justify-start">

              {underlineImage && (
                <Image
                  src={
                    underlineImage
                  }
                  alt=""
                  width={
                    900
                  }
                  height={
                    8
                  }
                  priority
                  className="h-auto w-[220px] sm:w-[850px] md:w-[850px]"
                />
              )}

            </div>

          </div>

        </div>

        {/* Bottom Wave */}

        {waveImage && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden">

            <Image
              src={
                waveImage
              }
              alt=""
              width={
                1440
              }
              height={
                713
              }
              priority
              className="block h-auto w-full -translate-y-[520px]"
            />

          </div>
        )}

      </section>

      {/* ================= PREMIUM SOLUTIONS ================= */}

      <section className="relative py-28">

        <div className="absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <h2 className="text-4xl font-bold leading-none text-black lg:text-5xl">

              {text(
                content,
                "premiumTitle"
              )}

              <br />

              <span className="text-[#04BCBC]">

                {text(
                  content,
                  "premiumTitle2"
                )}

              </span>

            </h2>

          </div>

          {/* Cards */}

          <div className="group grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {products.map(
              (
                product,
                index
              ) => (
                <div
                  key={
                    product.title ??
                    index
                  }
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

                      {product.logo && (
                        <Image
                          src={
                            product.logo
                          }
                          alt={
                            product.title ??
                            ""
                          }
                          width={
                            90
                          }
                          height={
                            40
                          }
                          className="object-contain"
                        />
                      )}

                    </div>

                    <h3 className="mt-5 text-base font-semibold text-black">

                      {
                        product.title
                      }

                    </h3>

                    <p className="mt-4 justify-center text-sm font-medium leading-7 text-black">

                      {
                        product.description
                      }

                    </p>

                  </div>

                </div>
              )
            )}

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

              {
                connectivity.title
              }

            </h2>

            <div className="space-y-10">

              {connectivityServices.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.title ??
                      index
                    }
                    className="flex items-start gap-6"
                  >

                    {/* Icon */}

                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          item.color ??
                          "#04BCBC",
                      }}
                    >

                      {item.icon && (
                        <Image
                          src={
                            item.icon
                          }
                          alt={
                            item.title ??
                            ""
                          }
                          width={
                            35
                          }
                          height={
                            35
                          }
                          className="object-contain"
                        />
                      )}

                    </div>

                    {/* Text */}

                    <div>

                      <h3 className="text-2xl font-bold text-black">

                        {
                          item.title
                        }

                      </h3>

                      <p className="mt-2 leading-7 text-neutral-600">

                        {
                          item.description
                        }

                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="relative flex justify-center">

            {/* Glow */}

            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#04BCBC]/40 blur-[90px]" />

            {/* Card */}

            {connectivityImage && (
              <div className="relative rounded-[32px] bg-white p-6 shadow-2xl">

                <Image
                  src={
                    connectivityImage
                  }
                  alt="Connectivity"
                  width={
                    560
                  }
                  height={
                    390
                  }
                  className="rounded-3xl object-cover"
                />

              </div>
            )}

          </div>

        </div>

      </section>

      {/* ================= MANAGED CONNECTIVITY ================= */}

      <section className="py-12 lg:py-24">

        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-8">

          <div className="relative aspect-[9/20] overflow-hidden rounded-[28px] lg:aspect-auto lg:min-h-[720px] lg:rounded-[40px]">

            {/* ================= DESKTOP IMAGE ================= */}

            {managedDesktopImage && (
              <Image
                src={
                  managedDesktopImage
                }
                alt="Managed Connectivity"
                width={
                  2048
                }
                height={
                  848
                }
                priority
                className="absolute inset-0 hidden h-full w-full object-fill lg:block"
              />
            )}

            {/* ================= MOBILE IMAGE ================= */}

            {managedMobileImage && (
              <Image
                src={
                  managedMobileImage
                }
                alt="Managed Connectivity"
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 block object-cover lg:hidden"
              />
            )}

            {/* Content */}

            <div className="relative z-10 grid min-h-[650px] grid-cols-1 items-center lg:min-h-[720px] lg:grid-cols-12">

              {/* ================= LEFT ================= */}

              <div
                className="
                  hidden
                  text-left
                  lg:col-span-5
                  lg:block
                  lg:pl-16
                  lg:pt-20
                "
              >

                <span className="block text-[32px] font-normal text-[#19D5D7] md:text-[40px] lg:text-[48px]">

                  {
                    managed.tag
                  }

                </span>

                <h2 className="mt-2 text-[44px] font-extrabold leading-[0.95] text-white md:text-[60px] lg:text-[75px]">

                  {
                    managed[
                      "title 1"
                    ]
                  }

                </h2>

                <h2 className="mt-2 text-[44px] font-extrabold leading-[0.95] text-white md:text-[60px] lg:text-[75px]">

                  {
                    managed[
                      "title 2"
                    ]
                  }

                </h2>

              </div>

              {/* ================= RIGHT CONTENT ================= */}

              <div className="pointer-events-none absolute inset-0">

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

                      <p className="block text-[25px] font-normal text-[#04BCBC] md:text-[20px] lg:text-[48px]">

                        {
                          managed.tag
                        }

                      </p>

                      <h2 className="mt-2 text-[30px] font-extrabold leading-[0.95] text-white md:text-[40px] lg:text-[75px]">

                        {
                          managed[
                            "title 1"
                          ]
                        }

                      </h2>

                      <h2 className="mt-2 text-[30px] font-extrabold leading-[0.95] text-white md:text-[60px] lg:text-[75px]">

                        {
                          managed[
                            "title 2"
                          ]
                        }

                      </h2>

                    </div>

                    {/* ================= BADGE 1 ================= */}

                    <div className="absolute left-[30px] top-[170px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">

                      <div className="flex items-center gap-2">

                        {badge1.icon_url && (
                          <Image
                            src={
                              badge1.icon_url
                            }
                            alt=""
                            width={
                              28
                            }
                            height={
                              28
                            }
                          />
                        )}

                        <div className="text-[10px] font-medium leading-[1.15] text-white">

                          <p>
                            {
                              badge1.title
                            }
                          </p>

                          <p>
                            {
                              badge1.subtitle
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ================= BADGE 2 ================= */}

                    <div className="absolute right-[30px] top-[197px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-8 py-2 backdrop-blur-xl">

                      <div className="flex items-center gap-2">

                        {badge2.icon_url && (
                          <Image
                            src={
                              badge2.icon_url
                            }
                            alt=""
                            width={
                              28
                            }
                            height={
                              28
                            }
                          />
                        )}

                        <div className="text-[10px] font-medium leading-[1.15] text-white">

                          <p>
                            {
                              badge2.title
                            }
                          </p>

                          <p>
                            {
                              badge2.subtitle
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ================= BADGE 3 ================= */}

                    <div className="absolute right-[35px] top-[304px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-8 py-2 backdrop-blur-xl">

                      <div className="flex items-center gap-2">

                        {badge3.icon_url && (
                          <Image
                            src={
                              badge3.icon_url
                            }
                            alt=""
                            width={
                              28
                            }
                            height={
                              28
                            }
                          />
                        )}

                        <div className="text-[10px] font-medium leading-[1.15] text-white">

                          <p>
                            {
                              badge3.title
                            }
                          </p>

                          <p>
                            {
                              badge3.subtitle
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ================= BADGE 4 ================= */}

                    <div className="absolute left-[50px] top-[250px] z-10 rounded-[10px] border border-white/20 bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-xl">

                      <div className="flex items-center gap-2">

                        {badge4.icon_url && (
                          <Image
                            src={
                              badge4.icon_url
                            }
                            alt=""
                            width={
                              28
                            }
                            height={
                              28
                            }
                          />
                        )}

                        <div className="text-[10px] font-medium leading-[1.15] text-white">

                          <p>
                            {
                              badge4.title
                            }
                          </p>

                          <p>
                            {
                              badge4.subtitle
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ================= DESKTOP ================= */}

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

                      {badge1.icon_url && (
                        <Image
                          src={
                            badge1.icon_url
                          }
                          alt=""
                          width={
                            50
                          }
                          height={
                            50
                          }
                        />
                      )}

                      <div className="text-[15px] font-medium leading-5 text-white">

                        <p>
                          {
                            badge1.title
                          }
                        </p>

                        <p>
                          {
                            badge1.subtitle
                          }
                        </p>

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

                      {badge2.icon_url && (
                        <Image
                          src={
                            badge2.icon_url
                          }
                          alt=""
                          width={
                            50
                          }
                          height={
                            50
                          }
                        />
                      )}

                      <div className="text-[15px] font-medium leading-5 text-white">

                        <p>
                          {
                            badge2.title
                          }
                        </p>

                        <p>
                          {
                            badge2.subtitle
                          }
                        </p>

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
                      bg-[#04BCBC]/20
                      px-5
                      py-5
                      shadow-xl
                      backdrop-blur-xl
                    "
                  >

                    <div className="flex items-center gap-3">

                      {badge3.icon_url && (
                        <Image
                          src={
                            badge3.icon_url
                          }
                          alt=""
                          width={
                            50
                          }
                          height={
                            50
                          }
                        />
                      )}

                      <div className="text-[15px] font-medium leading-5 text-white">

                        <p>
                          {
                            badge3.title
                          }
                        </p>

                        <p>
                          {
                            badge3.subtitle
                          }
                        </p>

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
                      bg-[#04BCBC]/20
                      px-5
                      py-5
                      shadow-xl
                      backdrop-blur-xl
                    "
                  >

                    <div className="flex items-center gap-3">

                      {badge4.icon_url && (
                        <Image
                          src={
                            badge4.icon_url
                          }
                          alt=""
                          width={
                            50
                          }
                          height={
                            50
                          }
                        />
                      )}

                      <div className="text-[15px] font-medium leading-5 text-white">

                        <p>
                          {
                            badge4.title
                          }
                        </p>

                        <p>
                          {
                            badge4.subtitle
                          }
                        </p>

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