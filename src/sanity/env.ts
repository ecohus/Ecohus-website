export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-30";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.replace(/_/g, "-").toLowerCase(),
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const useCdn = false;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    console.warn(errorMessage);
    return "" as any; // Safely fall back during build
  }
  return v;
}
