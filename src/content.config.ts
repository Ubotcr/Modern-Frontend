import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Homepage collection
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({}).catchall(z.any()),
});

// About collection
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({}).catchall(z.any()),
});

// Changelog collection
const changelogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/changelog" }),
  schema: z.object({}).catchall(z.any()),
});

// Blog collection
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({}).catchall(z.any()),
});

// Contact collection
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({}).catchall(z.any()),
});

// Features collection
const featuresCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/features" }),
  schema: z.object({}).catchall(z.any()),
});

// Pages collection
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({}).catchall(z.any()),
});

// Pricing collection
const pricingCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pricing" }),
  schema: z.object({}).catchall(z.any()),
});

// Sections collection
const sectionsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({}).catchall(z.any()),
});

// Export collections
export const collections = {
  homepage: homepageCollection,
  about: aboutCollection,
  changelog: changelogCollection,
  blog: blogCollection,
  contact: contactCollection,
  features: featuresCollection,
  pages: pagesCollection,
  pricing: pricingCollection,
  sections: sectionsCollection,
};
