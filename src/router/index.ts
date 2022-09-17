import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/reset-password/',
    component: () => import("@/views/ResetPassword.vue")
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '/tabs/',
        redirect: '/tabs/tab1',
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'profiles',
        component: () => import('@/views/Profiles.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
