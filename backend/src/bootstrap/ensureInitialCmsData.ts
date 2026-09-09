import { Prisma } from '@prisma/client';

import { prisma } from '../prisma.js';

import {
  initialCmsPages,
  initialTeamMembers,
  initialClients,
  initialProducts,
  initialSettings,
  initialHomeContentV3,
  initialHomeContentV4,
  initialSolutionsContentV5,
  initialIspContentV6,
  initialResourceContentV7,
  initialTechnologies,
  initialAboutContactContentV9,
  initialFinalContentV11,
} from './initialCmsData.js';

const CMS_INIT_KEY = 'cms_initialized';
const CMS_INIT_VERSION = 14;

type TransactionClient = Prisma.TransactionClient;

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function isJsonObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function getCmsVersion(
  value: unknown
): number {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return 0;
  }

  const version =
    (value as Record<string, unknown>).version;

  return typeof version === 'number'
    ? version
    : 0;
}

/**
 * =========================================================
 * VERSION 1
 * CMS PAGES + CMS SECTIONS
 * =========================================================
 */

async function createInitialCms(
  tx: TransactionClient
) {
  for (
    const pageData
    of initialCmsPages
  ) {
    const existingPage =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              pageData.slug,

            locale:
              pageData.locale,
          },
        },
      });

    let page =
      existingPage;

    /**
     * CREATE ONLY
     */
    if (!page) {
      page =
        await tx.cms_pages.create({
          data: {
            slug:
              pageData.slug,

            locale:
              pageData.locale,

            title:
              pageData.title,

            page_type:
              'page',

            status:
              'published',
          },
        });

      console.log(
        `CMS page created: ${pageData.slug}/${pageData.locale}`
      );
    }

    let sortOrder =
      0;

    for (
      const [
        sectionKey,
        content,
      ]
      of Object.entries(
        pageData.sections
      )
    ) {
      const existingSection =
        await tx.cms_sections.findUnique({
          where: {
            page_id_section_key_locale: {
              page_id:
                page.id,

              section_key:
                sectionKey,

              locale:
                pageData.locale,
            },
          },
        });

      if (
        existingSection
      ) {
        console.log(
          `CMS section exists, skip: ${pageData.slug}/${pageData.locale}/${sectionKey}`
        );

        sortOrder++;
        continue;
      }

      await tx.cms_sections.create({
        data: {
          page_id:
            page.id,

          section_key:
            sectionKey,

          locale:
            pageData.locale,

          title:
            sectionKey,

          content:
            content as Prisma.InputJsonValue,

          is_active:
            true,

          sort_order:
            sortOrder,
        },
      });

      console.log(
        `CMS section created: ${pageData.slug}/${pageData.locale}/${sectionKey}`
      );

      sortOrder++;
    }
  }
}

/**
 * =========================================================
 * VERSION 2
 * TEAM MEMBERS
 * =========================================================
 */

async function createInitialTeamMembers(
  tx: TransactionClient
) {
  const existingCount =
    await tx.team_members.count();

  if (
    existingCount > 0
  ) {
    console.log(
      `Team members already exist (${existingCount}), skip`
    );

    return;
  }

  for (
    const member
    of initialTeamMembers
  ) {
    await tx.team_members.create({
      data: {
        name:
          member.name,

        position:
          member.position ||
          null,

        bio:
          member.bio ||
          null,

        photo_url:
          member.photo_url ||
          null,

        linkedin_url:
          member.linkedin_url ||
          null,

        locale:
          member.locale,

        sort_order:
          member.sort_order,

        is_active:
          true,
      },
    });
  }

  console.log(
    `Initial team members imported: ${initialTeamMembers.length}`
  );
}

/**
 * =========================================================
 * VERSION 2
 * CLIENTS
 * =========================================================
 */

async function createInitialClients(
  tx: TransactionClient
) {
  const existingCount =
    await tx.clients.count();

  if (
    existingCount > 0
  ) {
    console.log(
      `Clients already exist (${existingCount}), skip`
    );

    return;
  }

  for (
    const client
    of initialClients
  ) {
    await tx.clients.create({
      data: {
        name:
          client.name,

        industry:
          client.industry ||
          null,

        logo_url:
          client.logo_url ||
          null,

        placement:
          client.placement ||
          null,

        locale:
          client.locale,

        sort_order:
          client.sort_order,

        is_active:
          true,
      },
    });
  }

  console.log(
    `Initial clients imported: ${initialClients.length}`
  );
}

/**
 * =========================================================
 * VERSION 2
 * PRODUCTS + PRODUCT FEATURES
 * =========================================================
 */

