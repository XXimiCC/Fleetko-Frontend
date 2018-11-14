const config = {
  development: {
    serverUrl: 'https://api-dev.fleetko.com',
    googleClientId: '320261261322-ke9ee39neluu8a2hrd6419urmatl2piv.apps.googleusercontent.com',
    googleMapApi: 'AIzaSyCrZ5tBy9z9MurzNnVomuR2ivZuILxDGV8',
    googleTagManager: 'GTM-WCNT46D',
    facebookAppId: '152029128730100',
    algoliaApiKey: '6dd4b89da4f77e8a0c59dbefa8f0285b',
    algoliaApiId: 'K1ZXCZFG2D',
    gRecaptcha: '6Lfjl1sUAAAAAMQT3RlVeWN8-bpqVhpYPjL_OhTL',
    driftKey: 't4czyr5z32bs'
  },
  staging: {
    serverUrl: 'https://api-stg.fleetko.com',
    googleClientId: '1084376772068-5qthrltckv5nrgrflmkehpg432bc9ajc.apps.googleusercontent.com',
    googleMapApi: 'AIzaSyDU3dmpZxk1wMPkbVU2zP9LLiCUfNcoYes',
    googleTagManager: 'GTM-WCNT46D',
    facebookAppId: '2656754357683779',
    algoliaApiKey: '6ce60dca17d9a67244435d6808ebab0a',
    algoliaApiId: 'UABHMWBSRM',
    gRecaptcha: '6Leuf1sUAAAAABGqVeamHI_qAA9_B24LqDe0oRT1',
    driftKey: 't4czyr5z32bs'
  },
  production: {
    serverUrl: 'https://api.fleetko.com',
    googleClientId: '1084376772068-5qthrltckv5nrgrflmkehpg432bc9ajc.apps.googleusercontent.com',
    googleMapApi: 'AIzaSyDU3dmpZxk1wMPkbVU2zP9LLiCUfNcoYes',
    googleTagManager: 'GTM-5GL9VGR',
    facebookAppId: '2656754357683779',
    algoliaApiKey: '8c4f60d49b8ac9faa51680d56d2a3d96',
    algoliaApiId: 'HBJ4V5BCLP',
    gRecaptcha: '6Leuf1sUAAAAABGqVeamHI_qAA9_B24LqDe0oRT1',
    driftKey: 'nzhx6mvhgu4f'
  }
}

export default config[process.env.VUE_APP_ENV]
