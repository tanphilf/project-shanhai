import Vue from "vue";
import App from "./App.vue";
import Vconsole from 'vconsole'
import router from "./router";
import store from "./store";

// new Vconsole();

if (window) {
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })
}

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
