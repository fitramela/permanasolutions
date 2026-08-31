export type Locale =
  | "id"
  | "en";

export type JsonObject =
  Record<string, any>;

export type PageSection = {
  id?: string;
  section_key: string;
  title?: string | null;
  content: JsonObject;
  is_active: boolean;
  sort_order: number;
};

export type PageResponse = {
  success: boolean;

  data: null | {
    id?: string;
    slug: string;
    locale: string;
    sections: PageSection[];
  };
};

export type MasterType =
  | "clients"
  | "team"
  | "products"
  | "technologies";

export type MasterItem =
  Record<string, any> & {
    id?: string | number;
    locale?: Locale;
    is_active?: boolean;
    sort_order?: number;
  };

export type EditorConfig = {
  title: string;

  /**
   * Slug page di database.
   *
   * Contoh:
   * menu admin "service"
   * sebenarnya edit:
   *
   * home -> Service
   */
  pageSlug: string;

  namespaces: string[];

  masters?: MasterType[];

  website: string;
};

export type Leaf = {
  path: Array<
    string | number
  >;

  label: string;

  value:
    | string
    | number
    | boolean;
};