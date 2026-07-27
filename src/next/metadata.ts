import type { Metadata } from "next";
import { ENTRY_FIELD } from "../constants/index.js";
import type { ResolveResult, SeoFields } from "../types/index.js";

/**
 * Builds Next.js `Metadata` from resolve SEO, falling back to entry field title.
 * Includes Open Graph and Twitter card images when `seo.ogImage` is set
 * (page, entry, or site default — already merged by Atlas).
 */
export function buildMetadata(result: ResolveResult): Metadata {
  const seo = result.seo ?? result.entry?.seo;
  const title = resolveTitle(result, seo?.title);
  const description = seo?.description;
  const canonical = seo?.canonical;
  const noindex = seo?.noindex === true;

  const metadata: Metadata = {};

  if (title) {
    metadata.title = title;
  }
  if (description) {
    metadata.description = description;
  }
  if (canonical) {
    metadata.alternates = { canonical };
  }
  if (noindex) {
    metadata.robots = { index: false, follow: false };
  }

  const openGraph = buildOpenGraph(seo, title, description);
  if (openGraph) {
    metadata.openGraph = openGraph;
  }

  const twitter = buildTwitter(seo, title, description);
  if (twitter) {
    metadata.twitter = twitter;
  }

  return metadata;
}

function resolveTitle(
  result: ResolveResult,
  seoTitle: string | undefined,
): string | undefined {
  if (seoTitle) {
    return seoTitle;
  }

  const fields = result.entry?.fields;
  const titleField = fields?.[ENTRY_FIELD.TITLE];
  if (typeof titleField === "string" && titleField.trim()) {
    return titleField;
  }

  return undefined;
}

function buildOpenGraph(
  seo: SeoFields | undefined,
  title: string | undefined,
  description: string | undefined,
): Metadata["openGraph"] | undefined {
  const ogImage = seo?.ogImage;
  if (!title && !description && !ogImage) {
    return undefined;
  }

  const openGraph: NonNullable<Metadata["openGraph"]> = {};
  if (title) {
    openGraph.title = title;
  }
  if (description) {
    openGraph.description = description;
  }
  if (ogImage) {
    openGraph.images = [
      {
        url: ogImage,
        ...(seo?.ogImageAlt ? { alt: seo.ogImageAlt } : {}),
      },
    ];
  }
  return openGraph;
}

function buildTwitter(
  seo: SeoFields | undefined,
  title: string | undefined,
  description: string | undefined,
): Metadata["twitter"] | undefined {
  const ogImage = seo?.ogImage;
  if (!title && !description && !ogImage) {
    return undefined;
  }

  if (ogImage) {
    return {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    };
  }

  return {
    title,
    description,
  };
}
