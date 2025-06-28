// Special case handler for common model name typos
export function preprocessSearchQuery(query: string): string {
  // Convert to lowercase for case-insensitive comparison
  const lowercaseQuery = query.toLowerCase()

  // Special case for ALSVIN/ASLVIN
  if (lowercaseQuery === "alsvin" || lowercaseQuery === "alvin" || lowercaseQuery === "slvin") {
    // Return both possible spellings to improve matching
    return "alsvin aslvin"
  }

  // Add more special cases as needed

  return query
}
