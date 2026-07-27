import { SECTION_TYPE } from "../constants/index.js";

export interface ContentSection {
  id?: string;
  type: string;
  data?: Record<string, unknown>;
}

export type HeroSectionData = {
  heading: string;
  subheading?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type ParagraphSectionData = {
  title?: string;
  markdown: string;
};

export type ListSectionItem = {
  heading: string;
  body?: string;
  imageUrl?: string;
  href?: string;
};

export type ListSectionData = {
  title?: string;
  items: ListSectionItem[];
};

export type GallerySectionItem = {
  imageUrl: string;
  alt?: string;
  caption?: string;
};

export type GallerySectionData = {
  variant: "carousel" | "grid";
  items: GallerySectionItem[];
};

export type CtaSectionData = {
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
};

export type QuoteSectionData = {
  quote: string;
  attribution?: string;
  role?: string;
};

export type HeroSection = {
  id?: string;
  type: typeof SECTION_TYPE.HERO;
  data: HeroSectionData;
};

export type ParagraphSection = {
  id?: string;
  type: typeof SECTION_TYPE.PARAGRAPH;
  data: ParagraphSectionData;
};

export type ListSection = {
  id?: string;
  type: typeof SECTION_TYPE.LIST;
  data: ListSectionData;
};

export type GallerySection = {
  id?: string;
  type: typeof SECTION_TYPE.GALLERY;
  data: GallerySectionData;
};

export type CtaSection = {
  id?: string;
  type: typeof SECTION_TYPE.CTA;
  data: CtaSectionData;
};

export type QuoteSection = {
  id?: string;
  type: typeof SECTION_TYPE.QUOTE;
  data: QuoteSectionData;
};

export type PresetSection =
  | HeroSection
  | ParagraphSection
  | ListSection
  | GallerySection
  | CtaSection
  | QuoteSection;

export type SectionPresetType = PresetSection["type"];

export function isSectionType<T extends SectionPresetType>(
  section: ContentSection,
  type: T,
): section is Extract<PresetSection, { type: T }> {
  return section.type === type;
}
