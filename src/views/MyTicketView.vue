<template>
  <div class="flex w-full p-3 overflow-auto scroll-container gap-2 bg-[rgb(45,194,117)]">
    <div v-for="s in stateTicket" :key="s.state" class="flex p-1 justify-center items-center text-xs rounded-lg min-w-[100px] font-medium text-[rgb(42,45,52)]" :class="{ 'bg-white': s.state === activeState, 'bg-[rgb(175,184,201)]': s.state !== activeState }" @click="activeState = s.state">
      {{ s.name }}
    </div>
  </div>
  <div class="w-full min-h-[calc(100vh_-_189px)] bg-[rgb(39,39,42)] p-4">
    <template v-if="tickets?.length">
      <div v-for="t in tickets" :key="t._id" class="w-full rounded-lg overflow-hidden bg-white mb-4">
        <div class="flex flex-col p-5 border-b-[#dddddd] border-b">
          <div class="font-bold text-lg mb-2">
            {{ t?.showtime?.room?.cinema?.name }} - {{ t?.showtime?.room?.cinema?.location }}
          </div>
          <div class="text-base">
            <span class="text-[#72be43]">{{ t?.showtime?.room?.name }}</span> - <span>{{ dayjs(t?.showtime?.time).format('DD/MM/YYYY') }}</span> - Suất chiếu: {{ dayjs(t?.showtime?.time).format('HHgm') }}
          </div>
          <div class="text-base mt-1">
            <span class="font-semibold">Được đặt lúc:</span> <span class="text-[#72be43]">{{ dayjs(t?.buyAt).format('Hgmp-DD/MM/YYYY') }}</span>
          </div>
          <div v-if="activeState === 4" class="text-base mt-1">
            <span class="font-semibold">Được hủy lúc:</span> <span class="text-[rgb(241,75,75)]">{{ dayjs(t?.rejectAt).format('Hgmp-DD/MM/YYYY') }}</span>
          </div>
          <div v-if="activeState === 2" class="text-base mt-1">
            <span class="font-semibold">Được sử dụng lúc:</span> <span class="text-[#72be43]">{{ dayjs(t?.purchasedAt).format('Hgmp-DD/MM/YYYY') }}</span>
          </div>
        </div>
        <div class="px-5 py-4 border-b-[#dddddd] border-b">
          <div class="font-bold text-xl text-[#72be43] mb-2">
            {{ t?.showtime?.film?.title }}
          </div>
          <span v-if="t?.showtime?.room?.seats?.find((s:any) => s.name === t.seat)?.type === 'VIP'" class="bg-[rgb(241,75,75)] text-white p-1 text-xs rounded-md">
            VIP
          </span>
          <span v-else class="bg-[rgb(45,194,117)] text-white p-1 text-xs rounded-md">
            Nor
          </span>
          <div class="flex justify-between items-center mt-5">
            <div>Ghế: {{ t?.seat }}</div>
            <div class="text-[#72be43] text-lg font-medium">
              {{ t?.showtime?.room?.seats?.find((s:any) => s.name === t.seat)?.type === 'VIP' ? t?.showtime?.vipPrice?.toLocaleString('de-DE') : t?.showtime?.regularPrice?.toLocaleString('de-DE') }} VNĐ
            </div>
          </div>
        </div>
        <div v-if="activeState === 1" class="flex justify-end px-5 py-4">
          <button class="bg-[rgb(223,62,62)] text-white p-2 text-sm rounded-md" @click="onRejectTicket(t._id)">
            Hủy vé
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="p-5 text-[rgb(175,184,201)] flex justify-center mb-10">
        Có vẻ bạn chưa có vé nào!!!
      </div>
    </template>
    <div class="w-full flex justify-center">
      <button class="bg-[rgb(45,194,117)] text-white p-2 text-base font-medium rounded-md" @click="router.push('/home')">
        Mua vé xem phim ngay
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import userApi from '@/apis/user'
import useAuth from '@/hooks/useAuth'
import dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { userData } = useAuth()
const router = useRouter()
const stateTicket = [
  {
    name: 'Thành công',
    state: 1,
  },
  {
    name: 'Đã sử dụng',
    state: 2,
  },
  {
    name: 'Đã hủy',
    state: 4,
  },
]

const activeState = ref(1)
const tickets = ref<any[]>([])

watch(activeState, async (v) => {
  await getTicket(v)
}, {
  immediate: true,
})

async function getTicket(state: number) {
  try {
    const res = await userApi.getTicket<any[]>(state, userData.value._id)
    tickets.value = res.data
  } catch (_) {
  }
}

async function onRejectTicket(id: string) {
  try {
    const res = await userApi.rejectTicket<any[]>(id)
    console.log(res.data)
    await getTicket(activeState.value)
  } catch (_) {
  }
}
</script>

<style lang="scss">
</style>
