<template>
  <div class="w-full p-[16px] pb-0">
    <div class="bg-white rounded-md px-4">
      <div class="text-base font-semibold py-3 border-b border-solid border-b-[rgb(235,235,240)] ">
        Rạp chiếu
      </div>
      <div class="flex gap-1 mt-1 flex-col pb-4">
        <div class="w-[100px] h-[100px]">
          <img :src="scheduler?.room?.cinema?.logo ?? ''" alt="poster" class="w-full object-cover">
        </div>
        <div class="text-sm font-medium">
          {{ scheduler?.room?.cinema?.name }} - {{ scheduler?.room?.cinema?.location }}
        </div>
        <div class="text-xs">
          {{ scheduler?.room?.cinema?.description }}
        </div>
      </div>
    </div>
  </div>
  <div class="w-full p-[16px] mt-1">
    <div class="bg-white rounded-md px-4">
      <div class="text-base font-semibold py-3 border-b border-solid border-b-[rgb(235,235,240)] ">
        Phòng chiếu: {{ scheduler?.room?.name }}
      </div>
      <div class="flex gap-1 mt-3 flex-col pb-3">
        <div class="text-base font-medium">
          Phim chiếu: {{ scheduler?.film?.title }}
        </div>
        <div class="text-sm font-medium">
          Thời gian: {{ dayjs(scheduler?.time).format('HHgmmp DD/MM/YYYY') }}
        </div>
        <div class="text-base font-medium mt-2 text-[rgb(45,194,117)]">
          Giá vé: {{ scheduler?.regularPrice?.toLocaleString('de-DE') }} VNĐ
        </div>
        <div class="text-base font-medium text-[rgb(241,75,75)]">
          Giá vé VIP: {{ scheduler?.vipPrice?.toLocaleString('de-DE') }} VNĐ
        </div>
      </div>
    </div>
  </div>
  <div class="w-full p-[16px] mt-1 pt-0">
    <div class="bg-white rounded-md px-4">
      <div class="text-base font-semibold py-3 border-b border-solid border-b-[rgb(235,235,240)] ">
        Danh sách ghế
      </div>
      <div class="flex gap-1 mt-3 flex-col pb-3">
        <div v-for="s in scheduler?.room?.seats ?? []" :key="s" class="flex text-base font-medium justify-between items-center py-3 border-b border-solid border-b-[rgb(235,235,240)] gap-4">
          <div class="flex flex-grow justify-between gap-2">
            <div>{{ s.name }}</div>
            <div v-if="s.type === 'VIP'" class="bg-[rgb(241,75,75)] text-white p-1 text-xs rounded-md">
              VIP
            </div>
            <div v-else class="bg-[rgb(45,194,117)] text-white p-1 text-xs rounded-md">
              Nor
            </div>
          </div>
          <button v-if="!seatBooked.includes(s.name)" class="bg-[rgb(45,194,117)] text-white p-2 text-sm rounded-md" @click="onBuyTicket(s)">
            Đặt vé
          </button>
          <div v-else class="bg-[rgb(95,95,95)] text-white p-2 text-sm rounded-md">
            Đã đặt
          </div>
        </div>
      </div>
    </div>
  </div>
  <ConfirmBuyTicket v-model="openBuyTicketModal" :seat-name="seatName" :price="price" @ok="onOrderTicket" />
</template>

<script setup lang="ts">
import userApi from '@/apis/user'
import ConfirmBuyTicket from '@/components/ConfirmBuyTicket.vue'
import useAuth from '@/hooks/useAuth'
import useStateApp from '@/hooks/useStateApp'
import { notification } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { hiddenBottomNavigate, showBottomNavigate, stateApp } = useStateApp()
const { userData } = useAuth()
const route = useRoute()
const router = useRouter()

const scheduler = ref<any>(null)
const bookedScheduler = ref<any[]>([])

const openBuyTicketModal = ref(false)
const seatName = ref('')
const price = computed(() => {
  const type = (scheduler.value?.room?.seats ?? []).find((s: any) => s.name === seatName.value)?.type

  return type === 'VIP' ? scheduler.value?.vipPrice : scheduler.value?.regularPrice
})

const seatBooked = computed(() => bookedScheduler.value.map(b => b?.seat ?? ''))

async function getScheduler() {
  try {
    const res = await userApi.getScheduler(route.params.id as string)
    scheduler.value = res.data
  } catch (_) {
  }
}

async function getTicketBooked() {
  try {
    const res = await userApi.getTicketBookedByScheduler<any[]>(route.params.id as string)
    bookedScheduler.value = res.data
  } catch (_) {
  }
}

function onBuyTicket(seat: { name: string }) {
  seatName.value = seat.name
  openBuyTicketModal.value = true
}

async function onOrderTicket() {
  try {
    await userApi.buyTicket<any[]>({ userId: userData.value._id, schedulerId: route.params.id as string, seatName: seatName.value })

    notification.success({
      message: 'Đặt vé thành công, hãy xem lại vé đã đặt',
    })
    router.push('/my-ticket')
  } catch (_) {
  }
}

onBeforeMount(async () => {
  hiddenBottomNavigate()
  stateApp.value.headerBack = true
  await getScheduler()
  await getTicketBooked()
})

onBeforeUnmount(() => {
  showBottomNavigate()
  stateApp.value.headerBack = false
})
</script>

<style lang="scss">
</style>
