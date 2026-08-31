export type CmsSectionContent = Record<string, unknown>;

type CmsSection = {
  section_key: string;
  content: CmsSectionContent;
  is_active?: boolean;
  sort_order?: number;
};

type CmsPage = {
  id?: string | number;
  slug: string;
  locale: string;
  title?: string;
  status: string;
  meta_title?: string | null;
  meta_description?: string | null;
  sections: CmsSection[];
};

type CmsPageApiResponse = {
  success?: boolean;
  data?: CmsPage | null;
};

type CmsMasterApiResponse<T> = {
  success?: boolean;
  data?: T[] | null;
};

export type CmsPageData = Omit<CmsPage, "sections"> & {
  sections: Record<string, CmsSectionContent>;
};

/**
 * =========================================================
 * CLIENT
 * =========================================================
 */

export type CmsClient = {
  id: string;
  name: string;
  industry?: string | null;
  logo_url?: string | null;
  placement?: string | null;
  locale?: string;
  sort_order?: number;
  is_active?: boolean;
};

/**
 * =========================================================
 * PRODUCT FEATURE
 * =========================================================
 */

export type CmsProductFeature = {
  id: string;
  product_id: string;
  title: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

/**
 * =========================================================
 * PRODUCT
 * =========================================================
 */

export type CmsProductMeta = {
  youtube_url?: string;
  [key: string]: unknown;
};

export type CmsProduct = {
  id: string;
  name: string;
  slug: string;
  service: string;
  category?: string | null;
  locale?: string;
  description?: string | null;
  image_url?: string | null;
  meta?: CmsProductMeta | null;
  sort_order?: number;
  is_active?: boolean;
  features?: CmsProductFeature[];
  created_at?: string;
  updated_at?: string;
};

/**
 * =========================================================
 * TECHNOLOGY
 * =========================================================
 */

export type CmsTechnology = {
  id: string;
  name: string;
  category?: string | null;
  logo_url?: string | null;
  locale?: string;
  sort_order?: number;
  is_active?: boolean;
};

/**
 * =========================================================
 * TEAM MEMBER
 * =========================================================
 */

export type CmsTeamMember = {
  id: string;
  name: string;
  position?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  locale?: string;
  sort_order?: number;
  is_active?: boolean;
};

/**
 * =========================================================
 * API BASE
 * =========================================================
 */

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/backend"
  )
    .trim()
    .replace(/\/$/, "");
}

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * =========================================================
 * CMS PAGE
 * =========================================================
 */

export async function getCmsPage(
  slug: string,
  locale: string
): Promise<CmsPageData | null> {
  try {
    const response = await fetch(
      `${apiBase()}/cms/pages/${encodeURIComponent(
        slug
      )}?locale=${encodeURIComponent(locale)}`,
      {
        cache: "no-store",

        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `CMS page request failed: ${response.status} ${response.statusText}`
      );

      return null;
    }

    const payload =
      (await response.json()) as CmsPageApiResponse;

    if (!payload.success || !payload.data) {
      return null;
    }

    const page =
      payload.data;

    const sections: Record<
      string,
      CmsSectionContent
    > = {};

    for (
      const section
      of page.sections ?? []
    ) {
      if (
        section.is_active ===
        false
      ) {
        continue;
      }

      if (
        !isObject(
          section.content
        )
      ) {
        continue;
      }

      sections[
        section.section_key
      ] =
        section.content;
    }

    return {
      ...page,
      sections,
    };
  } catch (error) {
    console.error(
      `Failed to load CMS page "${slug}"`,
      error
    );

    return null;
  }
}

/**
 * =========================================================
 * GENERIC CMS MASTER
 * =========================================================
 */

export async function getCmsMaster<T>(
  type: string,
  locale?: string
): Promise<T[]> {
  try {
    const query =
      locale
        ? `?locale=${encodeURIComponent(
            locale
          )}`
        : "";

    const response = await fetch(
      `${apiBase()}/cms/master/${encodeURIComponent(
        type
      )}${query}`,
      {
        cache: "no-store",

        headers: {
          Accept:
            "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `CMS master request failed (${type}): ${response.status} ${response.statusText}`
      );

      return [];
    }

    const payload =
      (await response.json()) as CmsMasterApiResponse<T>;

    if (
      !payload.success ||
      !Array.isArray(
        payload.data
      )
    ) {
      return [];
    }

    return payload.data;
  } catch (error) {
    console.error(
      `Failed to load CMS master "${type}"`,
      error
    );

    return [];
  }
}

/**
 * =========================================================
 * CLIENTS
 * =========================================================
 */

export function getCmsClients(
  locale: string
): Promise<CmsClient[]> {
  return getCmsMaster<CmsClient>(
    "clients",
    locale
  );
}

/**
 * =========================================================
 * PRODUCTS
 * =========================================================
 */

export function getCmsProducts(
  locale: string
): Promise<CmsProduct[]> {
  return getCmsMaster<CmsProduct>(
    "products",
    locale
  );
}

/**
 * =========================================================
 * TECHNOLOGIES
 * =========================================================
 */

export function getCmsTechnologies(
  locale: string
): Promise<CmsTechnology[]> {
  return getCmsMaster<CmsTechnology>(
    "technologies",
    locale
  );
}

/**
 * =========================================================
 * TEAM
 * =========================================================
 */

export function getCmsTeam(
  locale: string
): Promise<CmsTeamMember[]> {
  return getCmsMaster<CmsTeamMember>(
    "team",
    locale
  );
}