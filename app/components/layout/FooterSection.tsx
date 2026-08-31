"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

type FormData = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  description: string;
};

type CmsContent = Record<
  string,
  unknown
>;

type CmsSettings = {
  company?: {
    name?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    navbar_logo_url?: string;
    footer_logo_url?: string;
    footer_background_image?: string;
    address?: string;
    footer_tagline?: string;
    company_profile_id?: string;
    company_profile_en?: string;
  };

  footer?: {
    id?: {
      copyright?: string;
    };

    en?: {
      copyright?: string;
    };
  };

  social_media?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
};

type SettingsResponse = {
  success?: boolean;
  data?: CmsSettings;
};

type ContactPageResponse = {
  success?: boolean;

  data?: {
    sections?: Array<{
      section_key?: string;
      content?: CmsContent;
      is_active?: boolean;
    }>;
  };
};

type LeadResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

const formFields = [
  {
    key: "fullName",
    label: "fullName",
    placeholder:
      "fullNamePlaceholder",
    type: "text",
  },
  {
    key: "companyName",
    label: "companyName",
    placeholder:
      "companyNamePlaceholder",
    type: "text",
  },
  {
    key: "phone",
    label: "phone",
    placeholder:
      "phonePlaceholder",
    type: "tel",
  },
  {
    key: "email",
    label: "email",
    placeholder:
      "emailPlaceholder",
    type: "email",
  },
] as const;

function apiBase() {
  return (
    process.env
      .NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/backend"
  )
    .trim()
    .replace(/\/$/, "");
}

function text(
  content:
    | CmsContent
    | null
    | undefined,
  key: string,
  fallback = ""
) {
  const value =
    content?.[key];

  return typeof value ===
    "string"
    ? value
    : fallback;
}

function telHref(
  phone: string
) {
  return phone.replace(
    /[^\d+]/g,
    ""
  );
}

