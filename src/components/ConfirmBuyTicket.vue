<template>
  <a-modal v-model:open="modelValue" destroy-on-close title="Xác nhận" :closable="false">
    <div class="text-lg p-4">
      Bạn xác nhận đặt vé cho ghế {{ seatName }} với giá {{ price?.toLocaleString('de-DE') }} VNĐ?
    </div>
    <template #footer>
      <div class="flex justify-center items-center gap-4">
        <a-button size="large" @click="onCancel">
          Hủy
        </a-button>
        <a-button danger size="large" @click="onConfirm">
          Xác nhận
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
defineProps<{
  seatName: string
  price: number
}>()

const emit = defineEmits<{
  ok: []
}>()

const modelValue = defineModel<boolean>()

function onCancel() {
  modelValue.value = false
}
function onConfirm() {
  modelValue.value = false
  emit('ok')
}
</script>

<style lang="">

</style>
