<template>
  <div class="absolute w-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex flex-col bg-[white] overflow-hidden border-[rgb(45,_194,_117)] border-solid border">
    <div class="h-[112px] bg-[rgb(45,_194,_117)] relative mb-4">
      <div class="absolute bottom-0 left-[10%] h-[60px] w-[85%] text-3xl font-bold text-white flex items-center">
        Đăng ký tài khoản
      </div>
    </div>
    <div class="flex flex-col gap-4 px-5">
      <a-form ref="formRef" :rules="rules" :model="form">
        <a-form-item name="email">
          <a-input v-model:value="form.email" size="large" placeholder="Please input your email" />
        </a-form-item>
        <a-form-item name="name">
          <a-input v-model:value="form.name" size="large" placeholder="Please input your name" />
        </a-form-item>
        <a-form-item name="age">
          <a-input-number v-model:value="form.age" class="w-full" size="large" placeholder="Please input your age" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="form.password" size="large" placeholder="Please input your password" />
        </a-form-item>
        <a-form-item name="passwordConfirm">
          <a-input-password v-model:value="form.passwordConfirm" size="large" placeholder="Please input your password" />
        </a-form-item>
        <a-form-item class="mt-1">
          <a-button :disabled="isFormInvalid" type="primary" size="large" block @click="onRegister">
            Tiếp tục
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="flex justify-center text-sm text-[rgb(166,166,176)]">
      Đã có tài khoản?
    </div>
    <div class="flex justify-center text-sm text-[rgb(45,194,117)] mt-1 mb-4 font-medium">
      <span @click="onLogin">Đăng nhập ngay</span>
    </div>
    <div class="flex justify-center text-sm text-[rgb(45,194,117)] mt-1 mb-4 font-medium">
      <span @click="router.push('/home')">Trở về trang chủ</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import userApi from '@/apis/user'
import useAuth from '@/hooks/useAuth'
import { type FormInstance, notification } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { setToken, setUserData } = useAuth()

const formRef = ref<FormInstance>()
const isFormInvalid = ref(true)
const form = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  age: undefined,
})

watch(form, async () => {
  try {
    await formRef.value?.validate()
    isFormInvalid.value = false
  } catch (_) {
    isFormInvalid.value = true
  }
})

async function checkAge(_rule: Rule, value: number) {
  if (!value) {
    return Promise.reject('Please input your age!')
  }
  if (!Number.isInteger(value)) {
    return Promise.reject('Please input digits!')
  }
  return Promise.resolve()
}

async function checkPassConfirm(_rule: Rule, value: string) {
  if (!value) {
    return Promise.reject('Please input your password confirm!')
  }
  if (value !== form.password) {
    return Promise.reject('Please input password confirm equal password!')
  }
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  email: [{ required: true, message: 'Please input your email!', trigger: ['blur', 'change'] }],
  name: [{ required: true, message: 'Please input your name!', trigger: ['blur', 'change'] }],
  age: [{ validator: checkAge, trigger: ['blur', 'change'] }],
  password: [{ required: true, message: 'Please input your password!', trigger: ['blur', 'change'] }],
  passwordConfirm: [{ validator: checkPassConfirm, trigger: ['blur', 'change'] }],
}

const router = useRouter()

async function onRegister() {
  try {
    const res = await userApi.register<{ token: string, user: any }>({ email: form.email, name: form.name, age: form.age as any, password: form.password })

    setToken(res.data.token)
    setUserData(res.data.user)
    router.push('/')
  } catch (_) {
    notification.error({
      duration: 2,
      message: 'Register fail',
    })
  }
}

function onLogin() {
  router.push('/login')
}
</script>

<style lang="scss">
</style>
