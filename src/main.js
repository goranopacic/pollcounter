import Vue from 'vue'
import App from './App.vue'
import Amplify from 'aws-amplify'
import awsmobile from './aws-exports'
Amplify.configure(awsmobile)

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

var VueCookie = require('vue-cookie');
Vue.use(VueCookie)



Vue.use(BootstrapVue)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')