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
  },
  {
    path: '/settings/',
    component: TabsPage,
    children: [
      {
        path: '/settings/',
        redirect: '/tabs/profiles',
      },
      {
        path: 'password',
        component: () => import('@/views/ChangePassword.vue')
      },
      {
        path: 'username',
        component: () => import('@/views/ChangeUsername.vue')
      },
      {
        path: 'description',
        component: () => import('@/views/ChangeDescription.vue')
      },
      {
        path: 'avatar',
        component: () => import('@/views/ChangeAvatar.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
