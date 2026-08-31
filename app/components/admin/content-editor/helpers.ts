import type {
  JsonObject,
  Leaf,
  Locale,
  MasterItem,
  MasterType,
} from "./types";

export function clone<T>(
  value: T
): T {
  return JSON.parse(
    JSON.stringify(value)
  );
}

/**
 * Messages JSON sudah tidak
 * menjadi default CMS.
 */
export function getDefaultSection(
  _locale: Locale,
  _namespace: string
): JsonObject {
  return {};
}

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

  const result:
    JsonObject = {
    ...base,
  };

  for (
    const [
      key,
      value,
    ]
    of Object.entries(
      override ?? {}
    )
  ) {
    if (
      value &&
      typeof value ===
        "object" &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] ===
        "object" &&
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
          path.join(
            " › "
          ),

        value:
          "",
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
          path.join(
            " › "
          ),

        value,
      },
    ];
  }

  if (
    Array.isArray(
      value
    )
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
      (
        [
          key,
          item,
        ]
      ) =>
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

  let cursor:
    any =
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

      /**
       * Defensive:
       * kalau nested path
       * ternyata belum ada.
       */
      if (
        cursor[key] ===
          undefined ||
        cursor[key] ===
          null
      ) {
        const nextKey =
          path[
            index + 1
          ];

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
          ? `Item ${
              part + 1
            }`
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
    .join(
      " › "
    );
}

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
      last.includes(
        key
      )
  );
}

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

export function emptyMasterForm(
  type: MasterType,
  locale: Locale
): MasterItem {
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

  return {
    name: "",
    service: "",
    category: "",
    description: "",
    image_url: "",
    locale,
    sort_order: 0,
    is_active: true,
  };
}