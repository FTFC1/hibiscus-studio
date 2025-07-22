export interface NigerianState {
  name: string
  abbreviation: string
  capital: string
  geopoliticalZone: string
}

export const NIGERIAN_STATES: NigerianState[] = [
  { name: "Abia", abbreviation: "AB", capital: "Umuahia", geopoliticalZone: "South East" },
  { name: "Adamawa", abbreviation: "AD", capital: "Yola", geopoliticalZone: "North East" },
  { name: "Akwa Ibom", abbreviation: "AK", capital: "Uyo", geopoliticalZone: "South South" },
  { name: "Anambra", abbreviation: "AN", capital: "Awka", geopoliticalZone: "South East" },
  { name: "Bauchi", abbreviation: "BA", capital: "Bauchi", geopoliticalZone: "North East" },
  { name: "Bayelsa", abbreviation: "BY", capital: "Yenagoa", geopoliticalZone: "South South" },
  { name: "Benue", abbreviation: "BE", capital: "Makurdi", geopoliticalZone: "North Central" },
  { name: "Borno", abbreviation: "BO", capital: "Maiduguri", geopoliticalZone: "North East" },
  { name: "Cross River", abbreviation: "CR", capital: "Calabar", geopoliticalZone: "South South" },
  { name: "Delta", abbreviation: "DE", capital: "Asaba", geopoliticalZone: "South South" },
  { name: "Ebonyi", abbreviation: "EB", capital: "Abakaliki", geopoliticalZone: "South East" },
  { name: "Edo", abbreviation: "ED", capital: "Benin City", geopoliticalZone: "South South" },
  { name: "Ekiti", abbreviation: "EK", capital: "Ado Ekiti", geopoliticalZone: "South West" },
  { name: "Enugu", abbreviation: "EN", capital: "Enugu", geopoliticalZone: "South East" },
  { name: "FCT", abbreviation: "FC", capital: "Abuja", geopoliticalZone: "North Central" },
  { name: "Gombe", abbreviation: "GO", capital: "Gombe", geopoliticalZone: "North East" },
  { name: "Imo", abbreviation: "IM", capital: "Owerri", geopoliticalZone: "South East" },
  { name: "Jigawa", abbreviation: "JI", capital: "Dutse", geopoliticalZone: "North West" },
  { name: "Kaduna", abbreviation: "KD", capital: "Kaduna", geopoliticalZone: "North West" },
  { name: "Kano", abbreviation: "KN", capital: "Kano", geopoliticalZone: "North West" },
  { name: "Katsina", abbreviation: "KT", capital: "Katsina", geopoliticalZone: "North West" },
  { name: "Kebbi", abbreviation: "KE", capital: "Birnin Kebbi", geopoliticalZone: "North West" },
  { name: "Kogi", abbreviation: "KO", capital: "Lokoja", geopoliticalZone: "North Central" },
  { name: "Kwara", abbreviation: "KW", capital: "Ilorin", geopoliticalZone: "North Central" },
  { name: "Lagos", abbreviation: "LA", capital: "Ikeja", geopoliticalZone: "South West" },
  { name: "Nasarawa", abbreviation: "NA", capital: "Lafia", geopoliticalZone: "North Central" },
  { name: "Niger", abbreviation: "NI", capital: "Minna", geopoliticalZone: "North Central" },
  { name: "Ogun", abbreviation: "OG", capital: "Abeokuta", geopoliticalZone: "South West" },
  { name: "Ondo", abbreviation: "ON", capital: "Akure", geopoliticalZone: "South West" },
  { name: "Osun", abbreviation: "OS", capital: "Osogbo", geopoliticalZone: "South West" },
  { name: "Oyo", abbreviation: "OY", capital: "Ibadan", geopoliticalZone: "South West" },
  { name: "Plateau", abbreviation: "PL", capital: "Jos", geopoliticalZone: "North Central" },
  { name: "Rivers", abbreviation: "RI", capital: "Port Harcourt", geopoliticalZone: "South South" },
  { name: "Sokoto", abbreviation: "SO", capital: "Sokoto", geopoliticalZone: "North West" },
  { name: "Taraba", abbreviation: "TA", capital: "Jalingo", geopoliticalZone: "North East" },
  { name: "Yobe", abbreviation: "YO", capital: "Damaturu", geopoliticalZone: "North East" },
  { name: "Zamfara", abbreviation: "ZA", capital: "Gusau", geopoliticalZone: "North West" },
]

// Search function for Nigerian states
export function searchNigerianStates(query: string): NigerianState[] {
  if (!query) return NIGERIAN_STATES

  const lowercaseQuery = query.toLowerCase()
  
  return NIGERIAN_STATES.filter(state => {
    const matchesName = state.name.toLowerCase().includes(lowercaseQuery)
    const matchesAbbreviation = state.abbreviation.toLowerCase().includes(lowercaseQuery)
    const matchesCapital = state.capital.toLowerCase().includes(lowercaseQuery)
    const matchesZone = state.geopoliticalZone.toLowerCase().includes(lowercaseQuery)
    
    return matchesName || matchesAbbreviation || matchesCapital || matchesZone
  }).sort((a, b) => {
    // Prioritize exact matches first
    const aExactName = a.name.toLowerCase() === lowercaseQuery
    const bExactName = b.name.toLowerCase() === lowercaseQuery
    if (aExactName && !bExactName) return -1
    if (!aExactName && bExactName) return 1
    
    // Then abbreviation matches
    const aExactAbbr = a.abbreviation.toLowerCase() === lowercaseQuery
    const bExactAbbr = b.abbreviation.toLowerCase() === lowercaseQuery
    if (aExactAbbr && !bExactAbbr) return -1
    if (!aExactAbbr && bExactAbbr) return 1
    
    // Then prefix matches
    const aStartsWithName = a.name.toLowerCase().startsWith(lowercaseQuery)
    const bStartsWithName = b.name.toLowerCase().startsWith(lowercaseQuery)
    if (aStartsWithName && !bStartsWithName) return -1
    if (!aStartsWithName && bStartsWithName) return 1
    
    return a.name.localeCompare(b.name)
  })
} 