async function createInitialProducts(
  tx: TransactionClient
) {
  for (
    const product
    of initialProducts
  ) {
    const existingProduct =
      await tx.products.findUnique({
        where: {
          slug_locale: {
            slug:
              product.slug,

            locale:
              product.locale,
          },
        },
      });

    if (
      existingProduct
    ) {
      console.log(
        `Product exists, skip: ${product.slug}/${product.locale}`
      );

      continue;
    }

    const createdProduct =
      await tx.products.create({
        data: {
          name:
            product.name,

          slug:
            product.slug,

          service:
            product.service,

          category:
            product.category ||
            null,

          locale:
            product.locale,

          description:
            product.description ||
            null,

          image_url:
            product.image_url ||
            null,

          meta:
            product.youtube_url
              ? ({
                  youtube_url:
                    product.youtube_url,
                } as Prisma.InputJsonValue)
              : undefined,

          sort_order:
            product.sort_order,

          is_active:
            true,
        },
      });

    for (
      const feature
      of product.features
    ) {
      await tx.product_features.create({
        data: {
          product_id:
            createdProduct.id,

          title:
            feature.title,

          description:
            feature.description ||
            null,

          sort_order:
            feature.sort_order,

          is_active:
            true,
        },
      });
    }

    console.log(
      `Product created: ${product.slug}/${product.locale}`
    );
  }
}

/**
 * =========================================================
 * VERSION 2
 * GLOBAL SETTINGS
 * =========================================================
 */

async function createInitialSettings(
  tx: TransactionClient
) {
  for (
    const [
      settingKey,
      value,
    ]
    of Object.entries(
      initialSettings
    )
  ) {
    const existing =
      await tx.site_settings.findUnique({
        where: {
          setting_key:
            settingKey,
        },
      });

    if (
      existing
    ) {
      console.log(
        `Setting exists, skip: ${settingKey}`
      );

      continue;
    }

    await tx.site_settings.create({
      data: {
        setting_key:
          settingKey,

        value:
          value as Prisma.InputJsonValue,
      },
    });

    console.log(
      `Setting created: ${settingKey}`
    );
  }
}

/**
 * =========================================================
 * VERSION 3
 * HOME IMAGE + LINK CONTENT
 * =========================================================
 */

async function migrateHomeContentV3(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  for (
    const locale
    of locales
  ) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'home',

            locale,
          },
        },
      });

    if (
      !page
    ) {
      console.log(
        `CMS v3 home page not found: ${locale}, skip`
      );

      continue;
    }

    /**
     * SMART SYSTEM
     */
    const smartSystemSection =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'SmartSystem',

            locale,
          },
        },
      });

    if (
      smartSystemSection
    ) {
      const currentContent =
        isJsonObject(
          smartSystemSection.content
        )
          ? {
              ...smartSystemSection.content,
            }
          : {};

      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          'dashboard_image'
        )
      ) {
        currentContent.dashboard_image =
          initialHomeContentV3
            .SmartSystem
            .dashboard_image;
      }

      const rawSystems =
        currentContent.systems;

      if (
        Array.isArray(
          rawSystems
        )
      ) {
        currentContent.systems =
          rawSystems.map(
            (
              rawSystem,
              index
            ) => {
              if (
                !isJsonObject(
                  rawSystem
                )
              ) {
                return rawSystem;
              }

              const system = {
                ...rawSystem,
              };

              if (
                Object.prototype.hasOwnProperty.call(
                  system,
                  'image_url'
                )
              ) {
                return system;
              }

              const systemName =
                typeof system.name ===
                  'string'
                  ? system.name.trim()
                  : '';

              const matchedImage =
                initialHomeContentV3
                  .SmartSystem
                  .system_images
                  .find(
                    (item) =>
                      item.name.toLowerCase() ===
                      systemName.toLowerCase()
                  );

              const fallbackImage =
                initialHomeContentV3
                  .SmartSystem
                  .system_images[
                    index
                  ];

              const image =
                matchedImage ??
                fallbackImage;

              if (
                !image
              ) {
                return system;
              }

              return {
                ...system,

                image_url:
                  image.image_url,
              };
            }
          );
      }

      await tx.cms_sections.update({
        where: {
          id:
            smartSystemSection.id,
        },

        data: {
          content:
            currentContent as Prisma.InputJsonValue,
        },
      });

      console.log(
        `CMS v3 updated: home/${locale}/SmartSystem`
      );
    }

    /**
     * SERVICE
     */
    const serviceSection =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'Service',

            locale,
          },
        },
      });

    if (
      serviceSection
    ) {
      const currentContent =
        isJsonObject(
          serviceSection.content
        )
          ? {
              ...serviceSection.content,
            }
          : {};

      for (
        const [
          key,
          value,
        ]
        of Object.entries(
          initialHomeContentV3.Service
        )
      ) {
        if (
          !Object.prototype.hasOwnProperty.call(
            currentContent,
            key
          )
        ) {
          currentContent[key] =
            value;
        }
      }

      await tx.cms_sections.update({
        where: {
          id:
            serviceSection.id,
        },

        data: {
          content:
            currentContent as Prisma.InputJsonValue,
        },
      });

      console.log(
        `CMS v3 updated: home/${locale}/Service`
      );
    }
  }
}

/**
 * =========================================================
 * VERSION 4
 * HOME WHO WE ARE SECONDARY IMAGE
 * =========================================================
 */

