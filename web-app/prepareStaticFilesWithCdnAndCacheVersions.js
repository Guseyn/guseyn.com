const updateCacheVersionsInUrls = require('./../nodes/updateCacheVersionsInUrls')
const addCdnToUrls = require('./../nodes/addCdnToUrls')
const removeCdnFromUrls = require('./../nodes/removeCdnFromUrls')

const environment = process.env.ENV

module.exports = async function prepareStaticFilesWithCdnAndCacheVersions() {
  await removeCdnFromUrls('web-app/static', 'https://cdn.guseyn.com')
  // await updateCacheVersionsInUrls('web-app/static')
  if (environment === 'prod') {
    await addCdnToUrls('web-app/static', 'https://cdn.guseyn.com')
  } else {
    await removeCdnFromUrls('web-app/static', 'https://cdn.guseyn.com')
  }
}
