// This script can be run after git pull to update ?v= cache versions in static files
import updateCacheVersionsInUrls from '#nodes/updateCacheVersionsInUrls.js'
import setupFileLogging from '#nodes/setupFileLogging.js'
import removeCdnFromUrls from '#nodes/removeCdnFromUrls.js'
import addCdnToUrls from '#nodes/addCdnToUrls.js'

/* ──────────────────────────────────────────────────────────────── */
/* 🌍  ENVIRONMENT CHECK                                            */
/* ──────────────────────────────────────────────────────────────── */
const environment = process.env.ENV

// Enable cache versioning for any environment except local
const weUpdateCacheVersionsInUrls = environment !== 'local'

/* ──────────────────────────────────────────────────────────────── */
/* 🔄  UPDATE STATIC FILE VERSION QUERIES                            */
/* ──────────────────────────────────────────────────────────────── */
if (weUpdateCacheVersionsInUrls) {
  const logFile = './output.log'

  // Store logs into output.log so it doesn't pollute stdout
  setupFileLogging(logFile)

  // Apply ?v=<hash> to all static resource URLs
  await updateCacheVersionsInUrls('web-app/static')
}

await removeCdnFromUrls('web-app/static', 'https://cdn.guseyn.com')
if (environment === 'prod') {
  await addCdnToUrls('web-app/static', 'https://cdn.guseyn.com')
} else {
  await removeCdnFromUrls('web-app/static', 'https://cdn.guseyn.com')
}
