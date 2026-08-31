import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "id"] as const;
export const defaultLocale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = locales.includes(
    requested as (typeof locales)[number]
  )
    ? requested!
    : defaultLocale;

  return {
    locale,
    messages: (
      await import(`./messages/${locale}.json`)
    ).default,
  };
});