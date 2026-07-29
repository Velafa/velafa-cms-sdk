import type { LAYOUT_PRESET, PAGE_TYPE } from "../constants/index.js";

export type {
  ContentSection,
  CtaSection,
  CtaSectionData,
  GallerySection,
  GallerySectionData,
  GallerySectionItem,
  HeroSection,
  HeroSectionData,
  ListSection,
  ListSectionData,
  ListSectionItem,
  ParagraphSection,
  ParagraphSectionData,
  PresetSection,
  QuoteSection,
  QuoteSectionData,
  SectionPresetType,
} from "./sections.js";
export { isSectionType } from "./sections.js";
import type { ContentSection } from "./sections.js";

export type LayoutPreset =
  (typeof LAYOUT_PRESET)[keyof typeof LAYOUT_PRESET];

export type PageType = (typeof PAGE_TYPE)[keyof typeof PAGE_TYPE];

export interface SeoFields {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
}

export interface SitemapRule {
  include?: boolean;
  priority?: number;
  changefreq?: string;
}

export interface LlmsTxtRule {
  include?: boolean;
  section?: string;
}

export interface Page {
  id: string;
  envId: string;
  siteId: string;
  versionId: string;
  locale: string;
  path: string;
  type: PageType;
  templateId: string;
  collectionId?: string;
  slugField?: string;
  sections?: ContentSection[];
  status: string;
  seo?: SeoFields;
  sitemap?: SitemapRule;
  llmsTxt?: LlmsTxtRule;
  entityType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  siteId: string;
  versionId: string;
  name: string;
  routePattern: string;
  kind: string;
  layoutPreset: LayoutPreset;
  requiredFields: string[];
  builtIn: boolean;
  entityType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id: string;
  collectionId: string;
  siteId: string;
  versionId: string;
  locale: string;
  slug: string;
  status: string;
  fields: Record<string, unknown>;
  body?: string;
  sections?: ContentSection[];
  seo?: SeoFields;
  entityType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResolveResult {
  page: Page;
  template: Template;
  entry?: Entry;
  /** Present on collection listing resolves (path without `:slug`). */
  entries?: Entry[];
  seo?: SeoFields;
}

export interface LiveItem {
  id: string;
  siteId: string;
  key: string;
  locale?: string;
  data: Record<string, unknown>;
  entityType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

/**
 * Next.js-aware fetch options. Next patches `fetch` in RSC and
 * honors `cache` / `next.revalidate` / `next.tags` when present.
 */
export interface CmsRequestOptions {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  signal?: AbortSignal;
}

export type LocaleOptions = CmsRequestOptions & {
  locale?: string;
};

export interface CmsClientConfig {
  /** Atlas API base URL without a trailing slash. */
  baseUrl: string;
  siteId: string;
  envId: string;
  /** Used when a method call omits `locale`. */
  defaultLocale?: string;
  /** Defaults to global `fetch`. */
  fetch?: typeof fetch;
}
