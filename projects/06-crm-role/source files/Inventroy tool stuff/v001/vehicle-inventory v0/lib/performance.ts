export function logPerformance(componentName: string, startTime: number): void {
  const endTime = performance.now()
  const duration = endTime - startTime

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`)
  }
}

export function usePerformanceMonitor(componentName: string): void {
  if (process.env.NODE_ENV === "development") {
    const startTime = performance.now()

    // Log when component mounts
    console.log(`[Performance] ${componentName} mounting...`)

    return () => {
      logPerformance(componentName, startTime)
    }
  }

  return () => {}
}
