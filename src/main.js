import '@babel/polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'

import Dashboard from './components/Dashboard'
import Merchants from './components/merchants/Index'
import Faucet from './components/faucet/Faucet'
import Merchant from './components/merchants/Merchant'
import MerchantsAdd from './components/merchants/Add'

// plugins
import PluginMiddleware from './plugins/middleware';

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(PluginMiddleware)


var router = new VueRouter({
  routes: [
    { path: '/', component: Dashboard },
    { path: '/merchants', component: Merchants},
    { path: '/merchants/add', component: MerchantsAdd },
    { path: '/merchant/:key/:asset', component: Merchant },

    { path: '/faucet', component: Faucet},
  ],
  mode: 'history'
})

new Vue({
	render: h => h(App),
	router: router,
}).$mount('#app')
