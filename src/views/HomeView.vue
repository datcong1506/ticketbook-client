<template>
  <CategoryComponent @change-category="fetchFilm($event)" />
  <div class="p-[10px] bg-[rgb(39,39,42)] min-h-[calc(100vh_-_201px)]">
    <div class="text-[#fff] text-lg font-bold mb-2">
      Phim đang chiếu
    </div>
    <template v-if="film?.length && film.some(f => filmSchedule[0].includes(f._id))">
      <div class="grid grid-cols-2 gap-4">
        <template v-for="f in film" :key="f._id">
          <template v-if="filmSchedule[0].includes(f._id)">
            <div class="bg-[rgb(56,56,61)] rounded-b-lg overflow-hidden">
              <img :src="f.thumb" alt="poster" class="w-full h-[280px] object-cover" style="border: 6px solid #000000;">
              <div class="p-[10px]">
                <div class="text-[#fff] font-bold text-sm h-[40px] line-clamp-2">
                  {{ f.title }}
                </div>
                <div class="text-[#fff] text-xs mt-1">
                  <span class="font-bold">Thể loại:</span> <span>{{ Array.isArray(f.genre) ? f.genre.join(', ') : f.genre }}</span>
                </div>
                <div class="text-[#fff] text-xs">
                  <span class="font-bold">Thời lượng:</span> <span>{{ Math.round(f.duration / 60) }} phút</span>
                </div>
                <div class="text-[#fff] text-xs">
                  <span class="font-bold">Khởi chiếu:</span> <span>{{ dayjs(f.releaseDate).format('DD/MM/YYYY') }}</span>
                </div>
                <div class="flex justify-end mt-4">
                  <button class="bg-[rgb(45,194,117)] text-white text-sm px-2 py-1 rounded-md" @click="onClickFilm(f._id)">
                    Mua vé
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center p-10 text-white">
        Chưa có phim nào đang chiếu thuộc thể loại này
      </div>
    </template>

    <div class="text-[#fff] text-lg font-bold mb-2 mt-4">
      Phim sắp chiếu
    </div>
    <template v-if="film?.length && film.some(f => filmSchedule[1].includes(f._id))">
      <div class="grid grid-cols-2 gap-4">
        <template v-for="f in film" :key="f._id">
          <template v-if="filmSchedule[1].includes(f._id)">
            <div class="bg-[rgb(56,56,61)] rounded-b-lg overflow-hidden">
              <img :src="f.thumb" alt="poster" class="w-full h-[280px] object-cover" style="border: 6px solid #000000;">
              <div class="p-[10px]">
                <div class="text-[#fff] font-bold text-sm h-[40px] line-clamp-2">
                  {{ f.title }}
                </div>
                <div class="text-[#fff] text-xs mt-1">
                  <span class="font-bold">Thể loại:</span> <span>{{ Array.isArray(f.genre) ? f.genre.join(', ') : f.genre }}</span>
                </div>
                <div class="text-[#fff] text-xs">
                  <span class="font-bold">Thời lượng:</span> <span>{{ Math.round(f.duration / 60) }} phút</span>
                </div>
                <div class="text-[#fff] text-xs">
                  <span class="font-bold">Khởi chiếu:</span> <span>{{ dayjs(f.releaseDate).format('DD/MM/YYYY') }}</span>
                </div>
                <div class="flex justify-end mt-4">
                  <button class="bg-[rgb(45,194,117)] text-white text-sm px-2 py-1 rounded-md" @click="onClickFilm(f._id)">
                    Mua vé
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center p-10 text-white">
        Chưa có phim nào sắp chiếu thuộc thể loại này
      </div>
    </template>

    <div class="text-[#fff] text-lg font-bold mb-2 mt-4">
      Các rạp chiếu
    </div>

    <div class="flex gap-2 overflow-auto scroll-container">
      <template v-for="c in cinema" :key="c._id">
        <div class="bg-[rgb(56,56,61)] rounded-b-lg overflow-hidden mb-4 min-w-[200px]">
          <img :src="c.logo" alt="poster" class="w-[200px] h-[200px] object-cover">
          <div class="p-[10px]">
            <div class="text-[#fff] font-bold text-sm h-[40px] line-clamp-2">
              {{ c.name }} - {{ c.location }}
            </div>
            <!-- <div class="flex justify-end mt-2">
              <button class="bg-[rgb(45,194,117)] text-white text-sm px-2 py-1 rounded-md">
                Xem lịch chiếu
              </button>
            </div> -->
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import cinemaApi from '@/apis/cinema'
import filmApi from '@/apis/film'
import userApi from '@/apis/user'
import CategoryComponent from '@/components/CategoryComponent.vue'
import dayjs from 'dayjs'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const film = ref<any[]>([])
const cinema = ref<any[]>([])
const schedule = ref<any[]>([])

onBeforeMount(async () => {
  await getFilms()
  await getCinemas()
  await getSchedule()
})

const filmSchedule = computed(() => {
  const mapTime = new Map<string, { min: number, max: number }>()
  for (const s of schedule.value) {
    const filmId = s.film._id as string
    const time = new Date(s.time).getTime()

    const mapTo = mapTime.get(filmId)
    if (!mapTo) {
      mapTime.set(filmId, { min: time, max: time })
    } else {
      if (time < mapTo.min) {
        mapTo.min = time
      } else if (time > mapTo.max) {
        mapTo.max = time
      }
    }
  }

  const timeNow = new Date().getTime()

  const filmNow = []
  const filmFuture = []
  for (const k of mapTime.keys()) {
    const mapKey = mapTime.get(k)

    if (!mapKey) {
      continue
    }

    if (mapKey.min <= timeNow && timeNow <= mapKey.max) {
      filmNow.push(k)
    }
    if (mapKey.min > timeNow) {
      filmFuture.push(k)
    }
  }

  return [filmNow, filmFuture]
})

async function getFilms() {
  try {
    const res = await filmApi.getAll<any[]>()
    film.value = res.data
  } catch (error) {
    film.value = []
  }
}

async function fetchFilm(cate: string) {
  if (cate === 'Tất cả') {
    await getFilms()
    return
  }

  try {
    const res = await filmApi.getByCategory<any[]>(cate)
    film.value = res.data
  } catch (error) {
    film.value = []
  }
}

async function getCinemas() {
  try {
    const res = await cinemaApi.getAll<any[]>()
    cinema.value = res.data
  } catch (error) {
    cinema.value = []
  }
}

async function getSchedule() {
  try {
    const res = await userApi.getAllSchedule<any[]>()
    schedule.value = res.data
  } catch (error) {
    schedule.value = []
  }
}

function onClickFilm(id: string) {
  router.push(`/film/${id}`)
}
</script>

<style lang="scss" scoped>
.scroll-container::-webkit-scrollbar {
  display: none;
}
</style>
