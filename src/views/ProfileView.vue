<template>
  <div class="flex w-full p-10 min-h-[calc(100vh_-_141px)] bg-[rgb(39,39,42)]">
    <div class="w-full bg-white p-4 h-[400px] rounded-lg">
      <a-form ref="formRef" :rules="rules" :model="form">
        <div class="font-bold mb-2">
          Địa chỉ email
        </div>
        <a-form-item name="email">
          <a-input v-model:value="form.email" disabled size="large" placeholder="Please input your email" />
        </a-form-item>
        <div class="font-bold mb-2">
          Họ và tên
        </div>
        <a-form-item name="name">
          <a-input v-model:value="form.name" size="large" placeholder="Please input your name" />
        </a-form-item>
        <div class="font-bold mb-2">
          Tuổi
        </div>
        <a-form-item name="age">
          <a-input-number v-model:value="form.age" class="w-full" size="large" placeholder="Please input your age" />
        </a-form-item>
        <a-form-item class="mt-10">
          <a-button :disabled="isFormInvalid" type="primary" size="large" block @click="onUpdateProfile">
            Cập nhật
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import userApi from '@/apis/user'
import useAuth from '@/hooks/useAuth'
import { notification } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { userData, setUserData } = useAuth()
const router = useRouter()

const formRef = ref<FormInstance>()
const isFormInvalid = ref(true)
const form = reactive({
  email: userData.value.email,
  name: userData.value.name,
  age: userData.value.age,
})

watch(form, async () => {
  try {
    await formRef.value?.validate()
    isFormInvalid.value = false
  } catch (_) {
    isFormInvalid.value = true
  }
}, { immediate: true })

async function checkAge(_rule: Rule, value: number) {
  if (!value) {
    return Promise.reject('Please input your age!')
  }
  if (!Number.isInteger(value)) {
    return Promise.reject('Please input digits!')
  }
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please input your name!', trigger: ['blur', 'change'] }],
  age: [{ validator: checkAge, trigger: ['blur', 'change'] }],
}

async function onUpdateProfile() {
  try {
    const res = await userApi.update<any>({ email: form.email, name: form.name, age: form.age as any, userId: userData.value._id as string })

    setUserData(res.data)
    router.push('/')
  } catch (_) {
    notification.error({
      duration: 2,
      message: 'Update fail',
    })
  }
}
</script>

<style lang="scss">
</style>
