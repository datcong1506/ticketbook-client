<template>
  <div class="w-full h-[60px] bg-[black] px-[1rem]">
    <div class="flex gap-8 overflow-auto h-full w-full scroll-container px-4">
      <template v-for="c in category" :key="c">
        <div class=" text-sm flex items-center flex-shrink-0" :class="c === activeCategory ? 'text-[rgb(45,194,117)]' : 'text-[#fff]'" @click="activeCategory = c">
          <span>
            {{ c }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  changeCategory: [string]
}>()

const category = ['Tất cả', 'Hành động', 'Kinh dị', 'Viễn tưởng', 'Lãng mạn', 'Hài hước', 'Phiêu lưu', 'Thần thoại', 'Hoạt hình', 'Tài liệu', 'Kịch tính', 'Chiến tranh', 'Thể thao', 'Nhạc kịch']

const activeCategory = ref('Tất cả')

watch(activeCategory, (v) => {
  emit('changeCategory', v)
})
</script>

<style lang="scss" scoped>
.scroll-container::-webkit-scrollbar {
  display: none;
}
</style>
