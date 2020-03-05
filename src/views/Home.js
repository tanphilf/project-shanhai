import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './earn.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/", redirect: App },
        { path: '*', component: App }
    ]
})

new Vue({
  router,
  render: h => h(App)

}).$mount('#app')