async function migrateHomeContentV4(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  for (
    const locale
    of locales
  ) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'home',

            locale,
          },
        },
      });

    if (
      !page
    ) {
      console.log(
        `CMS v4 home page not found: ${locale}, skip`
      );

      continue;
    }

    const whoWeAreSection =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'WhoWeAre',

            locale,
          },
        },
      });

    if (
      !whoWeAreSection
    ) {
      console.log(
        `CMS v4 section not found: home/${locale}/WhoWeAre`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        whoWeAreSection.content
      )
        ? {
            ...whoWeAreSection.content,
          }
        : {};

    if (
      !Object.prototype.hasOwnProperty.call(
        currentContent,
        'secondary_image_url'
      )
    ) {
      currentContent.secondary_image_url =
        initialHomeContentV4
          .WhoWeAre
          .secondary_image_url;
    }

    await tx.cms_sections.update({
      where: {
        id:
          whoWeAreSection.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v4 updated: home/${locale}/WhoWeAre`
    );
  }
}

/**
 * =========================================================
 * VERSION 5
 * SOLUTIONS IMAGE + LINK CONTENT
 * =========================================================
 */

async function migrateSolutionsContentV5(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  for (
    const locale
    of locales
  ) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'solutions',

            locale,
          },
        },
      });

    if (
      !page
    ) {
      console.log(
        `CMS v5 solutions page not found: ${locale}, skip`
      );

      continue;
    }

    /**
     * SOLUTIONS HERO
     */
    const solutionsSection =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'Solutions',

            locale,
          },
        },
      });

    if (
      solutionsSection
    ) {
      const currentContent =
        isJsonObject(
          solutionsSection.content
        )
          ? {
              ...solutionsSection.content,
            }
          : {};

      const rawHero =
        currentContent.hero;

      const hero =
        isJsonObject(
          rawHero
        )
          ? {
              ...rawHero,
            }
          : {};

      for (
        const [
          key,
          value,
        ]
        of Object.entries(
          initialSolutionsContentV5
            .Solutions
            .hero
        )
      ) {
        if (
          !Object.prototype.hasOwnProperty.call(
            hero,
            key
          )
        ) {
          hero[key] =
            value;
        }
      }

      currentContent.hero =
        hero;

      await tx.cms_sections.update({
        where: {
          id:
            solutionsSection.id,
        },

        data: {
          content:
            currentContent as Prisma.InputJsonValue,
        },
      });

      console.log(
        `CMS v5 updated: solutions/${locale}/Solutions`
      );
    } else {
      console.log(
        `CMS v5 section not found: solutions/${locale}/Solutions`
      );
    }

    /**
     * WHY CHOOSE
     */
    const whyChooseSection =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'WhyChoose',

            locale,
          },
        },
      });

    if (
      whyChooseSection
    ) {
      const currentContent =
        isJsonObject(
          whyChooseSection.content
        )
          ? {
              ...whyChooseSection.content,
            }
          : {};

      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          'image_url'
        )
      ) {
        currentContent.image_url =
          initialSolutionsContentV5
            .WhyChoose
            .image_url;
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          'line_image'
        )
      ) {
        currentContent.line_image =
          initialSolutionsContentV5
            .WhyChoose
            .line_image;
      }

      const rawItems =
        currentContent.items;

      if (
        Array.isArray(
          rawItems
        )
      ) {
        currentContent.items =
          rawItems.map(
            (
              rawItem,
              index
            ) => {
              if (
                !isJsonObject(
                  rawItem
                )
              ) {
                return rawItem;
              }

              const item = {
                ...rawItem,
              };

              if (
                Object.prototype.hasOwnProperty.call(
                  item,
                  'icon_url'
                )
              ) {
                return item;
              }

              const iconConfig =
                initialSolutionsContentV5
                  .WhyChoose
                  .item_icons
                  .find(
                    (icon) =>
                      icon.index ===
                      index
                  );

              if (
                !iconConfig
              ) {
                return item;
              }

              return {
                ...item,

                icon_url:
                  iconConfig.icon_url,
              };
            }
          );
      }

      await tx.cms_sections.update({
        where: {
          id:
            whyChooseSection.id,
        },

        data: {
          content:
            currentContent as Prisma.InputJsonValue,
        },
      });

      console.log(
        `CMS v5 updated: solutions/${locale}/WhyChoose`
      );
    } else {
      console.log(
        `CMS v5 section not found: solutions/${locale}/WhyChoose`
      );
    }

    /**
     * SOLUTIONS INDUSTRY
     */
    const industrySection =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'SolutionsIndustry',

            locale,
          },
        },
      });

    if (
      industrySection
    ) {
      const currentContent =
        isJsonObject(
          industrySection.content
        )
          ? {
              ...industrySection.content,
            }
          : {};

      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          'image_id'
        )
      ) {
        currentContent.image_id =
          initialSolutionsContentV5
            .SolutionsIndustry
            .image_id;
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          'image_en'
        )
      ) {
        currentContent.image_en =
          initialSolutionsContentV5
            .SolutionsIndustry
            .image_en;
      }

      await tx.cms_sections.update({
        where: {
          id:
            industrySection.id,
        },

        data: {
          content:
            currentContent as Prisma.InputJsonValue,
        },
      });

      console.log(
        `CMS v5 updated: solutions/${locale}/SolutionsIndustry`
      );
    } else {
      console.log(
        `CMS v5 section not found: solutions/${locale}/SolutionsIndustry`
      );
    }
  }
}

/**
 * =========================================================
 * VERSION 6
 * ISP IMAGE CONTENT
 * =========================================================
 */

async function migrateIspContentV6(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  for (
    const locale
    of locales
  ) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'isp',

            locale,
          },
        },
      });

    if (
      !page
    ) {
      console.log(
        `CMS v6 ISP page not found: ${locale}, skip`
      );

      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'ISP',

            locale,
          },
        },
      });

    if (
      !section
    ) {
      console.log(
        `CMS v6 section not found: isp/${locale}/ISP`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    const config =
      initialIspContentV6.ISP;

    const imageFields = [
      'hero_image',
      'underline_image',
      'wave_image',
      'connectivity_image',
      'managed_desktop_image',
      'managed_mobile_image',
    ] as const;

    for (
      const key
      of imageFields
    ) {
      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          key
        )
      ) {
        currentContent[key] =
          config[key];
      }
    }

    const managed =
      isJsonObject(
        currentContent.managed
      )
        ? {
            ...currentContent.managed,
          }
        : {};

    const badgeKeys = [
      'badge1',
      'badge2',
      'badge3',
      'badge4',
    ] as const;

    badgeKeys.forEach(
      (
        badgeKey,
        index
      ) => {
        const badge =
          isJsonObject(
            managed[
              badgeKey
            ]
          )
            ? {
                ...managed[
                  badgeKey
                ],
              }
            : {};

        if (
          !Object.prototype.hasOwnProperty.call(
            badge,
            'icon_url'
          )
        ) {
          const iconConfig =
            config.managed_badges[
              index
            ];

          if (
            iconConfig
          ) {
            badge.icon_url =
              iconConfig.icon_url;
          }
        }

        managed[
          badgeKey
        ] =
          badge;
      }
    );

    currentContent.managed =
      managed;

    await tx.cms_sections.update({
      where: {
        id:
          section.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v6 updated: isp/${locale}/ISP`
    );
  }
}

/**
 * =========================================================
 * VERSION 7
 * RESOURCE + TECHNOLOGIES
 * =========================================================
 */

async function migrateResourceContentV7(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  /**
   * RESOURCE CMS CONTENT
   */
  for (
    const locale
    of locales
  ) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'resource',

            locale,
          },
        },
      });

    if (
      !page
    ) {
      console.log(
        `CMS v7 resource page not found: ${locale}, skip`
      );

      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'Resource',

            locale,
          },
        },
      });

    if (
      !section
    ) {
      console.log(
        `CMS v7 section not found: resource/${locale}/Resource`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    for (
      const [
        key,
        value,
      ]
      of Object.entries(
        initialResourceContentV7.Resource
      )
    ) {
      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          key
        )
      ) {
        currentContent[key] =
          value;
      }
    }

    await tx.cms_sections.update({
      where: {
        id:
          section.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v7 updated: resource/${locale}/Resource`
    );
  }

  /**
   * TECHNOLOGIES MASTER
   */
  for (
    const technology
    of initialTechnologies
  ) {
    const existing =
      await tx.technologies.findFirst({
        where: {
          name:
            technology.name,

          locale:
            technology.locale,
        },
      });

    if (
      existing
    ) {
      console.log(
        `Technology exists, skip: ${technology.name}/${technology.locale}`
      );

      continue;
    }

    await tx.technologies.create({
      data: {
        name:
          technology.name,

        category:
          technology.category,

        logo_url:
          technology.logo_url,

        locale:
          technology.locale,

        sort_order:
          technology.sort_order,

        is_active:
          technology.is_active,
      },
    });

    console.log(
      `Technology created: ${technology.name}/${technology.locale}`
    );
  }
}

/**
 * =========================================================
 * VERSION 8
 * REPAIR RESOURCE + TECHNOLOGIES
 * =========================================================
 */
async function migrateResourceContentV8(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  /**
   * RESOURCE CMS CONTENT
   */
  for (
    const locale
    of locales
  ) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'resource',

            locale,
          },
        },
      });

    if (
      !page
    ) {
      console.log(
        `CMS v8 resource page not found: ${locale}, skip`
      );

      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'Resource',

            locale,
          },
        },
      });

    if (
      !section
    ) {
      console.log(
        `CMS v8 section not found: resource/${locale}/Resource`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    for (
      const [
        key,
        value,
      ]
      of Object.entries(
        initialResourceContentV7.Resource
      )
    ) {
      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          key
        )
      ) {
        currentContent[key] =
          value;
      }
    }

    await tx.cms_sections.update({
      where: {
        id:
          section.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v8 updated: resource/${locale}/Resource`
    );
  }

  /**
   * TECHNOLOGIES
   */
  for (
    const technology
    of initialTechnologies
  ) {
    const existing =
      await tx.technologies.findFirst({
        where: {
          name:
            technology.name,

          locale:
            technology.locale,
        },
      });

    if (
      existing
    ) {
      console.log(
        `Technology exists, skip: ${technology.name}/${technology.locale}`
      );

      continue;
    }

    await tx.technologies.create({
      data: {
        name:
          technology.name,

        category:
          technology.category,

        logo_url:
          technology.logo_url,

        locale:
          technology.locale,

        sort_order:
          technology.sort_order,

        is_active:
          technology.is_active,
      },
    });

    console.log(
      `Technology created: ${technology.name}/${technology.locale}`
    );
  }
}

