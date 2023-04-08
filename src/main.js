import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'

// Import utilities functions
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

import './utils'

//Vue Jalali Moment
import moment from 'vue-jalali-moment'
Vue.use(moment)
Vue.use(BootstrapVue)
Vue.use(VuePersianDatetimePicker, {
  name: 'vue-date-picker',
  props: {
    format: 'YYYY-MM-DD HH:mm',
    displayFormat: 'jYYYY-jMM-jDD HH:mm',
    editable: false,
    inputClass: 'form-control',
    placeholder: 'تاریخ را انتخاب کنید',
    altFormat: 'YYYY-MM-DD HH:mm',
    color: '#6256e5'
  }
})
new Vue({
  render: h => h(App)
}).$mount('#app')
