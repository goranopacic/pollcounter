import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Amplify from 'aws-amplify'
import awsmobile from './aws-exports'
Amplify.configure(awsmobile)

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Agenda from '@/components/Agenda.vue'
import PrizeGame from '@/components/PrizeGame.vue'
import HighScore from '@/components/HighScore.vue'
import AwsUgBelgrade from '@/components/AwsUgBelgrade.vue'

Vue.use(VueRouter)

var VueCookie = require('vue-cookie');
Vue.use(VueCookie)

const routes = [
  {
    path: '/',
    redirect: () => {
      return '/prize-game'
    }
  },
  { 
    path: '/agenda',
    component: Agenda
  },
  { 
    path: '/prize-game',
    component: PrizeGame
  },
  { 
    path: '/high-score',
    component: HighScore
  },
  { 
    path: '/aws-ug-belgrade',
    component: AwsUgBelgrade
  },
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => { 
//   if (to.matched.some(record => record.meta.enabled)) {
//       if (!to.meta.enabled) {
//           next({ path: '/'}) 
//       } else {
//         next()
//       }
//   } else {
//     next({ path: '/404'}) 
//   }
// })



Vue.use(BootstrapVue)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')