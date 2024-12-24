<template>
  <div class="w-full h-[76px] p-4 bg-[rgb(45,194,117)] flex justify-between">
    <div v-if="!stateApp.headerBack" class="flex items-center text-2xl font-bold text-white">
      <img src="@/assets/avt.png" alt="" class="h-full">
    </div>
    <div v-else class="flex items-center gap-3">
      <div class="h-[40px] w-[40px] flex justify-center items-center rounded-full border-[rgba(235,235,240,0.565)] border" @click="router.push('/home')">
        <Back />
      </div>
      <div class="text-white font-bold text-lg">
        Trang chủ
      </div>
    </div>
    <div>
      <div v-if="!isAuth" class="h-full flex items-center text-white text-sm font-semibold" @click="onLogin">
        Đăng nhập
      </div>
      <div v-else class="h-full flex items-center">
        <a-dropdown placement="bottomRight">
          <div class="cursor-pointer flex items-center gap-2 px-1">
            <div class="text-sm text-white">
              {{ userData.name }}
            </div>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="router.push('/profile')">
                <div class="flex h-[36px] items-center gap-3">
                  <User style="width: 20px; height: 20px;fill: black;" />
                  Tài khoản
                </div>
              </a-menu-item>
              <a-menu-item @click="handleLogout()">
                <div class="flex h-[36px] items-center gap-3">
                  <Logout style="width: 15px; height: 15px;fill: black;" />
                  Đăng xuất
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Back from '@/assets/back.svg?component'
import Logout from '@/assets/logout.svg?component'
import User from '@/assets/user.svg?component'
import useAuth from '@/hooks/useAuth'
import useStateApp from '@/hooks/useStateApp'
import { useRouter } from 'vue-router'

const { isAuth, userData, logout } = useAuth()
const router = useRouter()
const { stateApp } = useStateApp()

function onLogin() {
  router.push('/login')
}

function handleLogout() {
  logout()
  router.push('/home')
}
</script>

<style lang="scss">
</style>
