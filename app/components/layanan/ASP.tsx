"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import type {
  CmsProduct,
  CmsSectionContent,
} from "@/app/services/cms";

type Props = {
  content?:
    CmsSectionContent;

  products?:
    CmsProduct[];
};

type ProductFeature = {
  id?: string;
  title?: string;
  description?: string;
  sort_order?: number;
};

type ProductMeta = {
  media_type?:
    | "image"
    | "youtube";

  youtube_url?:
    string;
};

/**
 * =========================================================
 * TEXT
 * =========================================================
 */
function text(
  content:
    | CmsSectionContent
    | undefined,

  key:
    string
) {
  const value =
    content?.[key];

  return typeof value ===
    "string"
    ? value
    : "";
}

/**
 * =========================================================
 * PRODUCT FEATURES
 * =========================================================
 *
 * Tidak memakai type predicate Record<string, unknown>
 * karena product.features sudah punya tipe dari CmsProduct.
 */
function getFeatures(
  product:
    | CmsProduct
    | undefined
): ProductFeature[] {
  if (
    !product ||
    !Array.isArray(
      product.features
    )
  ) {
    return [];
  }

  return product.features
    .map(
      (
        item
      ): ProductFeature => ({
        id:
          item.id !==
            undefined &&
          item.id !==
            null
            ? String(
                item.id
              )
            : undefined,

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

        sort_order:
          typeof item.sort_order ===
          "number"
            ? item.sort_order
            : 0,
      })
    )
    .sort(
      (
        a,
        b
      ) =>
        (
          a.sort_order ??
          0
        ) -
        (
          b.sort_order ??
          0
        )
    );
}

/**
 * =========================================================
 * PRODUCT META
 * =========================================================
 */
function getProductMeta(
  product:
    | CmsProduct
    | undefined
): ProductMeta {
  if (!product) {
    return {};
  }

  const meta =
    product.meta;

  if (
    !meta ||
    typeof meta !==
      "object" ||
    Array.isArray(
      meta
    )
  ) {
    return {};
  }

  return meta as ProductMeta;
}

/**
 * =========================================================
 * YOUTUBE EMBED URL
 * =========================================================
 *
 * Mendukung:
 *
 * youtube.com/watch?v=...
 * youtu.be/...
 * youtube.com/embed/...
 * youtube.com/shorts/...
 */
