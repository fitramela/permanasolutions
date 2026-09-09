import type {
  EditorConfig,
} from "./types";

/**
 * =========================================================
 * NORMAL PAGE CONFIG
 * =========================================================
 */

export const configs: Record<
  string,
  EditorConfig
> = {
  /* =====================================================
     HOME
  ===================================================== */

  home: {
    title:
      "Home",

    pageSlug:
      "home",

    namespaces: [
      "Hero",
      "WhoWeAre",
      "WhyChooseUs",
      "SmartSystem",
      "SmartSystemShowcase",
      "Service",
      "Contact",
    ],

    website:
      "",
  },

  /* =====================================================
     SOLUTIONS
  ===================================================== */

  solutions: {
    title:
      "Solutions",

    pageSlug:
      "solutions",

    namespaces: [
      "Solutions",
      "WhyChoose",
      "SolutionsIndustry",
    ],

    website:
      "/solutions",
  },

  /* =====================================================
     ABOUT
  ===================================================== */

  about: {
    title:
      "About",

    pageSlug:
      "about",

    namespaces: [
      "About",
    ],

    website:
      "/about",
  },

  /* =====================================================
     SERVICE GROUP

     Ini hanya menjadi entry point admin.
     ContentEditor akan menangani child Service.
  ===================================================== */

  service: {
    title:
      "Service",

    pageSlug:
      "home",

    namespaces:
      [],

    website:
      "/service",
  },

  /* =====================================================
     ASP
  ===================================================== */

  asp: {
    title:
      "ASP",

    pageSlug:
      "asp",

    namespaces: [
      "Asp",
    ],

    masters: [
      "products",
    ],

    productService:
      "asp",

    website:
      "/service/asp",
  },

  /* =====================================================
     ISP
  ===================================================== */

  isp: {
    title:
      "ISP",

    pageSlug:
      "isp",

    namespaces: [
      "ISP",
    ],

    website:
      "/service/isp",
  },

  /* =====================================================
     RESOURCE
  ===================================================== */

  resource: {
    title:
      "Resource",

    pageSlug:
      "resource",

    namespaces: [
      "Resource",
    ],

    website:
      "/service/resource",
  },

  /* =====================================================
     CLIENTS
  ===================================================== */

  clients: {
    title:
      "Clients",

    pageSlug:
      "home",

    namespaces:
      [],

    masters: [
      "clients",
    ],

    website:
      "",
  },

  /* =====================================================
     TECHNOLOGIES
  ===================================================== */

  technologies: {
    title:
      "Technologies",

    pageSlug:
      "resource",

    namespaces:
      [],

    masters: [
      "technologies",
    ],

    website:
      "/service/resource",
  },

  /* =====================================================
     TEAM
  ===================================================== */

  team: {
    title:
      "Team",

    pageSlug:
      "about",

    namespaces:
      [],

    masters: [
      "team",
    ],

    website:
      "/about",
  },

  /* =====================================================
     CONTACT
  ===================================================== */

  contact: {
    title:
      "Contact",

    pageSlug:
      "contact",

    namespaces: [
      "ContactHero",
      "Contact",
    ],

    website:
      "/contact",
  },
};

/**
 * =========================================================
 * SERVICE ADMIN MENU
 * =========================================================
 *
 * Ini hanya navigasi admin.
 * Tidak membuat tabel/database baru.
 */
export const serviceEditorItems = [
  {
    key:
      "asp",

    label:
      "ASP",
  },

  {
    key:
      "isp",

    label:
      "ISP",
  },

  {
    key:
      "resource",

    label:
      "Resource",
  },

  {
    key:
      "clients",

    label:
      "Clients",
  },

  {
    key:
      "technologies",

    label:
      "Technologies",
  },
] as const;