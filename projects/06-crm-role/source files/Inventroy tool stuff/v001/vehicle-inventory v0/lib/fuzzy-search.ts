import Fuse from "fuse.js"

// Generic fuzzy search function that can be used for any data type
export function createFuzzyMatcher<T>(
  items: T[],
  keys: (string | Fuse.FuseOptionKey<T>)[],
  options?: Fuse.IFuseOptions<T>,
) {
  const defaultOptions: Fuse.IFuseOptions<T> = {
    includeScore: true,
    // Lower threshold means more matches (0.0 is exact match, 1.0 matches everything)
    threshold: 0.6, // Increased from 0.4 to be more lenient
    // Enable location, distance, and ignoreLocation for better handling of transpositions
    location: 0,
    distance: 100,
    ignoreLocation: true,
    // Make search case-insensitive
    ignoreCase: true,
    // Add support for finding transposed characters
    findAllMatches: true,
    // Specify which keys to search
    keys,
  }

  const fuse = new Fuse(items, { ...defaultOptions, ...options })

  return (query: string) => {
    if (!query.trim()) return items

    // Get fuzzy search results
    const results = fuse.search(query)

    // Log for debugging
    console.log(
      `Fuzzy search for "${query}" found ${results.length} results:`,
      results.map((r) => ({ item: r.item, score: r.score })),
    )

    return results.map((result) => result.item)
  }
}

// Specific function for models
export function createModelFuzzyMatcher(models: any[]) {
  return createFuzzyMatcher(models, [
    { name: "name", weight: 2 }, // Give name field higher weight
    "category",
    "fuel_type",
    "drive_type",
    "transmission",
  ])
}

// Specific function for brands
export function createBrandFuzzyMatcher(brands: any[]) {
  return createFuzzyMatcher(brands, [
    { name: "name", weight: 2 }, // Give name field higher weight
  ])
}
