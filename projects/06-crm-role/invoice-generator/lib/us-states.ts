export interface USState {
  name: string
  abbreviation: string
  capital?: string
}

export const US_STATES: USState[] = [
  { name: "Alabama", abbreviation: "AL", capital: "Montgomery" },
  { name: "Alaska", abbreviation: "AK", capital: "Juneau" },
  { name: "Arizona", abbreviation: "AZ", capital: "Phoenix" },
  { name: "Arkansas", abbreviation: "AR", capital: "Little Rock" },
  { name: "California", abbreviation: "CA", capital: "Sacramento" },
  { name: "Colorado", abbreviation: "CO", capital: "Denver" },
  { name: "Connecticut", abbreviation: "CT", capital: "Hartford" },
  { name: "Delaware", abbreviation: "DE", capital: "Dover" },
  { name: "Florida", abbreviation: "FL", capital: "Tallahassee" },
  { name: "Georgia", abbreviation: "GA", capital: "Atlanta" },
  { name: "Hawaii", abbreviation: "HI", capital: "Honolulu" },
  { name: "Idaho", abbreviation: "ID", capital: "Boise" },
  { name: "Illinois", abbreviation: "IL", capital: "Springfield" },
  { name: "Indiana", abbreviation: "IN", capital: "Indianapolis" },
  { name: "Iowa", abbreviation: "IA", capital: "Des Moines" },
  { name: "Kansas", abbreviation: "KS", capital: "Topeka" },
  { name: "Kentucky", abbreviation: "KY", capital: "Frankfort" },
  { name: "Louisiana", abbreviation: "LA", capital: "Baton Rouge" },
  { name: "Maine", abbreviation: "ME", capital: "Augusta" },
  { name: "Maryland", abbreviation: "MD", capital: "Annapolis" },
  { name: "Massachusetts", abbreviation: "MA", capital: "Boston" },
  { name: "Michigan", abbreviation: "MI", capital: "Lansing" },
  { name: "Minnesota", abbreviation: "MN", capital: "Saint Paul" },
  { name: "Mississippi", abbreviation: "MS", capital: "Jackson" },
  { name: "Missouri", abbreviation: "MO", capital: "Jefferson City" },
  { name: "Montana", abbreviation: "MT", capital: "Helena" },
  { name: "Nebraska", abbreviation: "NE", capital: "Lincoln" },
  { name: "Nevada", abbreviation: "NV", capital: "Carson City" },
  { name: "New Hampshire", abbreviation: "NH", capital: "Concord" },
  { name: "New Jersey", abbreviation: "NJ", capital: "Trenton" },
  { name: "New Mexico", abbreviation: "NM", capital: "Santa Fe" },
  { name: "New York", abbreviation: "NY", capital: "Albany" },
  { name: "North Carolina", abbreviation: "NC", capital: "Raleigh" },
  { name: "North Dakota", abbreviation: "ND", capital: "Bismarck" },
  { name: "Ohio", abbreviation: "OH", capital: "Columbus" },
  { name: "Oklahoma", abbreviation: "OK", capital: "Oklahoma City" },
  { name: "Oregon", abbreviation: "OR", capital: "Salem" },
  { name: "Pennsylvania", abbreviation: "PA", capital: "Harrisburg" },
  { name: "Rhode Island", abbreviation: "RI", capital: "Providence" },
  { name: "South Carolina", abbreviation: "SC", capital: "Columbia" },
  { name: "South Dakota", abbreviation: "SD", capital: "Pierre" },
  { name: "Tennessee", abbreviation: "TN", capital: "Nashville" },
  { name: "Texas", abbreviation: "TX", capital: "Austin" },
  { name: "Utah", abbreviation: "UT", capital: "Salt Lake City" },
  { name: "Vermont", abbreviation: "VT", capital: "Montpelier" },
  { name: "Virginia", abbreviation: "VA", capital: "Richmond" },
  { name: "Washington", abbreviation: "WA", capital: "Olympia" },
  { name: "West Virginia", abbreviation: "WV", capital: "Charleston" },
  { name: "Wisconsin", abbreviation: "WI", capital: "Madison" },
  { name: "Wyoming", abbreviation: "WY", capital: "Cheyenne" },
  // DC and territories
  { name: "District of Columbia", abbreviation: "DC", capital: "Washington" },
  { name: "Puerto Rico", abbreviation: "PR", capital: "San Juan" },
  { name: "Virgin Islands", abbreviation: "VI", capital: "Charlotte Amalie" },
  { name: "American Samoa", abbreviation: "AS", capital: "Pago Pago" },
  { name: "Guam", abbreviation: "GU", capital: "Hagåtña" },
  { name: "Northern Mariana Islands", abbreviation: "MP", capital: "Saipan" }
]

// Helper function to search states
export function searchStates(query: string): USState[] {
  if (!query) return US_STATES
  
  const lowercaseQuery = query.toLowerCase()
  
  return US_STATES.filter(state => 
    state.name.toLowerCase().includes(lowercaseQuery) ||
    state.abbreviation.toLowerCase().includes(lowercaseQuery) ||
    state.capital?.toLowerCase().includes(lowercaseQuery)
  ).sort((a, b) => {
    // Prioritize exact matches first
    const aNameExact = a.name.toLowerCase() === lowercaseQuery
    const bNameExact = b.name.toLowerCase() === lowercaseQuery
    const aAbbrevExact = a.abbreviation.toLowerCase() === lowercaseQuery
    const bAbbrevExact = b.abbreviation.toLowerCase() === lowercaseQuery
    
    if (aNameExact && !bNameExact) return -1
    if (!aNameExact && bNameExact) return 1
    if (aAbbrevExact && !bAbbrevExact) return -1
    if (!aAbbrevExact && bAbbrevExact) return 1
    
    // Then by name starts with query
    const aNameStarts = a.name.toLowerCase().startsWith(lowercaseQuery)
    const bNameStarts = b.name.toLowerCase().startsWith(lowercaseQuery)
    
    if (aNameStarts && !bNameStarts) return -1
    if (!aNameStarts && bNameStarts) return 1
    
    // Finally alphabetical order
    return a.name.localeCompare(b.name)
  })
} 