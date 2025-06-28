import useSWR from "swr"

// Generic fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return response.json()
}

// Hook for fetching trims by model ID
export function useTrims(modelId: number | null) {
  const { data, error, isLoading } = useSWR(modelId ? `/api/trims?modelId=${modelId}` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  return {
    trims: data || [],
    isLoading,
    isError: error,
  }
}

// Hook for fetching models
export function useModels() {
  const { data, error, isLoading, mutate } = useSWR("/api/models", fetcher)

  return {
    models: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching colors
export function useColors() {
  const { data, error, isLoading, mutate } = useSWR("/api/colors", fetcher)

  return {
    colors: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching brands
export function useBrands() {
  const { data, error, isLoading, mutate } = useSWR("/api/brands", fetcher)

  return {
    brands: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
