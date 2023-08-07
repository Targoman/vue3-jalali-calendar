import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import moment from "vue-jalali-moment";
import moment from "vue3-jalali-moment";
import { BootstrapVue } from "bootstrap-vue";
// Vue.use(moment)
// Vue.use(BootstrapVue)
createApp(App).use(moment).use(BootstrapVue).mount("#app");
