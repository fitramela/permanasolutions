import type {
  JsonObject,
  Leaf,
  Locale,
  MasterItem,
  MasterType,
} from "./types";

/**
 * =========================================================
 * CLONE
 * =========================================================
 */
export function clone<T>(
  value: T
): T {
  return JSON.parse(
    JSON.stringify(value)
  );
}

/**
 * =========================================================
 * DEFAULT CMS SECTION
 * =========================================================
 */
export function getDefaultSection(
  _locale: Locale,
  _namespace: string
): JsonObject {
  return {};
}

/**
 * =========================================================
 * DEEP MERGE
 * =========================================================
 */
export function merge(
  base: JsonObject,
  override: JsonObject
): JsonObject {
  if (
    Array.isArray(base) ||
    Array.isArray(override)
  ) {
    return clone(
      override ?? base
    );
  }

  const result: JsonObject = {
    ...base,
  };

  for (
    const [key, value]
    of Object.entries(
      override ?? {}
    )
  ) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === "object" &&
      !Array.isArray(
        result[key]
      )
    ) {
      result[key] =
        merge(
          result[key],
          value as JsonObject
        );
    } else {
      result[key] =
        value;
    }
  }

  return result;
}

/**
 * =========================================================
 * FLATTEN
 * =========================================================
 */
export function flatten(
  value: any,
  path: Array<
    string | number
  > = []
): Leaf[] {
  if (
    value === null ||
    value === undefined
  ) {
    return [
      {
        path,
        label:
          path.join(" › "),
        value: "",
      },
    ];
  }

  if (
    [
      "string",
      "number",
      "boolean",
    ].includes(
      typeof value
    )
  ) {
    return [
      {
        path,
        label:
          path.join(" › "),
        value,
      },
    ];
  }

  if (
    Array.isArray(value)
  ) {
    return value.flatMap(
      (
        item,
        index
      ) =>
        flatten(
          item,
          [
            ...path,
            index,
          ]
        )
    );
  }

  if (
    typeof value ===
    "object"
  ) {
    return Object.entries(
      value
    ).flatMap(
      ([key, item]) =>
        flatten(
          item,
          [
            ...path,
            key,
          ]
        )
    );
  }

  return [];
}

/**
 * =========================================================
 * SET AT PATH
 * =========================================================
 */
export function setAtPath(
  source: JsonObject,
  path: Array<
    string | number
  >,
  value:
    | string
    | number
    | boolean
) {
  const next =
    clone(source);

  let cursor: any =
    next;

  path.forEach(
    (
      key,
      index
    ) => {
      if (
        index ===
        path.length - 1
      ) {
        cursor[key] =
          value;

        return;
      }

      if (
        cursor[key] ===
          undefined ||
        cursor[key] ===
          null
      ) {
        const nextKey =
          path[index + 1];

        cursor[key] =
          typeof nextKey ===
          "number"
            ? []
            : {};
      }

      cursor =
        cursor[key];
    }
  );

  return next;
}

/**
 * =========================================================
 * PRETTY LABEL
 * =========================================================
 */
export function prettyLabel(
  path: Array<
    string | number
  >
) {
  return path
    .map(
      (part) =>
        typeof part ===
        "number"
          ? `Item ${part + 1}`
          : String(part)
              .replace(
                /([A-Z])/g,
                " $1"
              )
              .replace(
                /[-_]/g,
                " "
              )
              .trim()
    )
    .join(" › ");
}

/**
 * =========================================================
 * IMAGE PATH
 * =========================================================
 */
export function isImagePath(
  path: Array<
    string | number
  >
) {
  const last =
    String(
      path[
        path.length - 1
      ] ?? ""
    ).toLowerCase();

  return [
    "image",
    "image_url",
    "desktop_image",
    "mobile_image",
    "hero_image",
    "img",
    "photo",
    "photo_url",
    "logo",
    "logo_url",
    "icon",
    "icon_url",
    "background",
    "background_image",
    "banner",
    "thumbnail",
  ].some(
    (key) =>
      last.includes(key)
  );
}

/**
 * =========================================================
 * UPLOAD RESPONSE
 * =========================================================
 */
export function getUploadUrl(
  response: any
) {
  return (
    response?.data?.url ??
    response?.data
      ?.image_url ??
    response?.data
      ?.secure_url ??
    response?.url ??
    response?.image_url ??
    response?.secure_url ??
    ""
  );
}

/**
 * =========================================================
 * YOUTUBE EMBED URL
 * =========================================================
 *
 * Admin boleh paste:
 *
 * youtube.com/watch?v=...
 * youtu.be/...
 * youtube.com/embed/...
 *
 * Semuanya dinormalisasi.
 */
export function getYoutubeEmbedUrl(
  value: string
) {
  const input =
    value.trim();

  if (!input) {
    return "";
  }

  try {
    const url =
      new URL(input);

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
       * Shorts.
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
            .split("/")[0];

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
          .replace("/", "")
          .split("/")[0];

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
 * MASTER LABEL
 * =========================================================
 */
export function masterLabel(
  type: MasterType
) {
  switch (type) {
    case "clients":
      return "Clients";

    case "team":
      return "Team";

    case "products":
      return "Products / Services";

    case "technologies":
      return "Technologies";

    default:
      return type;
  }
}

/**
 * =========================================================
 * EMPTY MASTER FORM
 * =========================================================
 */
export function emptyMasterForm(
  type: MasterType,
  locale: Locale
): MasterItem {
  /**
   * CLIENTS
   */
  if (
    type === "clients"
  ) {
    return {
      name: "",
      industry: "",
      logo_url: "",
      placement: "",
      locale,
      sort_order: 0,
      is_active: true,
    };
  }

  /**
   * TEAM
   */
  if (
    type === "team"
  ) {
    return {
      name: "",
      position: "",
      bio: "",
      photo_url: "",
      linkedin_url: "",
      locale,
      sort_order: 0,
      is_active: true,
    };
  }

  /**
   * TECHNOLOGIES
   */
  if (
    type ===
    "technologies"
  ) {
    return {
      name: "",
      category: "",
      logo_url: "",
      locale,
      sort_order: 0,
      is_active: true,
    };
  }

  /**
   * PRODUCTS
   */
  return {
    name: "",
    service: "",
    category: "",
    description: "",

    /**
     * Dipakai kalau source = image.
     */
    image_url: "",

    /**
     * Media ASP.
     */
    meta: {
      media_type:
        "image",

      youtube_url:
        "",
    },

    locale,

    sort_order: 0,

    is_active: true,
  };
}