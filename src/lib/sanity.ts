import { createClient, SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";

let _client: SanityClient | null = null;

function getClient(): SanityClient {
  if (_client) return _client;
  if (!projectId) {
    throw new Error("Sanity projectId is not configured.");
  }
  _client = createClient({ projectId, dataset, apiVersion, useCdn, perspective: "published" });
  return _client;
}

export const client = new Proxy({} as SanityClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Queries
export async function getHouseModels() {
  return client.fetch(
    `*[_type == "house_model" && is_active == true] | order(size_m2 asc)`,
    {},
    { next: { revalidate: 120 } }
  );
}

export async function getFeaturedHouseModels() {
  return client.fetch(
    `*[_type == "house_model" && is_active == true && is_featured == true] | order(size_m2 asc)[0...3]`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getHouseModelBySlug(slug: string) {
  return client.fetch(
    `*[_type == "house_model" && slug.current == $slug && is_active == true][0]`,
    { slug },
    { next: { revalidate: 300 } }
  );
}

export async function getTestimonials() {
  return client.fetch(
    `*[_type == "testimonial" && is_active == true] | order(date desc)[0...6]`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export async function getGalleryImages() {
  return client.fetch(
    `*[_type == "gallery_image" && is_active == true] | order(order asc)`,
    {},
    { next: { revalidate: 300 } }
  );
}

export async function getFaqItems() {
  return client.fetch(
    `*[_type == "faq_item"] | order(order asc)`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "team_member"] | order(order asc)`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "site_settings"][0]`,
    {},
    { next: { revalidate: 3600 } }
  );
}
