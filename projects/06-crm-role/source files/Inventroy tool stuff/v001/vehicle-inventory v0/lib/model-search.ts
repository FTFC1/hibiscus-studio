import Fuse from "fuse.js"

// Performance measurement utility
function measurePerformance<T>(fn: () => T, label: string): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`)
  return result
}

// Special case mapping for known model names and their common misspellings
const MODEL_NAME_MAPPINGS: Record<string, string[]> = {
  // Add specific mappings for problematic model names
  ALSVIN: ["alsvin", "alvin", "aslvin", "slvin"],
  "ALSVIN V3": ["alsvin", "alvin", "aslvin", "slvin", "v3"],
  // Add more mappings as needed
}

// Function to check if a search query matches a model name using our special mappings
export function modelNameMatches(modelName: string, searchQuery: string): boolean {
  return measurePerformance(() => {
    // Convert both to lowercase for case-insensitive comparison
    const normalizedModelName = modelName.toLowerCase()
    const normalizedQuery = searchQuery.toLowerCase().trim()

    // Add diagnostic logs
    console.log(`Checking if model "${modelName}" matches query "${searchQuery}"`)

    // Direct match check
    if (normalizedModelName.includes(normalizedQuery)) {
      console.log(`Direct match found: "${normalizedModelName}" includes "${normalizedQuery}"`)
      return true
    }

    // Check against our mappings
    for (const [originalName, variations] of Object.entries(MODEL_NAME_MAPPINGS)) {
      if (normalizedModelName.includes(originalName.toLowerCase())) {
        // This model matches one of our special cases
        console.log(`Model "${modelName}" matches special case "${originalName}"`)

        if (
          variations.some((variation) => variation.includes(normalizedQuery) || normalizedQuery.includes(variation))
        ) {
          console.log(`Query "${searchQuery}" matches a variation of "${originalName}"`)
          return true
        }
      }
    }

    // If no direct match or special case match, use fuzzy search as fallback
    console.log(`Using fuzzy search as fallback for "${modelName}" with query "${searchQuery}"`)

    const fuse = new Fuse([{ name: modelName }], {
      keys: ["name"],
      threshold: 0.6, // Higher threshold = more lenient matching
      ignoreLocation: true,
      findAllMatches: true,
      ignoreCase: true,
    })

    const fuseResults = fuse.search(searchQuery)
    console.log(`Fuse.js results for "${modelName}":`, fuseResults.length > 0)

    return fuseResults.length > 0
  }, `modelNameMatches("${modelName}", "${searchQuery}")`)
}

// Function to filter models based on search query
export function filterModelsBySearch(models: any[], searchQuery: string): any[] {
  return measurePerformance(() => {
    console.log(`[Search] Filtering ${models.length} models with query "${searchQuery}"`)

    if (!searchQuery.trim()) {
      return models
    }

    // For very short queries that might match too many items, increase strictness
    if (searchQuery.length === 1) {
      console.log(`[Search] Short query detected, using stricter matching`)
      // For single character searches, only do direct matches
      const query = searchQuery.toLowerCase().trim()
      return models.filter((model) => model.name.toLowerCase().startsWith(query))
    }

    return models.filter((model) => {
      // Check model name
      const nameMatches = modelNameMatches(model.name, searchQuery)

      if (nameMatches) {
        return true
      }

      // Check other model properties
      const query = searchQuery.toLowerCase().trim()
      return (
        (model.category && model.category.toLowerCase().includes(query)) ||
        (model.fuel_type && model.fuel_type.toLowerCase().includes(query)) ||
        (model.drive_type && model.drive_type.toLowerCase().includes(query)) ||
        (model.transmission && model.transmission.toLowerCase().includes(query))
      )
    })
  }, `filterModelsBySearch(${models.length} models, "${searchQuery}")`)
}
