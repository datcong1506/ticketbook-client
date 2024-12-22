<template>
  <div class="flex border-t border-t-[rgb(81,81,88)] border-solid h-[65px] bg-[rgb(56,56,61)]">
    <div class="flex-grow flex flex-col justify-center items-center gap-2" @click="router.push('/home')">
      <HomeImg width="20" height="20" :stroke="route.name === 'home' ? 'rgb(45,194,117)' : '#fff'" />
      <div class="text-sm" :class="{ 'text-[rgb(45,194,117)]': route.name === 'home', 'text-white': route.name !== 'home' }">
        Trang chủ
      </div>
    </div>
    <div class="flex-grow flex flex-col justify-center items-center gap-2" @click="router.push('/my-ticket')">
      <TicketImg width="20" height="20" :stroke="route.name === 'myticket' ? 'rgb(45,194,117)' : '#fff'" />
      <div class="text-sm" :class="{ 'text-[rgb(45,194,117)]': route.name === 'myticket', 'text-white': route.name !== 'myticket' }">
        Vé của tôi
      </div>
    </div>
    <div class="flex-grow flex flex-col justify-center items-center gap-2" @click="isAuth ? router.push('/profile') : router.push('/login')">
      <UserImg width="20" height="20" :fill="route.name === 'profile' ? 'rgb(45,194,117)' : '#fff'" />
      <div class="text-sm" :class="{ 'text-[rgb(45,194,117)]': route.name === 'profile', 'text-white': route.name !== 'profile' }">
        Tài khoản
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeImg from '@/assets/home.svg?component'
import TicketImg from '@/assets/ticket.svg?component'
import UserImg from '@/assets/user.svg?component'
import useAuth from '@/hooks/useAuth'
import { useRoute, useRouter } from 'vue-router'

const { isAuth } = useAuth()
const route = useRoute()
const router = useRouter()
</script>

<style lang="scss">
</style>
