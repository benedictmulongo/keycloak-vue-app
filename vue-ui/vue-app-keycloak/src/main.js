import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from "keycloak-js";

let initOptions = {
    url: 'http://127.0.0.1:8080/', realm: 'keycloak-demo', clientId: 'app-vue', onLoad: 'login-required'
  }

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
    if (!auth) {
        window.location.reload();
    } else {
        Vue.$log.info("Authenticated");

        new Vue({
            el: '#app',
            render: h => h(App, { props: { keycloak: keycloak } })
        })
    }


//Token Refresh
    setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                Vue.$log.info('Token refreshed' + refreshed);
            } else {
                Vue.$log.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).catch(() => {
            Vue.$log.error('Failed to refresh token');
        });
    }, 6000)

}).catch(() => {
    Vue.$log.error("Authenticated Failed");
});

createApp(App).mount('#app')
