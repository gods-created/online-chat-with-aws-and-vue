import vuetify from './vuetify'
import router from '@/router'
import store from '@/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(store)
}
