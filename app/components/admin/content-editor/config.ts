import type {
  EditorConfig,
} from "./types";

export const configs: Record<
  string,
  EditorConfig
> = {
  home: {
    title: "Home",

    pageSlug: "home",

    namespaces: [
      "Hero",
      "WhoWeAre",
      "WhyChooseUs",
      "SmartSystem",
      "SmartSystemShowcase",
      "Service",

      /**
       * Client DIHAPUS dari sini.
       *
       * Judul Client akan digabung
       * dengan master clients
       * di ClientsEditor.
       */

      "Contact",
    ],

    masters: [
      "clients",
      "products",
      "technologies",
    ],

    website: "",
  },

  solutions: {
    title: "Solutions",

    pageSlug: "solutions",

    namespaces: [
      "Solutions",
      "WhyChoose",
      "SolutionsIndustry",
    ],

    website: "/solutions",
  },

  about: {
    title: "About",

    pageSlug: "about",

    namespaces: [
      "About",
    ],

    masters: [
      "team",
    ],

    website: "/about",
  },

  service: {
    title: "Service",

    /**
     * Service landing memakai
     * section home -> Service.
     */
    pageSlug: "home",

    namespaces: [
      "Service",
    ],

    masters: [
      "clients",
    ],

    website: "/service",
  },

  asp: {
    title: "ASP",

    pageSlug: "asp",

    namespaces: [
      "Asp",
    ],

    masters: [
      "products",
    ],

    website: "/service/asp",
  },

  isp: {
    title: "ISP",

    pageSlug: "isp",

    namespaces: [
      "ISP",
    ],

    website: "/service/isp",
  },

  resource: {
    title: "Resource",

    pageSlug: "resource",

    namespaces: [
      "Resource",
    ],

    masters: [
      "technologies",
      "clients",
    ],

    website: "/service/resource",
  },

  contact: {
    title: "Contact",

    pageSlug: "contact",

    namespaces: [
      "ContactHero",
      "Contact",
    ],

    website: "/contact",
  },

  portfolio: {
    title: "Portfolio",
    pageSlug: "portfolio",
    namespaces: [],
    website: "",
  },

  testimonial: {
    title: "Testimonial",
    pageSlug: "testimonial",
    namespaces: [],
    website: "",
  },

  faq: {
    title: "FAQ",
    pageSlug: "faq",
    namespaces: [],
    website: "",
  },

  team: {
    title: "Team",

    pageSlug: "about",

    namespaces: [],

    masters: [
      "team",
    ],

    website: "/about",
  },

  partners: {
    title: "Partners",

    pageSlug: "home",

    namespaces: [],

    masters: [
      "clients",
    ],

    website: "",
  },
};