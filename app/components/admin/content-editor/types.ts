export type Locale =
  | "id"
  | "en";

export type JsonObject =
  Record<string, any>;

export type PageSection = {
  id?: string;

  section_key: string;

  title?:
    | string
    | null;

  content:
    JsonObject;

  is_active:
    boolean;

  sort_order:
    number;
};

export type PageResponse = {
  success:
    boolean;

  data:
    | null
    | {
        id?: string;

        slug:
          string;

        locale:
          string;

        sections:
          PageSection[];
      };
};

export type MasterType =
  | "clients"
  | "team"
  | "products"
  | "technologies";

export type ProductMeta = {
  youtube_url?:
    string;

  [key: string]:
    any;
};

export type MasterItem =
  Record<string, any> & {
    id?:
      string | number;

    locale?:
      Locale;

    is_active?:
      boolean;

    sort_order?:
      number;

    translation_key?:
      string;

    /**
     * Products
     */
    slug?:
      string;

    service?:
      string;

    category?:
      string;

    description?:
      string;

    image_url?:
      string;

    meta?:
      ProductMeta;

    /**
     * Clients
     */
    industry?:
      string;

    placement?:
      string;

    logo_url?:
      string;

    /**
     * Team
     */
    position?:
      string;

    bio?:
      string;

    photo_url?:
      string;

    linkedin_url?:
      string;
  };

export type EditorConfig = {
  title:
    string;

  /**
   * Slug page di database.
   *
   * Contoh:
   *
   * menu admin:
   * service
   *
   * sebenarnya mengedit:
   * home -> Service
   */
  pageSlug:
    string;

  namespaces:
    string[];

  masters?:
    MasterType[];

  website:
    string;

  /**
   * =====================================================
   * PRODUCT SERVICE FILTER
   * =====================================================
   *
   * Digunakan agar master Products
   * pada suatu halaman hanya menampilkan
   * service tertentu.
   *
   * Contoh:
   *
   * ASP:
   * productService = "asp"
   */
  productService?:
    string;
};

export type Leaf = {
  path:
    Array<
      string | number
    >;

  label:
    string;

  value:
    | string
    | number
    | boolean;
};