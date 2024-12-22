import useAuth from '@/hooks/useAuth'
import LayoutView from '@/layouts/LayoutView.vue'
import BuyTicketView from '@/views/BuyTicketView.vue'
import LoginView from '@/views/LoginView.vue'
import MyTicketView from '@/views/MyTicketView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const { isAuth } = useAuth()

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LayoutView,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: HomeView,
        name: 'home',
      },
      {
        path: 'film/:id',
        name: 'film',
        component: () => import('@/views/FilmView.vue'),
      },
      {
        path: 'buy-ticket/:id',
        name: 'buyticket',
        component: BuyTicketView,
      },
      {
        path: 'my-ticket',
        component: MyTicketView,
        name: 'myticket',
      },
      {
        path: 'profile',
        component: ProfileView,
        name: 'profile',
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const needAuth = ['myticket', 'profile', 'buyticket']

router.beforeEach((to, _, next) => {
  if (!isAuth.value) {
    if (needAuth.includes(to.name as string)) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    if (to.name === 'login' || to.name === 'register') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
