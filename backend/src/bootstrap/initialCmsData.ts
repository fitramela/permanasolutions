import fs from 'fs';
import path from 'path';

export type Locale = 'id' | 'en';

export type JsonObject = Record<string, unknown>;

export type InitialCmsPage = {
  slug: string;
  locale: Locale;
  title: string;
  sections: Record<string, JsonObject>;
};

export type InitialTeamMember = {
  name: string;
  position?: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  locale: Locale;
  sort_order: number;
};

export type InitialClient = {
  name: string;
  industry?: string;
  logo_url?: string;
  placement?: string;
  locale: Locale;
  sort_order: number;
};

export type InitialProductFeature = {
  title: string;
  description?: string;
  sort_order: number;
};

export type InitialProduct = {
  name: string;
  slug: string;
  service: string;
  category?: string;
  locale: Locale;
  description?: string;
  image_url?: string;
  youtube_url?: string;
  sort_order: number;
  features: InitialProductFeature[];
};

/**
 * =========================================================
 * JSON READER
 * =========================================================
 */

function readJson(filename: string): JsonObject {
  const filePath = path.resolve(
    __dirname,
    'data',
    filename
  );

  return JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  ) as JsonObject;
}

const idMessages = readJson('id.json');
const enMessages = readJson('en.json');

/**
 * Helper untuk mengambil object dari messages.
 */
function objectValue(
  source: JsonObject,
  key: string
): JsonObject {
  const value = source[key];

  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as JsonObject;
}

function stringValue(
  source: JsonObject,
  key: string
): string {
  const value = source[key];

  return typeof value === 'string'
    ? value
    : '';
}

/**
 * =========================================================
 * CMS PAGES
 * =========================================================
 */

function buildPages(
  locale: Locale,
  messages: JsonObject
): InitialCmsPage[] {
  return [
    /**
     * HOME
     */
    {
      slug: 'home',
      locale,

      title:
        locale === 'id'
          ? 'Beranda'
          : 'Home',

      sections: {
        Hero: {
          ...objectValue(
            messages,
            'Hero'
          ),

          background_image:
            '/images/bgHome.png',
        },

        WhoWeAre: {
          ...objectValue(
            messages,
            'WhoWeAre'
          ),

          image_url:
            '/images/newWHO.png',

          secondary_image_url:
            '/images/image 10.png',
        },

        WhyChooseUs: {
          ...objectValue(
            messages,
            'WhyChooseUs'
          ),

          background_image:
            '/images/bgdriving.png',
        },

        SmartSystem:
          objectValue(
            messages,
            'SmartSystem'
          ),

        SmartSystemShowcase:
          objectValue(
            messages,
            'SmartSystemShowcase'
          ),

        Service:
          objectValue(
            messages,
            'Service'
          ),

        Client:
          objectValue(
            messages,
            'Client'
          ),

        Contact:
          objectValue(
            messages,
            'Contact'
          ),
      },
    },

    /**
     * SOLUTIONS
     */
    {
      slug: 'solutions',
      locale,

      title:
        locale === 'id'
          ? 'Solusi'
          : 'Solutions',

      sections: {
        Solutions:
          objectValue(
            messages,
            'Solutions'
          ),

        WhyChoose:
          objectValue(
            messages,
            'WhyChoose'
          ),

        SolutionsIndustry:
          objectValue(
            messages,
            'SolutionsIndustry'
          ),
      },
    },

    /**
     * ASP
     */
    {
      slug: 'asp',
      locale,
      title: 'ASP',

      sections: {
        Asp: {
          ...objectValue(
            messages,
            'Asp'
          ),

          hero_image:
            '/images/image 44.png',
        },
      },
    },

    /**
     * ISP
     */
    {
      slug: 'isp',
      locale,
      title: 'ISP',

      sections: {
        ISP:
          objectValue(
            messages,
            'ISP'
          ),
      },
    },

    /**
     * CONSULTING & RESOURCE
     */
    {
      slug: 'resource',
      locale,

      title:
        locale === 'id'
          ? 'Konsultasi & Layanan Profesional'
          : 'Consulting & Resource',

      sections: {
        Resource:
          objectValue(
            messages,
            'Resource'
          ),
      },
    },

    /**
     * ABOUT
     */
    {
      slug: 'about',
      locale,

      title:
        locale === 'id'
          ? 'Tentang Kami'
          : 'About Us',

      sections: {
        About:
          objectValue(
            messages,
            'About'
          ),
      },
    },

    /**
     * CONTACT
     */
    {
      slug: 'contact',
      locale,

      title:
        locale === 'id'
          ? 'Kontak'
          : 'Contact',

      sections: {
        ContactHero:
          objectValue(
            messages,
            'ContactHero'
          ),

        Contact:
          objectValue(
            messages,
            'Contact'
          ),
      },
    },
  ];
}

