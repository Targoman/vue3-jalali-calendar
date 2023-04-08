import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'

// Import utilities functions
import './utils'

//Vue Jalali Moment
import moment from 'vue-jalali-moment'
Vue.use(moment)
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App)
}).$mount('#app')
