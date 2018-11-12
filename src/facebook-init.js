/* eslint-disable */
/*
Facebook API global init
 */
import config from './config'

/* eslint-disable */
(function (d, s, id) {
  let js = d.getElementsByTagName(s)[0]
  let fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) {
    return
  }
  js = d.createElement(s)
  js.id = id
  js.src = '//connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

window.fbAsyncInit = function () {

  FB.init({
    appId: config.facebookAppId,
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v2.12'
  })
}
/* eslint-enable */




