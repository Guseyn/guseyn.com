import updateCacheVersionsInUrls from '#nodes/updateCacheVersionsInUrls.js'
import addCdnToUrls from '#nodes/addCdnToUrls.js'
import removeCdnFromUrls from '#nodes/removeCdnFromUrls.js'

const environment = process.env.ENV

export default async function prepareStaticFilesWithCdnAndCacheVersions() {
  await removeCdnFromUrls('web-app/static', 'https://cdn.guseyn.com')
  await updateCacheVersionsInUrls('web-app/static')
  if (environment === 'prod') {
    await addCdnToUrls('web-app/static', 'https://cdn.guseyn.com')
  } else {
    await removeCdnFromUrls('web-app/static', 'https://cdn.guseyn.com')
  }
}