export const FooterSection =
  () => {
    const formId =
      useId();

    const locale =
      useLocale();

    const currentLocale =
      locale === "en"
        ? "en"
        : "id";

    const [
      settings,
      setSettings,
    ] =
      useState<CmsSettings | null>(
        null
      );

    const [
      content,
      setContent,
    ] =
      useState<CmsContent | null>(
        null
      );

    useEffect(() => {
      let cancelled =
        false;

      async function loadCms() {
        try {
          const [
            settingsResponse,
            contactResponse,
          ] =
            await Promise.all([
              fetch(
                `${apiBase()}/cms/settings`,
                {
                  cache:
                    "no-store",
                }
              ),

              fetch(
                `${apiBase()}/cms/pages/contact?locale=${encodeURIComponent(
                  locale
                )}`,
                {
                  cache:
                    "no-store",
                }
              ),
            ]);

          if (
            settingsResponse.ok
          ) {
            const payload =
              (await settingsResponse.json()) as SettingsResponse;

            if (
              !cancelled &&
              payload.success &&
              payload.data
            ) {
              setSettings(
                payload.data
              );
            }
          }

          if (
            contactResponse.ok
          ) {
            const payload =
              (await contactResponse.json()) as ContactPageResponse;

            const contactSection =
              payload.data?.sections?.find(
                (section) =>
                  section.section_key ===
                    "Contact" &&
                  section.is_active !==
                    false
              );

            if (
              !cancelled &&
              contactSection?.content
            ) {
              setContent(
                contactSection.content
              );
            }
          }
        } catch (error) {
          console.error(
            "Failed to load Footer CMS",
            error
          );
        }
      }

      loadCms();

      return () => {
        cancelled =
          true;
      };
    }, [locale]);

    const companyProfile =
      locale === "en"
        ? settings?.company
            ?.company_profile_en ||
          "/Permana_Company_Profile_2026_English.pdf"
        : settings?.company
            ?.company_profile_id ||
          "/Permana_Company_Profile_2026_Indonesia.pdf";

    const [
      formData,
      setFormData,
    ] =
      useState<FormData>({
        fullName: "",
        companyName: "",
        phone: "",
        email: "",
        description: "",
      });

    const [
      loading,
      setLoading,
    ] =
      useState(false);

    const [
      submitted,
      setSubmitted,
    ] =
      useState(false);

    const [
      submitError,
      setSubmitError,
    ] =
      useState("");

    /**
     * =====================================================
     * SUBMIT CONTACT / LEAD
     * =====================================================
     */
    const handleSubmit =
      async (
        e: FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();

        if (loading) {
          return;
        }

        try {
          setLoading(
            true
          );

          setSubmitError(
            ""
          );

          setSubmitted(
            false
          );

          /**
           * Frontend menggunakan camelCase,
           * sedangkan backend menerima:
           *
           * full_name
           * company
           * phone
           * email
           * message
           */
          const payload = {
            full_name:
              formData.fullName.trim(),

            company:
              formData.companyName.trim(),

            phone:
              formData.phone.trim(),

            email:
              formData.email.trim(),

            message:
              formData.description.trim(),
          };

          const response =
            await fetch(
              `${apiBase()}/leads`,
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          let result:
            | LeadResponse
            | null = null;

          try {
            result =
              (await response.json()) as LeadResponse;
          } catch {
            result =
              null;
          }

          if (
            !response.ok
          ) {
            console.error(
              "Lead API error:",
              result
            );

            throw new Error(
              result?.message ||
                `Gagal mengirim formulir (${response.status}).`
            );
          }

          if (
            result?.success ===
            false
          ) {
            throw new Error(
              result.message ||
                "Gagal mengirim formulir."
            );
          }

          console.log(
            "Lead submitted:",
            result
          );

          setSubmitted(
            true
          );

          setFormData({
            fullName: "",
            companyName: "",
            phone: "",
            email: "",
            description: "",
          });

          setTimeout(
            () => {
              setSubmitted(
                false
              );
            },
            5000
          );
        } catch (error) {
          console.error(
            "Failed to submit lead:",
            error
          );

          setSubmitError(
            error instanceof
              Error
              ? error.message
              : currentLocale ===
                  "id"
                ? "Terjadi kesalahan saat mengirim formulir."
                : "An error occurred while submitting the form."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    /**
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    const companyName =
      settings?.company?.name ||
      "PT Medianusa Permana";

    const logo =
      settings?.company
        ?.footer_logo_url ||
      "/images/icon-logo.png";

    const footerBackground =
      settings?.company
        ?.footer_background_image ||
      "/images/bgFooter.png";

    const address =
      settings?.company?.address ||
      "";

    const phone =
      settings?.company?.phone ||
      "";

    const email =
      settings?.company?.email ||
      "";

    const linkedin =
      settings?.social_media
        ?.linkedin ||
      "#";

    const instagram =
      settings?.social_media
        ?.instagram ||
      "#";

    const youtube =
      settings?.social_media
        ?.youtube ||
      "#";

    const copyright =
      settings?.footer?.[
        currentLocale
      ]?.copyright ||
      `© 2026 ${companyName}`;

    const footerTagline =
      settings?.company
        ?.footer_tagline ||
      "Automate, Boost\nEfficiency, Grow Faster";

    return (
      <footer className="w-full">

        {/* ================= CTA ================= */}

        <section className="relative overflow-hidden py-24">

          <Image
            src={
              footerBackground
            }
            alt=""
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-white/75" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">

            <div className="grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[1fr_650px] lg:gap-24 lg:py-0">

              {/* LEFT */}

              <div className="max-w-[600px]">

                <h2
                  className="
                    whitespace-pre-line
                    text-4xl
                    font-extralight
                    leading-tight
                    text-primary
                    md:text-5xl
                    lg:text-[64px]
                  "
                >
                  {text(
                    content,
                    "title",
                    currentLocale ===
                      "id"
                      ? "Mitra Layanan Teknologi\nTerpercaya"
                      : "Trusted Technology\nService Partner"
                  )}
                </h2>

                <div className="mt-10 flex items-center gap-5">

                  <a
                    href={
                      companyProfile
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#04BCBC] px-7 py-3 font-semibold text-white"
                  >
                    {text(
                      content,
                      "companyProfile",
                      currentLocale ===
                        "id"
                        ? "Profil Perusahaan →"
                        : "Company Profile →"
                    )}
                  </a>

                  <a
                    href={
                      companyProfile
                    }
                    download
                    className="font-semibold text-primary hover:underline"
                  >
                    {text(
                      content,
                      "download",
                      currentLocale ===
                        "id"
                        ? "Unduh"
                        : "Download"
                    )}
                  </a>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex justify-center lg:justify-end">

                <div
                  className="
                    relative
                    min-h-[650px]
                    w-full
                    max-w-[650px]
                    rounded-[38px]
                    bg-white
                    px-8
                    py-10
                    shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                    lg:px-10
                  "
                >

                  <AnimatePresence mode="wait">

                    {!submitted ? (
                      <motion.div
                        key="form"
                        initial={{
                          opacity:
                            0,
                        }}
                        animate={{
                          opacity:
                            1,
                        }}
                        exit={{
                          opacity:
                            0,
                          y: -15,
                        }}
                        transition={{
                          duration:
                            0.4,
                        }}
                      >

                        {/* TITLE */}

                        <h3
                          className="
                            whitespace-pre-line
                            text-center
                            text-[22px]
                            font-bold
                            leading-[30px]
                            text-black
                          "
                        >
                          {text(
                            content,
                            "formTitle",
                            currentLocale ===
                              "id"
                              ? "Temukan Solusi Terbaik\nUntuk Organisasi Anda"
                              : "Find The Best Solution\nFor Your Organization"
                          )}
                        </h3>

                        <div className="mb-6 mt-5 h-[2px] w-full bg-[#1FC8E7]" />

                        <form
                          onSubmit={
                            handleSubmit
                          }
                          className="space-y-4"
                        >

                          {formFields.map(
                            (
                              field
                            ) => (
                              <div
                                key={
                                  field.key
                                }
                              >

                                <label
                                  htmlFor={`${formId}-${field.key}`}
                                  className="
                                    mb-1
                                    block
                                    text-[15px]
                                    font-medium
                                    text-black
                                  "
                                >
                                  <span className="text-red-500">
                                    *
                                  </span>{" "}

                                  {text(
                                    content,
                                    field.label,
                                    field.label
                                  )}
                                </label>

                                <input
                                  id={`${formId}-${field.key}`}
                                  type={
                                    field.type
                                  }
                                  required
                                  placeholder={text(
                                    content,
                                    field.placeholder,
                                    ""
                                  )}
                                  value={
                                    formData[
                                      field.key
                                    ]
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setFormData(
                                      {
                                        ...formData,

                                        [field.key]:
                                          e
                                            .target
                                            .value,
                                      }
                                    )
                                  }
                                  className="
                                    h-[50px]
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#E4E4E4]
                                    bg-white
                                    px-4
                                    text-[14px]
                                    placeholder:text-[#B8B8B8]
                                    shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                                    outline-none
                                    focus:border-[#04BCBC]
                                  "
                                />

                              </div>
                            )
                          )}

                          {/* DESCRIPTION */}

                          <div>

                            <label
                              htmlFor={`${formId}-description`}
                              className="
                                mb-1
                                block
                                text-[15px]
                                font-medium
                                text-black
                              "
                            >
                              <span className="text-red-500">
                                *
                              </span>{" "}

                              {text(
                                content,
                                "description",
                                currentLocale ===
                                  "id"
                                  ? "Deskripsi Singkat Kebutuhan Anda"
                                  : "Brief Description Of Your Needs"
                              )}
                            </label>

                            <textarea
                              id={`${formId}-description`}
                              rows={4}
                              required
                              placeholder={text(
                                content,
                                "descriptionPlaceholder",
                                ""
                              )}
                              value={
                                formData.description
                              }
                              onChange={(
                                e
                              ) =>
                                setFormData(
                                  {
                                    ...formData,

                                    description:
                                      e
                                        .target
                                        .value,
                                  }
                                )
                              }
                              className="
                                w-full
                                rounded-[10px]
                                border
                                border-[#E4E4E4]
                                bg-white
                                p-4
                                text-[14px]
                                placeholder:text-[#B8B8B8]
                                shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                                outline-none
                                focus:border-[#04BCBC]
                              "
                            />

                          </div>

                          {/* ERROR */}

                          {submitError && (
                            <div
                              className="
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                              "
                            >
                              {
                                submitError
                              }
                            </div>
                          )}

                          {/* BUTTON */}

                          <button
                            type="submit"
                            disabled={
                              loading
                            }
                            className="
                              mt-2
                              rounded-[8px]
                              bg-[#05638B]
                              px-6
                              py-2
                              text-sm
                              font-semibold
                              text-white
                              shadow-lg
                              transition
                              hover:bg-[#04506F]
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {loading
                              ? text(
                                  content,
                                  "sending",
                                  currentLocale ===
                                    "id"
                                    ? "Mengirim..."
                                    : "Sending..."
                                )
                              : text(
                                  content,
                                  "submit",
                                  currentLocale ===
                                    "id"
                                    ? "Kirim"
                                    : "Submit"
                                )}
                          </button>

                        </form>

                      </motion.div>
                    ) : (

                      <motion.div
                        key="success"
                        initial={{
                          opacity:
                            0,
                        }}
                        animate={{
                          opacity:
                            1,
                        }}
                        transition={{
                          duration:
                            0.5,
                        }}
                        className="
                          absolute
                          inset-0
                          flex
                          flex-col
                          items-center
                          justify-center
                          rounded-[38px]
                          bg-white
                          px-8
                          text-center
                        "
                      >

                        <motion.div
                          initial={{
                            scale:
                              0,
                            opacity:
                              0,
                          }}
                          animate={{
                            scale: [
                              0,
                              1.25,
                              0.9,
                              1.08,
                              1,
                            ],
                            opacity:
                              1,
                          }}
                          transition={{
                            scale: {
                              delay:
                                0.15,
                              duration:
                                1.2,
                              times: [
                                0,
                                0.25,
                                0.5,
                                0.72,
                                1,
                              ],
                              ease:
                                "easeOut",
                            },
                            opacity: {
                              delay:
                                0.15,
                              duration:
                                0.15,
                            },
                          }}
                        >

                          <svg
                            viewBox="0 0 100 100"
                            className="h-[110px] w-[110px]"
                            fill="none"
                          >
                            <motion.path
                              d="M25 52L43 69L76 34"
                              stroke="#05638B"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{
                                pathLength:
                                  0,
                              }}
                              animate={{
                                pathLength:
                                  1,
                              }}
                              transition={{
                                delay:
                                  0.15,
                                duration:
                                  0.65,
                                ease:
                                  "easeOut",
                              }}
                            />
                          </svg>

                        </motion.div>

                        <motion.p
                          initial={{
                            opacity:
                              0,
                            y: 8,
                          }}
                          animate={{
                            opacity:
                              1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              1.1,
                            duration:
                              0.6,
                            ease:
                              "easeOut",
                          }}
                          className="
                            mt-2
                            text-[12px]
                            font-semibold
                            leading-5
                            text-black
                          "
                        >
                          {text(
                            content,
                            "thankYouTitle",
                            currentLocale ===
                              "id"
                              ? "Terima Kasih Atas Ketertarikan Anda Pada Layanan Kami."
                              : "Thank You For Your Interest In Our Services."
                          )}
                        </motion.p>

                        <motion.p
                          initial={{
                            opacity:
                              0,
                            y: 8,
                          }}
                          animate={{
                            opacity:
                              1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              1.45,
                            duration:
                              0.6,
                            ease:
                              "easeOut",
                          }}
                          className="
                            mt-1
                            max-w-[390px]
                            text-[9px]
                            leading-4
                            text-[#04BCBC]
                          "
                        >
                          {text(
                            content,
                            "thankYouDescription",
                            ""
                          )}
                        </motion.p>

                      </motion.div>
                    )}

                  </AnimatePresence>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FOOTER WAVE ================= */}

        <div className="-mb-1 overflow-hidden leading-none">

          {/* Mobile */}

          <svg
            viewBox="0 0 1440 120"
            className="block h-[60px] w-full md:hidden"
            preserveAspectRatio="none"
          >
            <path
              fill="#05638B"
              d="
                M0,80
                C300,50
                1140,50
                1440,80
                L1440,120
                L0,120
                Z
              "
            />
          </svg>

          {/* Desktop */}

          <svg
            viewBox="0 0 1440 120"
            className="hidden h-[90px] w-full md:block"
            preserveAspectRatio="none"
          >
            <path
              fill="#05638B"
              d="
                M0,80
                C300,10
                1140,10
                1440,80
                L1440,120
                L0,120
                Z
              "
            />
          </svg>

        </div>

        {/* ================= FOOTER ================= */}

        <section className="bg-primary text-white">

          <div className="container-custom py-10 lg:py-12">

            <div className="grid gap-12 lg:grid-cols-2">

              {/* LEFT */}

              <div>

                <div className="flex items-center gap-4">

                  <Image
                    src={
                      logo
                    }
                    alt={
                      companyName
                    }
                    width={78}
                    height={78}
                    className="h-auto"
                  />

                  <div>
                    <p className="mt-1 whitespace-pre-line text-sm text-white/80">
                      {
                        footerTagline
                      }
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex gap-1">

                  {linkedin !==
                    "#" && (
                    <Link
                      href={
                        linkedin
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/images/linkedin.png"
                        alt="LinkedIn"
                        width={42}
                        height={42}
                        className="h-auto"
                      />
                    </Link>
                  )}

                  {instagram !==
                    "#" && (
                    <Link
                      href={
                        instagram
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/images/instagram-logo.png"
                        alt="Instagram"
                        width={42}
                        height={42}
                        className="h-auto"
                      />
                    </Link>
                  )}

                  {youtube !==
                    "#" && (
                    <Link
                      href={
                        youtube
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/images/YouTube.png"
                        alt="YouTube"
                        width={42}
                        height={42}
                        className="h-auto"
                      />
                    </Link>
                  )}

                </div>

              </div>

              {/* RIGHT */}

              <div className="space-y-6">

                {address && (
                  <div className="flex items-start gap-4">

                    <Image
                      src="/images/g-maps.png"
                      alt="Location"
                      width={34}
                      height={34}
                      className="h-auto"
                    />

                    <p className="whitespace-pre-line text-sm leading-6 text-white/90">
                      {
                        address
                      }
                    </p>

                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-4">

                    <Image
                      src="/images/phone.png"
                      alt="Phone"
                      width={34}
                      height={34}
                      className="h-auto"
                    />

                    <a
                      href={`tel:${telHref(
                        phone
                      )}`}
                    >
                      {
                        phone
                      }
                    </a>

                  </div>
                )}

                {email && (
                  <div className="flex items-center gap-4">

                    <Image
                      src="/images/email.png"
                      alt="Email"
                      width={34}
                      height={34}
                      className="h-auto"
                    />

                    <a
                      href={`mailto:${email}`}
                    >
                      {
                        email
                      }
                    </a>

                  </div>
                )}

              </div>

            </div>

            <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/80">
              {
                copyright
              }
            </div>

          </div>

        </section>

      </footer>
    );
  };