function getYoutubeEmbedUrl(
  value:
    string
) {
  const input =
    value.trim();

  if (!input) {
    return "";
  }

  try {
    const url =
      new URL(
        input
      );

    /**
     * Sudah embed.
     */
    if (
      url.hostname.includes(
        "youtube.com"
      ) &&
      url.pathname.startsWith(
        "/embed/"
      )
    ) {
      return input;
    }

    /**
     * youtube.com/watch?v=...
     */
    if (
      url.hostname.includes(
        "youtube.com"
      )
    ) {
      const videoId =
        url.searchParams.get(
          "v"
        );

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      /**
       * YouTube Shorts.
       */
      if (
        url.pathname.startsWith(
          "/shorts/"
        )
      ) {
        const videoId =
          url.pathname
            .replace(
              "/shorts/",
              ""
            )
            .split(
              "/"
            )[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    }

    /**
     * youtu.be/xxxx
     */
    if (
      url.hostname ===
        "youtu.be" ||
      url.hostname ===
        "www.youtu.be"
    ) {
      const videoId =
        url.pathname
          .replace(
            "/",
            ""
          )
          .split(
            "/"
          )[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return input;
  } catch {
    return input;
  }
}

/**
 * =========================================================
 * ASP COMPONENT
 * =========================================================
 */
export default function ASP({
  content,
  products = [],
}: Props) {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState<
      string | null
    >(null);

  const [
    currentProduct,
    setCurrentProduct,
  ] =
    useState(0);

  /**
   * =====================================================
   * KEEP PRODUCT INDEX VALID
   * =====================================================
   */
  useEffect(() => {
    if (
      products.length ===
      0
    ) {
      setCurrentProduct(
        0
      );

      return;
    }

    if (
      currentProduct >
      products.length -
        1
    ) {
      setCurrentProduct(
        0
      );
    }
  }, [
    products.length,
    currentProduct,
  ]);

  /**
   * =====================================================
   * ACTIVE PRODUCT
   * =====================================================
   */
  const product =
    products[
      currentProduct
    ];

  const features =
    getFeatures(
      product
    );

  const productMeta =
    getProductMeta(
      product
    );

  const rawYoutubeUrl =
    typeof productMeta
      .youtube_url ===
      "string"
      ? productMeta
          .youtube_url
      : "";

  const youtubeUrl =
    getYoutubeEmbedUrl(
      rawYoutubeUrl
    );

  const productImage =
    product
      ?.image_url ??
    "";

  const productName =
    product?.name ??
    "";

  const productDescription =
    product
      ?.description ??
    "";

  /**
   * =====================================================
   * MEDIA TYPE
   * =====================================================
   *
   * Kompatibel dengan data lama.
   *
   * Kalau media_type belum tersedia,
   * tetapi youtube_url sudah ada,
   * otomatis dianggap YouTube.
   */
  const mediaType:
    | "image"
    | "youtube" =
    productMeta
      .media_type ===
      "youtube"
      ? "youtube"
      : productMeta
          .media_type ===
          "image"
        ? "image"
        : youtubeUrl
          ? "youtube"
          : "image";

  /**
   * =====================================================
   * HERO ASP
   * =====================================================
   *
   * Khusus gambar saja.
   */
  const heroImage =
    text(
      content,
      "hero_image"
    );

  return (
    <main className="overflow-hidden bg-white">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="bg-[#F5FBFD] pb-20 pt-[90px]">

        <div className="relative mx-auto w-full max-w-[1600px] px-10 lg:px-20">

          {/* ================= HEADING ================= */}

          <div className="text-center">

            <h1 className="text-[44px] font-extrabold leading-none text-[#05638B] sm:text-[56px] lg:text-[64px]">
              {text(
                content,
                "title"
              )}
            </h1>

            <h2 className="mt-2 text-[26px] font-medium leading-tight text-black sm:text-[36px] lg:text-[54px]">
              {text(
                content,
                "subtitle"
              )}
            </h2>

            <p className="mt-2 text-sm text-gray-700 sm:text-base lg:text-xl">
              {text(
                content,
                "description"
              )}{" "}

              <span className="text-[#05638B]">
                {text(
                  content,
                  "technology"
                )}
              </span>
            </p>

          </div>

          {/* ================= ASP CARDS ================= */}

          <div className="mt-8 w-full sm:mt-12">

            <div
              className="
                grid
                grid-cols-2
                gap-3
                px-2

                lg:flex
                lg:items-end
                lg:justify-center
                lg:gap-4
                lg:px-0
              "
            >

              {/* ================= IMAGE ONLY ================= */}

              <div
                className="
                  relative
                  h-[240px]
                  w-full
                  overflow-hidden
                  rounded-[30px]

                  lg:h-[320px]
                  lg:w-[190px]
                "
              >
                {heroImage ? (
                  <Image
                    src={
                      heroImage
                    }
                    alt="ASP"
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-400">
                    Image belum tersedia
                  </div>
                )}
              </div>

              {/* ================= CARD 1 ================= */}

              <div
                className="
                  flex
                  h-[200px]
                  w-full
                  items-center
                  justify-center
                  rounded-[30px]
                  bg-[linear-gradient(180deg,#0D668A_0%,#0A5F7E_45%,#062F44_100%)]
                  px-5
                  text-center
                  text-white

                  lg:h-[240px]
                  lg:w-[190px]
                "
              >
                <p className="text-[13px] leading-5 lg:text-[14px]">
                  {text(
                    content,
                    "card1"
                  )}
                </p>
              </div>

              {/* ================= CARD 2 ================= */}

              <div
                className="
                  flex
                  h-[180px]
                  w-full
                  items-center
                  justify-center
                  rounded-[30px]
                  border
                  border-gray-200
                  bg-white
                  px-5
                  text-center
                  shadow-sm

                  lg:h-[185px]
                  lg:w-[190px]
                "
              >
                <p className="text-[14px] leading-6 text-[#233B5A] lg:text-[16px] lg:leading-7">
                  {text(
                    content,
                    "card2"
                  )}
                </p>
              </div>

              {/* ================= CARD 3 ================= */}

              <div
                className="
                  flex
                  h-[200px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-[30px]
                  bg-[#9FC8DC]
                  text-white

                  lg:h-[240px]
                  lg:w-[190px]
                "
              >
                <h3 className="text-4xl lg:text-5xl">
                  5+
                </h3>

                <p className="mt-3 w-32 text-center text-xs leading-5 lg:text-sm lg:leading-6">
                  {text(
                    content,
                    "card3"
                  )}
                </p>
              </div>

              {/* ================= CARD 4 ================= */}

              <div
                className="
                  relative
                  col-span-2
                  flex
                  h-[240px]
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[30px]
                  bg-[#0A4D69]
                  px-6
                  text-center
                  text-white

                  lg:col-span-1
                  lg:h-[320px]
                  lg:w-[190px]
                "
              >
                <div
                  className="
                    absolute
                    -left-7
                    -top-7
                    h-24
                    w-24
                    rounded-full
                    border-[18px]
                    border-[#0D7CA8]/30
                  "
                />

                <div
                  className="
                    absolute
                    -left-2
                    -top-2
                    h-12
                    w-12
                    rounded-full
                    bg-[#062F42]
                  "
                />

                <p className="relative text-sm leading-6 lg:leading-7">
                  {text(
                    content,
                    "card4"
                  )}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      {product && (
        <section className="relative py-20">

          <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-cyan-100 opacity-40 blur-3xl" />

          {/* ================= PREVIOUS ================= */}

          {currentProduct >
            0 && (
            <button
              type="button"
              onClick={() => {
                setCurrentProduct(
                  (
                    current
                  ) =>
                    current -
                    1
                );

                setActiveIndex(
                  null
                );
              }}
              className="absolute left-4 top-[40%] z-20 -translate-y-1/2 text-5xl font-light text-[#05638B] transition hover:text-[#03A8A8] sm:top-1/2"
              aria-label="Previous product"
            >
              ❮
            </button>
          )}

          {/* ================= NEXT ================= */}

          {currentProduct <
            products.length -
              1 && (
            <button
              type="button"
              onClick={() => {
                setCurrentProduct(
                  (
                    current
                  ) =>
                    current +
                    1
                );

                setActiveIndex(
                  null
                );
              }}
              className="absolute right-4 top-[40%] z-20 -translate-y-1/2 text-5xl font-light text-[#05638B] transition hover:text-[#03A8A8] sm:top-1/2"
              aria-label="Next product"
            >
              ❯
            </button>
          )}

          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

            {/* ================= TITLE ================= */}

            <div className="mb-12">

              <h2 className="text-4xl font-bold text-primary">
                {productName}
              </h2>

              {productDescription && (
                <p className="mt-2 max-w-xl text-[20px] font-extralight leading-8 text-gray-600">
                  {
                    productDescription
                  }
                </p>
              )}

            </div>

            <div className="grid items-center gap-24 lg:grid-cols-[720px_1fr] xl:gap-5">

              {/* =================================================
                  PRODUCT MEDIA
              ================================================= */}

              <div className="flex items-center justify-center lg:-translate-y-10">

                <div className="w-full max-w-[650px]">

                  <div className="relative aspect-video w-full overflow-hidden rounded-[28px]">

                    {/* ================= YOUTUBE ================= */}

                    {mediaType ===
                      "youtube" &&
                    youtubeUrl ? (
                      <iframe
                        src={
                          youtubeUrl
                        }
                        title={
                          productName ||
                          "ASP Product"
                        }
                        className="absolute inset-0 h-full w-full rounded-[28px]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : mediaType ===
                        "image" &&
                      productImage ? (

                      /* ================= IMAGE ================= */

                      <Image
                        src={
                          productImage
                        }
                        alt={
                          productName ||
                          "ASP Product"
                        }
                        fill
                        className="object-contain"
                      />

                    ) : (

                      /* ================= EMPTY ================= */

                      <div className="absolute inset-0 flex items-center justify-center rounded-[28px] bg-gray-50 text-sm text-gray-400">
                        Media belum tersedia
                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  FEATURES
              ================================================= */}

              <div className="w-full max-w-[700px] space-y-6">

                {features.map(
                  (
                    feature,
                    index
                  ) => {
                    const itemKey =
                      feature.id ??
                      `${
                        product.slug ??
                        productName ??
                        "product"
                      }-${index}`;

                    const opened =
                      activeIndex ===
                      itemKey;

                    return (
                      <div
                        key={
                          itemKey
                        }
                        className="border-b border-cyan-200 pb-5"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setActiveIndex(
                              opened
                                ? null
                                : itemKey
                            )
                          }
                          className="flex w-full items-start gap-4 text-left"
                        >

                          <div
                            className={`mt-1 h-4 w-4 rounded-full border-2 ${
                              opened
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            }`}
                          />

                          <div className="flex-1">

                            <h3 className="text-base text-gray-800">
                              {
                                feature.title
                              }
                            </h3>

                            <p className="mt-1 text-sm italic text-primary">
                              {opened
                                ? text(
                                    content,
                                    "showLess"
                                  )
                                : text(
                                    content,
                                    "seeMore"
                                  )}
                            </p>

                            {opened &&
                              feature.description && (
                                <p className="mt-3 leading-7 text-gray-600">
                                  {
                                    feature.description
                                  }
                                </p>
                              )}

                          </div>

                        </button>

                      </div>
                    );
                  }
                )}

                {features.length ===
                  0 && (
                  <div className="py-8 text-sm text-gray-400">
                    Belum ada feature untuk produk ini.
                  </div>
                )}

              </div>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}