export const initialCmsPages: InitialCmsPage[] = [
  ...buildPages(
    'id',
    idMessages
  ),

  ...buildPages(
    'en',
    enMessages
  ),
];

/**
 * =========================================================
 * CMS MIGRATION VERSION 3
 * HOME IMAGE + LINK CONTENT
 * =========================================================
 */

export const initialHomeContentV3 = {
  SmartSystem: {
    dashboard_image:
      '/images/dashboard-preview.png',

    system_images: [
      {
        name: 'Prime Course',
        image_url:
          '/images/image 679.png',
      },
      {
        name: 'Prime EDU',
        image_url:
          '/images/image 683.png',
      },
      {
        name: 'Prime Cafe',
        image_url:
          '/images/image 680.png',
      },
      {
        name: 'Prime Restaurant',
        image_url:
          '/images/image 681.png',
      },
      {
        name: 'Prime Biz',
        image_url:
          '/images/image 682.png',
      },
      {
        name: 'Prime Teams',
        image_url:
          '/images/PrimeTeams color.png',
      },
    ],
  },

  Service: {
    asp_image:
      '/images/asp.png',

    asp_href:
      '/service/asp',

    isp_image:
      '/images/isp.png',

    isp_href:
      '/service/isp',

    resource_image:
      '/images/resource.png',

    resource_href:
      '/service/resource',
  },
} as const;

/**
 * =========================================================
 * CMS MIGRATION VERSION 4
 * HOME WHO WE ARE SECONDARY IMAGE
 * =========================================================
 */

export const initialHomeContentV4 = {
  WhoWeAre: {
    secondary_image_url:
      '/images/image 10.png',
  },
} as const;

/**
 * =========================================================
 * CMS MIGRATION VERSION 5
 * SOLUTIONS IMAGE + LINK CONTENT
 * =========================================================
 */

export const initialSolutionsContentV5 = {
  Solutions: {
    hero: {
      desktop_image:
        '/images/solutions new.png',

      mobile_image:
        '/images/solutions-mobile.png',

      company_profile_id:
        '/Permana_Company_Profile_2026_Indonesia.pdf',

      company_profile_en:
        '/Permana_Company_Profile_2026_English.pdf',

      contact_href:
        '/contact',
    },
  },

  WhyChoose: {
    image_url:
      '/images/image 695.png',

    line_image:
      '/images/line.png',

    item_icons: [
      {
        index: 0,
        icon_url:
          '/images/Wi-Fi Lock.png',
      },
      {
        index: 1,
        icon_url:
          '/images/Gears.png',
      },
      {
        index: 2,
        icon_url:
          '/images/Combo Chart.png',
      },
      {
        index: 3,
        icon_url:
          '/images/Idea.png',
      },
      {
        index: 4,
        icon_url:
          '/images/Check File.png',
      },
      {
        index: 5,
        icon_url:
          '/images/Launch.png',
      },
    ],
  },

  SolutionsIndustry: {
    image_id:
      '/images/Frame-id.png',

    image_en:
      '/images/Frame-en.png',
  },
} as const;

/**
 * =========================================================
 * TEAM MEMBERS
 * =========================================================
 */

