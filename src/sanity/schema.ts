import { type SchemaTypeDefinition } from "sanity";

export const houseModelSchema: SchemaTypeDefinition = {
  name: "house_model",
  title: "House Model",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() },
    { name: "size_m2", title: "Size (m²)", type: "number", validation: (Rule) => Rule.required() },
    { name: "covered_area_m2", title: "Covered Area (m²)", type: "number", initialValue: 0 },
    { name: "rooms", title: "Rooms", type: "number", validation: (Rule) => Rule.required() },
    { name: "bathrooms", title: "Bathrooms", type: "number", validation: (Rule) => Rule.required() },
    { name: "has_garage", title: "Has Garage", type: "boolean", initialValue: false },
    { name: "has_canopy", title: "Has Canopy", type: "boolean", initialValue: false },
    { name: "price_from", title: "Price From (kr)", type: "number", validation: (Rule) => Rule.required() },
    { name: "main_image", title: "Main Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() },
    { name: "floorplan_png", title: "Floorplan Image", type: "image", validation: (Rule) => Rule.required() },
    { name: "description", title: "Description", type: "text" },
    { name: "features", title: "Features", type: "array", of: [{ type: "string" }] },
    { name: "is_active", title: "Is Active", type: "boolean", initialValue: true },
    { name: "is_featured", title: "Is Featured", type: "boolean", initialValue: false },
    { name: "embed_3d_url", title: "3D Embed URL", type: "url" },
    { name: "order", title: "Order", type: "number" },
  ],
};

export const galleryImageSchema: SchemaTypeDefinition = {
  name: "gallery_image",
  title: "Gallery Image",
  type: "document",
  fields: [
    { name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() },
    { name: "alt", title: "Alt Text", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["eksteriør", "interiør", "byggefase"] },
      validation: (Rule) => Rule.required()
    },
    { name: "is_active", title: "Is Active", type: "boolean", initialValue: true },
    { name: "order", title: "Order", type: "number" },
  ],
};

export const testimonialSchema: SchemaTypeDefinition = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "quote", title: "Quote", type: "text", validation: (Rule) => Rule.required() },
    { name: "rating", title: "Rating", type: "number", validation: (Rule) => Rule.min(1).max(5).required() },
    { name: "date", title: "Date", type: "date" },
    { name: "is_active", title: "Is Active", type: "boolean", initialValue: true },
  ],
};

export const teamMemberSchema: SchemaTypeDefinition = {
  name: "team_member",
  title: "Team Member",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
    { name: "bio", title: "Bio", type: "text" },
    { name: "order", title: "Order", type: "number" },
  ],
};

export const faqItemSchema: SchemaTypeDefinition = {
  name: "faq_item",
  title: "FAQ Item",
  type: "document",
  fields: [
    { name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() },
    { name: "answer", title: "Answer", type: "text", validation: (Rule) => Rule.required() },
    { name: "order", title: "Order", type: "number" },
  ],
};

export const siteSettingsSchema: SchemaTypeDefinition = {
  name: "site_settings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "company_name", title: "Company Name", type: "string" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "address", title: "Address", type: "string" },
    { name: "stat_1_label", title: "Stat 1 Label", type: "string" },
    { name: "stat_1_value", title: "Stat 1 Value", type: "string" },
    { name: "stat_2_label", title: "Stat 2 Label", type: "string" },
    { name: "stat_2_value", title: "Stat 2 Value", type: "string" },
    { name: "stat_3_label", title: "Stat 3 Label", type: "string" },
    { name: "stat_3_value", title: "Stat 3 Value", type: "string" },
    { name: "meta_title", title: "Meta Title", type: "string" },
    { name: "meta_description", title: "Meta Description", type: "text" },
  ],
};

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    houseModelSchema,
    galleryImageSchema,
    testimonialSchema,
    teamMemberSchema,
    faqItemSchema,
    siteSettingsSchema,
  ],
};
