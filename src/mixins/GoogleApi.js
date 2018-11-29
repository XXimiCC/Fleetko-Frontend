/* eslint-disable */
import config from '../config'
import $ from 'jquery'

export const GoogleApi = {
  methods: {
    googleApiInit (button) {
      let startApp = () => {
        gapi.load('auth2', () => {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          var auth2 = gapi.auth2.init({
            client_id: config.googleClientId,
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
          })
          this.loginGoogle(document.getElementById(button), auth2)
        })
      }
      startApp()
    },
    initGoogleTagScript () {
      // language=HTML
      const headScript = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                          })(window,document,'script','dataLayer', "${config.googleTagManager}");</script>`

      const bodyScript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${config.googleTagManager}"
                          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`

      $('head').append(headScript);
      $('body').prepend(bodyScript);
    }
  }
}