const teamPhotoMap: Record<
  string,
  string
> = {
  ekie: '/images/foto11.png',
  putut: '/images/foto12.png',
  indah: '/images/13foto.png',
  putri: '/images/14foto.png',
  serly: '/images/foto15.png',
  palupi: '/images/foto16.png',
  fitra: '/images/foto17.png',
  umar: '/images/foto18.png',
  mugi: '/images/foto19.png',
  ari: '/images/foto20.png',
};

function buildTeamMembers(
  locale: Locale,
  messages: JsonObject
): InitialTeamMember[] {
  const team =
    objectValue(
      messages,
      'Team'
    );

  return Object.entries(team)
    .map(
      (
        [key, value],
        index
      ) => {
        if (
          !value ||
          typeof value !== 'object' ||
          Array.isArray(value)
        ) {
          return null;
        }

        const member =
          value as JsonObject;

        return {
          name:
            stringValue(
              member,
              'name'
            ),

          position:
            stringValue(
              member,
              'position'
            ),

          bio:
            stringValue(
              member,
              'description'
            ),

          photo_url:
            teamPhotoMap[key],

          linkedin_url:
            undefined,

          locale,

          sort_order:
            index,
        };
      }
    )
    .filter(
      (item) =>
        item !== null &&
        item.name.length > 0
    ) as InitialTeamMember[];
}

export const initialTeamMembers: InitialTeamMember[] = [
  ...buildTeamMembers(
    'id',
    idMessages
  ),

  ...buildTeamMembers(
    'en',
    enMessages
  ),
];

/**
 * =========================================================
 * CLIENTS
 * =========================================================
 */

const clientNumbers = [
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  30,
  31,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
];

function buildClients(
  locale: Locale
): InitialClient[] {
  return clientNumbers.map(
    (
      number,
      index
    ) => ({
      name:
        `Client ${number}`,

      industry:
        undefined,

      logo_url:
        `/images/client/image ${number}.png`,

      placement:
        'global',

      locale,

      sort_order:
        index,
    })
  );
}

export const initialClients: InitialClient[] = [
  ...buildClients('id'),
  ...buildClients('en'),
];

/**
 * =========================================================
 * ASP PRODUCTS
 * =========================================================
 */

type AspProductConfig = {
  key: string;
  name: string;
  descriptionKey: string;
  image: string;
  youtube?: string;
};

const aspProductConfigs: AspProductConfig[] = [
  {
    key:
      'primebiz',

    name:
      'PrimeBiz',

    descriptionKey:
      'primeDescription',

    image:
      '/images/products/image.png',

    youtube:
      'https://www.youtube.com/embed/RZunaYdRoEU',
  },

  {
    key:
      'primecafe',

    name:
      'PrimeCafe',

    descriptionKey:
      'primeCafeDescription',

    image:
      '/images/products/Image cafe.png',

    youtube:
      'https://www.youtube.com/embed/5_tTysgmcTo',
  },

  {
    key:
      'primeteams',

    name:
      'PrimeTeams',

    descriptionKey:
      'primeTeamsDescription',

    image:
      '/images/products/teams.png',
  },

  {
    key:
      'primecare',

    name:
      'PrimeCare',

    descriptionKey:
      'primeCareDescription',

    image:
      '/images/products/Image care.png',

    youtube:
      'https://www.youtube.com/embed/qja1nkN_S5U',
  },

  {
    key:
      'primejula',

    name:
      'Jula',

    descriptionKey:
      'primeJulaDescription',

    image:
      '/images/products/jula.png',

    youtube:
      'https://www.youtube.com/embed/1Dn7QDKUXoI',
  },

  {
    key:
      'primeresto',

    name:
      'PrimeResto',

    descriptionKey:
      'primeRestoDescription',

    image:
      '/images/products/Image Resto.png',
  },

  {
    key:
      'primeedu',

    name:
      'PrimeEdu',

    descriptionKey:
      'primeEduDescription',

    image:
      '/images/products/Image Edu.png',
  },

  {
    key:
      'primecourse',

    name:
      'PrimeCourse',

    descriptionKey:
      'primeCourseDescription',

    image:
      '/images/products/Image Edu.png',
  },

  {
    key:
      'petpuffy',

    name:
      'PetPuffy',

    descriptionKey:
      'petPuffyDescription',

    image:
      '/images/products/puffy.png',
  },
];

