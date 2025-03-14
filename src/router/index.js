import { createRouter, createWebHistory } from 'vue-router';
import MainComponent from '@/components/MainComponent.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'main',
      path: '/',
      component: MainComponent,
      props: false,
    }
  ],
  scrollBehavior() {
    return {top: 0};
  }
})

router.beforeEach((to, from, next) => {
  const allowed = ['main'];
  if (!allowed.includes(to.name)) {
    return next({name: 'main'})
  }

  return next()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