/**
 * =========================================================
 * VERSION 9
 * ABOUT + CONTACT VISUAL CONTENT
 * =========================================================
 */

async function migrateAboutContactContentV9(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  /**
   * =====================================================
   * ABOUT
   * =====================================================
   */

  for (const locale of locales) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug: 'about',
            locale,
          },
        },
      });

    if (!page) {
      console.log(
        `CMS v9 about page not found: ${locale}, skip`
      );

      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'About',

            locale,
          },
        },
      });

    if (!section) {
      console.log(
        `CMS v9 section not found: about/${locale}/About`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    const config =
      initialAboutContactContentV9.About;

    /**
     * HERO
     */
    const hero =
      isJsonObject(
        currentContent.hero
      )
        ? {
            ...currentContent.hero,
          }
        : {};

    for (
      const [key, value]
      of Object.entries(
        config.hero
      )
    ) {
      if (
        !Object.prototype
          .hasOwnProperty.call(
            hero,
            key
          )
      ) {
        hero[key] =
          value;
      }
    }

    currentContent.hero =
      hero;

    /**
     * OTHER IMAGES
     */
    const imageFields = [
      'background_left_image',
      'background_shape_image',
      'our_profile_ribbon_image',
      'company_logo_image',
      'vision_mission_ribbon_image',
    ] as const;

    for (
      const key
      of imageFields
    ) {
      if (
        !Object.prototype
          .hasOwnProperty.call(
            currentContent,
            key
          )
      ) {
        currentContent[key] =
          config[key];
      }
    }

    await tx.cms_sections.update({
      where: {
        id:
          section.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v9 updated: about/${locale}/About`
    );
  }

  /**
   * =====================================================
   * CONTACT
   * =====================================================
   */

  for (const locale of locales) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug: 'contact',
            locale,
          },
        },
      });

    if (!page) {
      console.log(
        `CMS v9 contact page not found: ${locale}, skip`
      );

      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'ContactHero',

            locale,
          },
        },
      });

    if (!section) {
      console.log(
        `CMS v9 section not found: contact/${locale}/ContactHero`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    for (
      const [key, value]
      of Object.entries(
        initialAboutContactContentV9.ContactHero
      )
    ) {
      if (
        !Object.prototype
          .hasOwnProperty.call(
            currentContent,
            key
          )
      ) {
        currentContent[key] =
          value;
      }
    }

    await tx.cms_sections.update({
      where: {
        id:
          section.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v9 updated: contact/${locale}/ContactHero`
    );
  }
}

async function migrateGlobalLogosV10(
  tx: TransactionClient
) {
  const setting =
    await tx.site_settings.findUnique({
      where: {
        setting_key:
          'company',
      },
    });

  if (!setting) {
    console.log(
      'CMS v10 company setting not found, skip'
    );

    return;
  }

  const currentValue =
    isJsonObject(
      setting.value
    )
      ? {
          ...setting.value,
        }
      : {};

  if (
    !Object.prototype.hasOwnProperty.call(
      currentValue,
      'navbar_logo_url'
    )
  ) {
    currentValue.navbar_logo_url =
      '/images/logo.png';
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      currentValue,
      'footer_logo_url'
    )
  ) {
    currentValue.footer_logo_url =
      '/images/icon-logo.png';
  }

  await tx.site_settings.update({
    where: {
      setting_key:
        'company',
    },

    data: {
      value:
        currentValue as Prisma.InputJsonValue,
    },
  });

  console.log(
    'CMS v10 updated: company logos'
  );
}

/**
 * =========================================================
 * VERSION 11
 * FINAL SERVICE + GLOBAL CONTENT
 * =========================================================
 */
async function migrateFinalContentV11(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  /**
   * =====================================================
   * SERVICE LANDING BACKGROUND
   *
   * /service memakai section Service milik page home.
   * =====================================================
   */
  for (const locale of locales) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug: 'home',
            locale,
          },
        },
      });

    if (!page) {
      console.log(
        `CMS v11 home page not found: ${locale}, skip`
      );

      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'Service',

            locale,
          },
        },
      });

    if (!section) {
      console.log(
        `CMS v11 section not found: home/${locale}/Service`
      );

      continue;
    }

    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    if (
      !Object.prototype.hasOwnProperty.call(
        currentContent,
        'background_image'
      )
    ) {
      currentContent.background_image =
        initialFinalContentV11
          .Service
          .background_image;
    }

    await tx.cms_sections.update({
      where: {
        id:
          section.id,
      },

      data: {
        content:
          currentContent as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v11 updated: home/${locale}/Service`
    );
  }

  /**
   * =====================================================
   * COMPANY GLOBAL SETTINGS
   * =====================================================
   */
  const companySetting =
    await tx.site_settings.findUnique({
      where: {
        setting_key:
          'company',
      },
    });

  if (!companySetting) {
    console.log(
      'CMS v11 company setting not found, skip'
    );

    return;
  }

  const currentCompany =
    isJsonObject(
      companySetting.value
    )
      ? {
          ...companySetting.value,
        }
      : {};

  for (
    const [key, value]
    of Object.entries(
      initialFinalContentV11.Company
    )
  ) {
    if (
      !Object.prototype.hasOwnProperty.call(
        currentCompany,
        key
      )
    ) {
      currentCompany[key] =
        value;
    }
  }

  await tx.site_settings.update({
    where: {
      setting_key:
        'company',
    },

    data: {
      value:
        currentCompany as Prisma.InputJsonValue,
    },
  });

  console.log(
    'CMS v11 updated: company global content'
  );
}

/**
 * =========================================================
 * VERSION 12
 * REPAIR MASTER DATA
 *
 * Tujuan:
 * - aman jika database sudah memiliki data manual
 * - tidak menghapus data manual
 * - tidak overwrite data existing
 * - hanya menambahkan initial data yang benar-benar belum ada
 * =========================================================
 */
async function migrateMasterDataV12(
  tx: TransactionClient
) {
  /**
   * =====================================================
   * TEAM
   * =====================================================
   */
  for (
    const member
    of initialTeamMembers
  ) {
    const existing =
      await tx.team_members.findFirst({
        where: {
          locale:
            member.locale,

          OR: [
            {
              name:
                member.name,
            },

            ...(member.photo_url
              ? [
                  {
                    photo_url:
                      member.photo_url,
                  },
                ]
              : []),
          ],
        },
      });

    if (existing) {
      console.log(
        `CMS v12 team exists, skip: ${member.name}/${member.locale}`
      );

      continue;
    }

    await tx.team_members.create({
      data: {
        name:
          member.name,

        position:
          member.position ||
          null,

        bio:
          member.bio ||
          null,

        photo_url:
          member.photo_url ||
          null,

        linkedin_url:
          member.linkedin_url ||
          null,

        locale:
          member.locale,

        sort_order:
          member.sort_order,

        is_active:
          true,
      },
    });

    console.log(
      `CMS v12 team created: ${member.name}/${member.locale}`
    );
  }

  /**
   * =====================================================
   * CLIENTS
   * =====================================================
   */
  for (
    const client
    of initialClients
  ) {
    const existing =
      await tx.clients.findFirst({
        where: {
          locale:
            client.locale,

          OR: [
            {
              name:
                client.name,
            },

            ...(client.logo_url
              ? [
                  {
                    logo_url:
                      client.logo_url,
                  },
                ]
              : []),
          ],
        },
      });

    if (existing) {
      console.log(
        `CMS v12 client exists, skip: ${client.name}/${client.locale}`
      );

      continue;
    }

    await tx.clients.create({
      data: {
        name:
          client.name,

        industry:
          client.industry ||
          null,

        logo_url:
          client.logo_url ||
          null,

        placement:
          client.placement ||
          null,

        locale:
          client.locale,

        sort_order:
          client.sort_order,

        is_active:
          true,
      },
    });

    console.log(
      `CMS v12 client created: ${client.name}/${client.locale}`
    );
  }

  console.log(
    'CMS v12 master data repair completed'
  );
}

/**
 * =========================================================
 * VERSION 13
 * ASP MEDIA + HERO REPAIR
 *
 * Tujuan:
 *
 * 1. Memastikan hero_image halaman ASP tersedia.
 *
 * 2. Tidak menimpa hero_image jika admin
 *    sudah pernah mengatur field tersebut.
 *
 * 3. Menambahkan media_type ke Product ASP.
 *
 * 4. Product lama yang mempunyai youtube_url
 *    otomatis menggunakan media YouTube.
 *
 * 5. Product tanpa YouTube otomatis menggunakan gambar.
 *
 * 6. image_url dan youtube_url lama tetap dipertahankan.
 * =========================================================
 */
async function migrateAspMediaV13(
  tx: TransactionClient
) {
  const locales = [
    'id',
    'en',
  ] as const;

  /**
   * =====================================================
   * ASP HERO IMAGE
   * =====================================================
   */
  for (
    const locale
    of locales
  ) {
    /**
     * Cari page ASP.
     */
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug:
              'asp',

            locale,
          },
        },
      });

    if (!page) {
      console.log(
        `CMS v13 ASP page not found: ${locale}, skip`
      );

      continue;
    }

    /**
     * Cari section Asp.
     */
    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id:
              page.id,

            section_key:
              'Asp',

            locale,
          },
        },
      });

    if (!section) {
      console.log(
        `CMS v13 ASP section not found: ${locale}, skip`
      );

      continue;
    }

    /**
     * Clone content lama.
     */
    const currentContent =
      isJsonObject(
        section.content
      )
        ? {
            ...section.content,
          }
        : {};

    /**
     * =================================================
     * PENTING
     * =================================================
     *
     * Hanya tambahkan default ketika property
     * hero_image benar-benar BELUM ADA.
     *
     * Kalau admin sebelumnya sengaja mengubahnya,
     * migration tidak akan overwrite.
     */
    if (
      !Object.prototype.hasOwnProperty.call(
        currentContent,
        'hero_image'
      )
    ) {
      currentContent.hero_image =
        '/images/image 44.png';

      await tx.cms_sections.update({
        where: {
          id:
            section.id,
        },

        data: {
          content:
            currentContent as Prisma.InputJsonValue,
        },
      });

      console.log(
        `CMS v13 ASP hero added: ${locale}`
      );
    } else {
      console.log(
        `CMS v13 ASP hero exists, skip: ${locale}`
      );
    }
  }

  /**
   * =====================================================
   * ASP PRODUCT MEDIA
   * =====================================================
   */
  const products =
    await tx.products.findMany({
      where: {
        service:
          'asp',
      },

      orderBy: [
        {
          locale:
            'asc',
        },

        {
          sort_order:
            'asc',
        },
      ],
    });

  for (
    const product
    of products
  ) {
    /**
     * Clone meta existing.
     */
    const currentMeta =
      isJsonObject(
        product.meta
      )
        ? {
            ...product.meta,
          }
        : {};

    /**
     * Kalau media_type sudah valid,
     * berarti admin/data sebelumnya
     * sudah menentukan sumber media.
     *
     * Tidak perlu disentuh.
     */
    if (
      currentMeta.media_type ===
        'image' ||
      currentMeta.media_type ===
        'youtube'
    ) {
      console.log(
        `CMS v13 ASP media exists, skip: ${product.slug}/${product.locale}`
      );

      continue;
    }

    /**
     * Ambil YouTube URL lama.
     */
    const youtubeUrl =
      typeof currentMeta.youtube_url ===
        'string'
        ? currentMeta.youtube_url.trim()
        : '';

    /**
     * =================================================
     * DETECT MEDIA
     * =================================================
     *
     * Product lama:
     *
     * punya youtube_url
     * → youtube
     *
     * tidak punya youtube_url
     * → image
     */
    currentMeta.media_type =
      youtubeUrl
        ? 'youtube'
        : 'image';

    /**
     * Jangan hapus:
     *
     * currentMeta.youtube_url
     *
     * supaya URL lama tetap tersimpan.
     *
     * image_url juga tidak disentuh karena
     * berada langsung di products.image_url.
     */
    await tx.products.update({
      where: {
        id:
          product.id,
      },

      data: {
        meta:
          currentMeta as Prisma.InputJsonValue,
      },
    });

    console.log(
      `CMS v13 ASP media updated: ${product.slug}/${product.locale} -> ${currentMeta.media_type}`
    );
  }

  console.log(
    'CMS v13 ASP media repair completed'
  );
}

async function migrateAboutContentV14(
  tx: TransactionClient
) {
  const locales = [
    "id",
    "en",
  ] as const;

  for (const locale of locales) {
    const page =
      await tx.cms_pages.findUnique({
        where: {
          slug_locale: {
            slug: "about",
            locale,
          },
        },
      });

    if (!page) {
      continue;
    }

    const section =
      await tx.cms_sections.findUnique({
        where: {
          page_id_section_key_locale: {
            page_id: page.id,
            section_key: "About",
            locale,
          },
        },
      });

    if (!section) {
      continue;
    }

    const currentContent =
      isJsonObject(section.content)
        ? {
            ...section.content,
          }
        : {};

    const defaults =
      initialAboutContactContentV9.About;

    const imageFields = [
      "background_left_image",
      "background_shape_image",
      "our_profile_ribbon_image",
      "company_logo_image",
      "vision_mission_ribbon_image",
    ] as const;

    for (const key of imageFields) {
      if (
        !Object.prototype.hasOwnProperty.call(
          currentContent,
          key
        )
      ) {
        currentContent[key] =
          defaults[key];
      }
    }

    const currentHero =
      isJsonObject(
        currentContent.hero
      )
        ? {
            ...currentContent.hero,
          }
        : {};

    for (
      const [
        key,
        value,
      ] of Object.entries(
        defaults.hero
      )
    ) {
      if (
        !Object.prototype.hasOwnProperty.call(
          currentHero,
          key
        )
      ) {
        currentHero[key] =
          value;
      }
    }

    currentContent.hero =
      currentHero;

    await tx.cms_sections.update({
      where: {
        id: section.id,
      },

      data: {
        content:
          currentContent as
            Prisma.InputJsonValue,
      },
    });
  }
}

/**
 * =========================================================
 * MAIN INITIALIZER / MIGRATION
 * =========================================================
 */
export async function ensureInitialCmsData() {
  /**
   * =====================================================
   * GET CURRENT VERSION
   * =====================================================
   */
  const marker =
    await prisma.site_settings.findUnique({
      where: {
        setting_key:
          CMS_INIT_KEY,
      },
    });

  const currentVersion =
    getCmsVersion(
      marker?.value
    );

  /**
   * =====================================================
   * ALREADY UP TO DATE
   * =====================================================
   */
  if (
    currentVersion >=
    CMS_INIT_VERSION
  ) {
    console.log(
      `CMS already initialized v${currentVersion}, skip bootstrap`
    );

    return;
  }

  console.log(
    `CMS migration starting: v${currentVersion} -> v${CMS_INIT_VERSION}`
  );

  try {
    /**
     * ===================================================
     * TRANSACTION
     * ===================================================
     *
     * Timeout dibuat 10 menit karena initial data
     * cukup besar.
     */
    await prisma.$transaction(
      async (tx) => {
        /**
         * ===============================================
         * VERSION 1
         * CMS PAGES + CMS SECTIONS
         * ===============================================
         */
        if (
          currentVersion <
          1
        ) {
          console.log(
            'Running CMS migration v1...'
          );

          await createInitialCms(
            tx
          );

          console.log(
            'CMS migration v1 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 2
         * MASTER INITIAL DATA
         * ===============================================
         */
        if (
          currentVersion <
          2
        ) {
          console.log(
            'Running CMS migration v2...'
          );

          await createInitialTeamMembers(
            tx
          );

          await createInitialClients(
            tx
          );

          await createInitialProducts(
            tx
          );

          await createInitialSettings(
            tx
          );

          console.log(
            'CMS migration v2 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 3
         * ===============================================
         */
        if (
          currentVersion <
          3
        ) {
          console.log(
            'Running CMS migration v3...'
          );

          await migrateHomeContentV3(
            tx
          );

          console.log(
            'CMS migration v3 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 4
         * ===============================================
         */
        if (
          currentVersion <
          4
        ) {
          console.log(
            'Running CMS migration v4...'
          );

          await migrateHomeContentV4(
            tx
          );

          console.log(
            'CMS migration v4 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 5
         * ===============================================
         */
        if (
          currentVersion <
          5
        ) {
          console.log(
            'Running CMS migration v5...'
          );

          await migrateSolutionsContentV5(
            tx
          );

          console.log(
            'CMS migration v5 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 6
         * ===============================================
         */
        if (
          currentVersion <
          6
        ) {
          console.log(
            'Running CMS migration v6...'
          );

          await migrateIspContentV6(
            tx
          );

          console.log(
            'CMS migration v6 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 7
         * ===============================================
         */
        if (
          currentVersion <
          7
        ) {
          console.log(
            'Running CMS migration v7...'
          );

          await migrateResourceContentV7(
            tx
          );

          console.log(
            'CMS migration v7 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 8
         * ===============================================
         */
        if (
          currentVersion <
          8
        ) {
          console.log(
            'Running CMS migration v8...'
          );

          await migrateResourceContentV8(
            tx
          );

          console.log(
            'CMS migration v8 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 9
         * ===============================================
         */
        if (
          currentVersion <
          9
        ) {
          console.log(
            'Running CMS migration v9...'
          );

          await migrateAboutContactContentV9(
            tx
          );

          console.log(
            'CMS migration v9 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 10
         * ===============================================
         */
        if (
          currentVersion <
          10
        ) {
          console.log(
            'Running CMS migration v10...'
          );

          await migrateGlobalLogosV10(
            tx
          );

          console.log(
            'CMS migration v10 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 11
         * ===============================================
         */
        if (
          currentVersion <
          11
        ) {
          console.log(
            'Running CMS migration v11...'
          );

          await migrateFinalContentV11(
            tx
          );

          console.log(
            'CMS migration v11 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 12
         * ===============================================
         */
        if (
          currentVersion <
          12
        ) {
          console.log(
            'Running CMS migration v12...'
          );

          await migrateMasterDataV12(
            tx
          );

          console.log(
            'CMS migration v12 completed'
          );
        }

        /**
         * ===============================================
         * VERSION 13
         * ASP HERO + PRODUCT MEDIA
         * ===============================================
         */
        if (
          currentVersion <
          13
        ) {
          console.log(
            'Running CMS migration v13...'
          );

          await migrateAspMediaV13(
            tx
          );

          console.log(
            'CMS migration v13 completed'
          );
        }

        if (currentVersion < 14) {
          console.log(
            "Running CMS migration v14..."
          );

          await migrateAboutContentV14(
            tx
          );

          console.log(
            "CMS migration v14 completed"
          );
        }

        /**
         * ===============================================
         * UPDATE MIGRATION MARKER
         * ===============================================
         */
        await tx.site_settings.upsert({
          where: {
            setting_key:
              CMS_INIT_KEY,
          },

          create: {
            setting_key:
              CMS_INIT_KEY,

            value: {
              initialized:
                true,

              version:
                CMS_INIT_VERSION,

              initialized_at:
                new Date()
                  .toISOString(),
            },
          },

          update: {
            value: {
              initialized:
                true,

              version:
                CMS_INIT_VERSION,

              updated_at:
                new Date()
                  .toISOString(),
            },
          },
        });
      },

      /**
       * 10 menit.
       *
       * Ini mencegah error P2028 yang sebelumnya
       * terjadi pada migration besar.
       */
      {
        timeout:
          600000,
      }
    );

    console.log(
      `CMS migration completed successfully. Current version: v${CMS_INIT_VERSION}`
    );
  } catch (
    error
  ) {
    console.error(
      'CMS migration failed:',
      error
    );

    throw error;
  }
}