function buildAspProducts(
  locale: Locale,
  messages: JsonObject
): InitialProduct[] {
  const asp =
    objectValue(
      messages,
      'Asp'
    );

  return aspProductConfigs.map(
    (
      config,
      productIndex
    ) => {
      const productSection =
        objectValue(
          asp,
          config.key
        );

      const rawItems =
        productSection.items;

      const items =
        Array.isArray(
          rawItems
        )
          ? rawItems
          : [];

      const features:
        InitialProductFeature[] =
        items
          .map(
            (
              value,
              featureIndex
            ) => {
              if (
                !value ||
                typeof value !== 'object' ||
                Array.isArray(
                  value
                )
              ) {
                return null;
              }

              const feature =
                value as JsonObject;

              const title =
                stringValue(
                  feature,
                  'title'
                );

              if (!title) {
                return null;
              }

              return {
                title,

                description:
                  stringValue(
                    feature,
                    'description'
                  ),

                sort_order:
                  featureIndex,
              };
            }
          )
          .filter(
            (feature) =>
              feature !== null
          ) as InitialProductFeature[];

      return {
        name:
          config.name,

        slug:
          config.key,

        service:
          'asp',

        category:
          'application',

        locale,

        description:
          stringValue(
            asp,
            config.descriptionKey
          ),

        image_url:
          config.image,

        youtube_url:
          config.youtube,

        sort_order:
          productIndex,

        features,
      };
    }
  );
}

export const initialProducts: InitialProduct[] = [
  ...buildAspProducts(
    'id',
    idMessages
  ),

  ...buildAspProducts(
    'en',
    enMessages
  ),
];

/**
 * =========================================================
 * CMS MIGRATION VERSION 6
 * ISP IMAGE CONTENT
 * =========================================================
 */

export const initialIspContentV6 = {
  ISP: {
    hero_image: '/images/image 704.png',
    underline_image: '/images/underline.png',
    wave_image: '/images/wv.svg',

    connectivity_image: '/images/connectivity.png',

    managed_desktop_image:
      '/images/ISP Connectivity new.png',

    managed_mobile_image:
      '/images/mobile.png',

    managed_badges: [
      {
        index: 0,
        icon_url: '/images/Wi-Fi.png',
      },
      {
        index: 1,
        icon_url: '/images/monitor.png',
      },
      {
        index: 2,
        icon_url: '/images/GPS Signal.png',
      },
      {
        index: 3,
        icon_url: '/images/World Markets.png',
      },
    ],
  },
} as const;

/**
 * =========================================================
 * CMS MIGRATION VERSION 7
 * RESOURCE + TECHNOLOGIES
 * =========================================================
 */

export const initialResourceContentV7 = {
  Resource: {
    hero_desktop_image:
      '/images/RESOURCE NEW.png',

    hero_mobile_image:
      '/images/RESOURCE MOBILE.png',
  },
} as const;

const technologyConfigs = [
  {
    name: 'React',
    logo_url:
      '/images/powering/react.png',
  },
  {
    name: 'Node.js',
    logo_url:
      '/images/powering/node.png',
  },
  {
    name: 'Laravel',
    logo_url:
      '/images/powering/laravel.png',
  },
  {
    name: 'Android',
    logo_url:
      '/images/powering/android.png',
  },
  {
    name: 'Flutter',
    logo_url:
      '/images/powering/flutter.png',
  },
  {
    name: '.NET',
    logo_url:
      '/images/powering/net.png',
  },
  {
    name: 'Python',
    logo_url:
      '/images/powering/py.png',
  },
  {
    name: 'PostgreSQL',
    logo_url:
      '/images/powering/postgresql.png',
  },
  {
    name: 'Figma',
    logo_url:
      '/images/powering/figma.png',
  },
  {
    name: 'Selenium',
    logo_url:
      '/images/powering/selenium.png',
  },
  {
    name: 'MySQL',
    logo_url:
      '/images/powering/mysql.png',
  },
  {
    name: 'Jira',
    logo_url:
      '/images/powering/jira.png',
  },
] as const;

