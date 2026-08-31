import type {
  ComponentProps,
} from "react";

import HeroSection from "@/app/components/solusi/HeroSection";
import BestSolutionsSection from "@/app/components/solusi/BestSolutionsSection";
import WhyChoose from "@/app/components/solusi/WhyChoose";
import IndustrySection from "@/app/components/solusi/IndustrySection";

import {
  getCmsPage,
} from "@/app/services/cms";

/**
 * Ambil tipe content langsung dari
 * props masing-masing component.
 *
 * Jadi tidak perlu export ulang
 * HeroContent, WhyChooseContent, dll.
 */
type HeroSectionContent =
  ComponentProps<
    typeof HeroSection
  >["content"];

type BestSolutionsContent =
  ComponentProps<
    typeof BestSolutionsSection
  >["content"];

type WhyChooseContent =
  ComponentProps<
    typeof WhyChoose
  >["content"];

type IndustryContent =
  ComponentProps<
    typeof IndustrySection
  >["content"];

type SolutionsContent = {
  hero?:
    HeroSectionContent;

  bestSolutions?:
    BestSolutionsContent;
};

export default async function Page({
  params,
}: {
  params:
    Promise<{
      locale: string;
    }>;
}) {
  const {
    locale,
  } =
    await params;

  const page =
    await getCmsPage(
      "solutions",
      locale
    );

  const sections =
    page?.sections ??
    {};

  /**
   * getCmsPage secara generic mengembalikan
   * Record<string, unknown>.
   *
   * Di level page kita mapping data CMS
   * ke tipe yang dibutuhkan component.
   */
  const solutions =
    sections.Solutions as
      | SolutionsContent
      | undefined;

  const whyChoose =
    sections.WhyChoose as
      | WhyChooseContent
      | undefined;

  const industry =
    sections.SolutionsIndustry as
      | IndustryContent
      | undefined;

  return (
    <>
      <HeroSection
        content={
          solutions?.hero
        }
        locale={
          locale
        }
      />

      <BestSolutionsSection
        content={
          solutions?.bestSolutions
        }
      />

      <WhyChoose
        content={
          whyChoose
        }
        locale={
          locale
        }
      />

      <IndustrySection
        content={
          industry
        }
        locale={
          locale
        }
      />
    </>
  );
}