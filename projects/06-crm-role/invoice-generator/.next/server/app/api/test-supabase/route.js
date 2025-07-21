/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/test-supabase/route";
exports.ids = ["app/api/test-supabase/route"];
exports.modules = {

/***/ "(rsc)/./app/api/test-supabase/route.ts":
/*!****************************************!*\
  !*** ./app/api/test-supabase/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\nasync function GET() {\n    const result = await (0,_lib_supabase__WEBPACK_IMPORTED_MODULE_1__.testSupabaseConnection)();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(result);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Rlc3Qtc3VwYWJhc2Uvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBQ2E7QUFFaEQsZUFBZUU7SUFDcEIsTUFBTUMsU0FBUyxNQUFNRixxRUFBc0JBO0lBQzNDLE9BQU9ELHFEQUFZQSxDQUFDSSxJQUFJLENBQUNEO0FBQzNCIiwic291cmNlcyI6WyIvVXNlcnMvbmljaG9sYXNmZXlpbnRvbGFmb2xhcmluLWNva2VyL3RyZWxsb21jcC90cmVsbG8tbWNwL3Byb2plY3RzLzA2LWNybS1yb2xlL2ludm9pY2UtZ2VuZXJhdG9yL2FwcC9hcGkvdGVzdC1zdXBhYmFzZS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0IHsgdGVzdFN1cGFiYXNlQ29ubmVjdGlvbiB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZVwiXG4gXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCB0ZXN0U3VwYWJhc2VDb25uZWN0aW9uKClcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHJlc3VsdClcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInRlc3RTdXBhYmFzZUNvbm5lY3Rpb24iLCJHRVQiLCJyZXN1bHQiLCJqc29uIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/test-supabase/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   testSupabaseConnection: () => (/* binding */ testSupabaseConnection)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/.pnpm/@supabase+supabase-js@2.52.0/node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://tnjitpvdtuniykwdrtbv.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaml0cHZkdHVuaXlrd2RydGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDE1NzMsImV4cCI6MjA2ODMxNzU3M30.1ZD5viRkkrGDywfQOMV8oWq8lGg_3EhE-cCxZukVtzQ\";\nif (!supabaseUrl || !supabaseAnonKey) {\n    throw new Error(\"Missing Supabase environment variables\");\n}\n// Create the main client with explicit configuration\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey, {\n    auth: {\n        autoRefreshToken: true,\n        persistSession: true,\n        detectSessionInUrl: true,\n        flowType: \"pkce\"\n    }\n});\n// Test connection function\nasync function testSupabaseConnection() {\n    try {\n        const { data, error } = await supabase.from('users').select('count').single();\n        if (error) throw error;\n        return {\n            success: true,\n            data\n        };\n    } catch (error) {\n        return {\n            success: false,\n            error\n        };\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQW9EO0FBRXBELE1BQU1DLGNBQWNDLDBDQUFvQztBQUN4RCxNQUFNRyxrQkFBa0JILGtOQUF5QztBQUVqRSxJQUFJLENBQUNELGVBQWUsQ0FBQ0ksaUJBQWlCO0lBQ3BDLE1BQU0sSUFBSUUsTUFBTTtBQUNsQjtBQUVBLHFEQUFxRDtBQUM5QyxNQUFNQyxXQUFXUixtRUFBWUEsQ0FBQ0MsYUFBYUksaUJBQWlCO0lBQ2pFSSxNQUFNO1FBQ0pDLGtCQUFrQjtRQUNsQkMsZ0JBQWdCO1FBQ2hCQyxvQkFBb0I7UUFDcEJDLFVBQVU7SUFDWjtBQUNGLEdBQUU7QUFFRiwyQkFBMkI7QUFDcEIsZUFBZUM7SUFDcEIsSUFBSTtRQUNGLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNUixTQUFTUyxJQUFJLENBQUMsU0FBU0MsTUFBTSxDQUFDLFNBQVNDLE1BQU07UUFDM0UsSUFBSUgsT0FBTyxNQUFNQTtRQUNqQixPQUFPO1lBQUVJLFNBQVM7WUFBTUw7UUFBSztJQUMvQixFQUFFLE9BQU9DLE9BQU87UUFDZCxPQUFPO1lBQUVJLFNBQVM7WUFBT0o7UUFBTTtJQUNqQztBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvbmljaG9sYXNmZXlpbnRvbGFmb2xhcmluLWNva2VyL3RyZWxsb21jcC90cmVsbG8tbWNwL3Byb2plY3RzLzA2LWNybS1yb2xlL2ludm9pY2UtZ2VuZXJhdG9yL2xpYi9zdXBhYmFzZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiQHN1cGFiYXNlL3N1cGFiYXNlLWpzXCJcblxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwhXG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSFcblxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XG4gIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgU3VwYWJhc2UgZW52aXJvbm1lbnQgdmFyaWFibGVzXCIpXG59XG5cbi8vIENyZWF0ZSB0aGUgbWFpbiBjbGllbnQgd2l0aCBleHBsaWNpdCBjb25maWd1cmF0aW9uXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlQW5vbktleSwge1xuICBhdXRoOiB7XG4gICAgYXV0b1JlZnJlc2hUb2tlbjogdHJ1ZSxcbiAgICBwZXJzaXN0U2Vzc2lvbjogdHJ1ZSxcbiAgICBkZXRlY3RTZXNzaW9uSW5Vcmw6IHRydWUsXG4gICAgZmxvd1R5cGU6IFwicGtjZVwiLFxuICB9LFxufSlcblxuLy8gVGVzdCBjb25uZWN0aW9uIGZ1bmN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdFN1cGFiYXNlQ29ubmVjdGlvbigpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5mcm9tKCd1c2VycycpLnNlbGVjdCgnY291bnQnKS5zaW5nbGUoKVxuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3JcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3IgfVxuICB9XG59XG5cbi8vIFR5cGVzIGZvciBvdXIgZGF0YWJhc2VcbmV4cG9ydCB0eXBlIFByb2ZpbGUgPSB7XG4gIGlkOiBzdHJpbmdcbiAgZW1haWw6IHN0cmluZ1xuICBmdWxsX25hbWU/OiBzdHJpbmdcbiAgcm9sZTogc3RyaW5nXG4gIGNyZWF0ZWRfYXQ6IHN0cmluZ1xuICB1cGRhdGVkX2F0OiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgRGF0YWJhc2VQRkkgPSB7XG4gIGlkOiBzdHJpbmdcbiAgdXNlcl9pZDogc3RyaW5nXG4gIGludm9pY2VfbnVtYmVyOiBzdHJpbmdcbiAgaW52b2ljZV9kYXRlOiBzdHJpbmdcbiAgdmFsaWRfdW50aWw6IHN0cmluZ1xuICBpbnZvaWNlX3R5cGU6IHN0cmluZ1xuICBjdXN0b21lcl9uYW1lOiBzdHJpbmdcbiAgY3VzdG9tZXJfYWRkcmVzczogc3RyaW5nXG4gIGN1c3RvbWVyX3Bob25lOiBzdHJpbmdcbiAgY3VzdG9tZXJfZW1haWw6IHN0cmluZ1xuICBjdXN0b21lcl9jb250YWN0Pzogc3RyaW5nXG4gIHNhbGVzX2V4ZWN1dGl2ZTogc3RyaW5nXG4gIGNvbnRhY3RfbnVtYmVyOiBzdHJpbmdcbiAgbGluZV9pdGVtczogYW55W11cbiAgcmVnaXN0cmF0aW9uPzogYW55XG4gIGluc3VyYW5jZT86IGFueVxuICBzZXJ2aWNlX29pbF9jaGFuZ2U/OiBhbnlcbiAgdHJhbnNwb3J0X2Nvc3Q/OiBudW1iZXJcbiAgcmVnaXN0cmF0aW9uX2Nvc3Q/OiBudW1iZXJcbiAgc3VidG90YWw6IG51bWJlclxuICB2YXQ6IG51bWJlclxuICB0b3RhbDogbnVtYmVyXG4gIGFtb3VudF9pbl93b3Jkcz86IHN0cmluZ1xuICBiYW5rOiBzdHJpbmdcbiAgYWNjb3VudF9uYW1lOiBzdHJpbmdcbiAgYWNjb3VudF9udW1iZXI6IHN0cmluZ1xuICBwcmVwYXJlZF9ieTogc3RyaW5nXG4gIGFwcHJvdmVkX2J5OiBzdHJpbmdcbiAgcGF5bWVudF90ZXJtcz86IHN0cmluZ1xuICBjcmVhdGVkX2F0OiBzdHJpbmdcbiAgdXBkYXRlZF9hdDogc3RyaW5nXG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VBbm9uS2V5IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJFcnJvciIsInN1cGFiYXNlIiwiYXV0aCIsImF1dG9SZWZyZXNoVG9rZW4iLCJwZXJzaXN0U2Vzc2lvbiIsImRldGVjdFNlc3Npb25JblVybCIsImZsb3dUeXBlIiwidGVzdFN1cGFiYXNlQ29ubmVjdGlvbiIsImRhdGEiLCJlcnJvciIsImZyb20iLCJzZWxlY3QiLCJzaW5nbGUiLCJzdWNjZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-supabase%2Froute&page=%2Fapi%2Ftest-supabase%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-supabase%2Froute.ts&appDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-supabase%2Froute&page=%2Fapi%2Ftest-supabase%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-supabase%2Froute.ts&appDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_nicholasfeyintolafolarin_coker_trellomcp_trello_mcp_projects_06_crm_role_invoice_generator_app_api_test_supabase_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/test-supabase/route.ts */ \"(rsc)/./app/api/test-supabase/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/test-supabase/route\",\n        pathname: \"/api/test-supabase\",\n        filename: \"route\",\n        bundlePath: \"app/api/test-supabase/route\"\n    },\n    resolvedPagePath: \"/Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/06-crm-role/invoice-generator/app/api/test-supabase/route.ts\",\n    nextConfigOutput,\n    userland: _Users_nicholasfeyintolafolarin_coker_trellomcp_trello_mcp_projects_06_crm_role_invoice_generator_app_api_test_supabase_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjAuMF9yZWFjdEAxOS4wLjBfX3JlYWN0QDE5LjAuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ0ZXN0LXN1cGFiYXNlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ0ZXN0LXN1cGFiYXNlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdGVzdC1zdXBhYmFzZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm5pY2hvbGFzZmV5aW50b2xhZm9sYXJpbi1jb2tlciUyRnRyZWxsb21jcCUyRnRyZWxsby1tY3AlMkZwcm9qZWN0cyUyRjA2LWNybS1yb2xlJTJGaW52b2ljZS1nZW5lcmF0b3IlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGbmljaG9sYXNmZXlpbnRvbGFmb2xhcmluLWNva2VyJTJGdHJlbGxvbWNwJTJGdHJlbGxvLW1jcCUyRnByb2plY3RzJTJGMDYtY3JtLXJvbGUlMkZpbnZvaWNlLWdlbmVyYXRvciZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDZ0Y7QUFDN0o7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9uaWNob2xhc2ZleWludG9sYWZvbGFyaW4tY29rZXIvdHJlbGxvbWNwL3RyZWxsby1tY3AvcHJvamVjdHMvMDYtY3JtLXJvbGUvaW52b2ljZS1nZW5lcmF0b3IvYXBwL2FwaS90ZXN0LXN1cGFiYXNlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS90ZXN0LXN1cGFiYXNlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdGVzdC1zdXBhYmFzZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdGVzdC1zdXBhYmFzZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9uaWNob2xhc2ZleWludG9sYWZvbGFyaW4tY29rZXIvdHJlbGxvbWNwL3RyZWxsby1tY3AvcHJvamVjdHMvMDYtY3JtLXJvbGUvaW52b2ljZS1nZW5lcmF0b3IvYXBwL2FwaS90ZXN0LXN1cGFiYXNlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-supabase%2Froute&page=%2Fapi%2Ftest-supabase%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-supabase%2Froute.ts&appDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "?08b1":
/*!****************************!*\
  !*** bufferutil (ignored) ***!
  \****************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?5fe5":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0","vendor-chunks/@supabase+auth-js@2.71.1","vendor-chunks/ws@8.18.3","vendor-chunks/@supabase+realtime-js@2.11.15","vendor-chunks/@supabase+postgrest-js@1.19.4","vendor-chunks/@supabase+storage-js@2.7.1","vendor-chunks/@supabase+supabase-js@2.52.0","vendor-chunks/whatwg-url@5.0.0","vendor-chunks/@supabase+functions-js@2.4.5","vendor-chunks/isows@1.0.7_ws@8.18.3","vendor-chunks/tr46@0.0.3","vendor-chunks/webidl-conversions@3.0.1","vendor-chunks/@supabase+node-fetch@2.6.15"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-supabase%2Froute&page=%2Fapi%2Ftest-supabase%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-supabase%2Froute.ts&appDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fnicholasfeyintolafolarin-coker%2Ftrellomcp%2Ftrello-mcp%2Fprojects%2F06-crm-role%2Finvoice-generator&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();