export const initialTechnologies =
  (
    ['id', 'en'] as const
  ).flatMap(
    (locale) =>
      technologyConfigs.map(
        (
          technology,
          index
        ) => ({
          name:
            technology.name,

          category:
            'development',

          logo_url:
            technology.logo_url,

          locale,

          sort_order:
            index,

          is_active:
            true,
        })
      )
  );

/**
 * =========================================================
 * GLOBAL SITE SETTINGS
 * =========================================================
 */

export const initialSettings = {
  company: {
    name:
      'PT Medianusa Permana',

    phone:
      '+62216332103',

    email:
      'mbusiness@permanasolutions.com',

    logo_url:
      '/images/icon-logo.png',

    navbar_logo_url:
      '/images/logo.png',

    footer_logo_url:
      '/images/icon-logo.png',

    footer_background_image:
      '/images/bgFooter.png',

    address:
      stringValue(
        objectValue(
          idMessages,
          'ContactHero'
        ),
        'address'
      ),
  },

  social_media: {
    linkedin:
      'https://www.linkedin.com/company/permananet/posts/?feedView=all',

    instagram:
      'https://www.instagram.com/permana.solutions?igsh=ajh6aDdtenNvaWM0',

    youtube:
      'https://youtube.com/@permanasolutions?si=MccDOTXlRunIMxiK',
  },

  navigation: {
    id:
      objectValue(
        idMessages,
        'Navbar'
      ),

    en:
      objectValue(
        enMessages,
        'Navbar'
      ),
  },

  footer: {
    id:
      objectValue(
        idMessages,
        'Footer'
      ),

    en:
      objectValue(
        enMessages,
        'Footer'
      ),
  },

  contact: {
    id:
      objectValue(
        idMessages,
        'ContactHero'
      ),

    en:
      objectValue(
        enMessages,
        'ContactHero'
      ),
  },
};

/**
 * =========================================================
 * CMS MIGRATION VERSION 9
 * ABOUT + CONTACT VISUAL CONTENT
 * =========================================================
 */

export const initialAboutContactContentV9 = {
  About: {
    hero: {
      desktop_image:
        '/images/cchero.png',

      mobile_image:
        '/images/herohp.png',

      decoration_image:
        '/images/Decore.png',
    },

    background_left_image:
      '/images/bgkiri2permana.png',

    background_shape_image:
      '/images/imageg.png',

    our_profile_ribbon_image:
      '/images/ourteks.png',

    company_logo_image:
      '/images/pErmana.png',

    vision_mission_ribbon_image:
      '/images/visimisits.png',
  },

  ContactHero: {
    desktop_image:
      '/images/heroContact.png',

    mobile_image:
      '/images/contactMobile.png',

    map_embed_url:
      'https://www.google.com/maps?q=Medianusa+Permana+Jakarta&output=embed',

    map_link:
      'https://maps.google.com/?q=Medianusa+Permana+Jakarta',
  },
} as const;

/**
 * =========================================================
 * CMS MIGRATION VERSION 11
 * FINAL GLOBAL + SERVICE CONTENT
 * =========================================================
 */

export const initialFinalContentV11 = {
  Service: {
    background_image:
      '/images/bg our service.png',
  },

  Company: {
    footer_tagline:
      'Automate, Boost Efficiency, Grow Faster',

    company_profile_id:
      '/Permana_Company_Profile_2026_Indonesia.pdf',

    company_profile_en:
      '/Permana_Company_Profile_2026_English.pdf',
  },
} as const;