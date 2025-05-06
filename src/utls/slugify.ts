import slugify from "slugify";

// Ensures uniqueness by appending a random suffix
export function generateSlug(name: string) {
  const baseSlug = slugify(name, { lower: true, strict: true });

  // Optional: Add a random suffix or timestamp if needed
  const uniqueSuffix = Math.random().toString(36).substr(2, 6);

  return `${baseSlug}-${uniqueSuffix}`;
}
