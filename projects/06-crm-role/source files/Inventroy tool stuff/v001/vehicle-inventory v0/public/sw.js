// Service Worker for caching API responses
const CACHE_NAME = "vehicle-inventory-cache-v1"
const API_CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// API routes to cache
const API_ROUTES = ["/api/brands", "/api/models", "/api/colors", "/api/trims"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/index.html", "/favicon.ico"])
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== CACHE_NAME
          })
          .map((name) => {
            return caches.delete(name)
          }),
      )
    }),
  )
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Check if the request is for an API route we want to cache
  const isApiRoute = API_ROUTES.some((route) => url.pathname.startsWith(route))

  if (isApiRoute) {
    event.respondWith(networkFirstWithCache(event.request))
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      }),
    )
  }
})

async function networkFirstWithCache(request) {
  const cache = await caches.open(CACHE_NAME)

  try {
    // Try to get a fresh response from the network
    const networkResponse = await fetch(request)

    // Clone the response before caching it
    const responseToCache = networkResponse.clone()

    // Cache the fresh response
    cache.put(request, responseToCache)

    return networkResponse
  } catch (error) {
    // If network request fails, try to get from cache
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      // Check if the cached response is still valid
      const cachedDate = new Date(cachedResponse.headers.get("date"))
      const now = new Date()

      if (now.getTime() - cachedDate.getTime() < API_CACHE_DURATION) {
        return cachedResponse
      }
    }

    // If no valid cached response, return a basic error response
    return new Response(JSON.stringify({ error: "Network request failed and no valid cache available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}
