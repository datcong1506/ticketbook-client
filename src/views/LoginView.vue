<template>
  <div class="absolute w-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex flex-col bg-[white] overflow-hidden border-[rgb(45,_194,_117)] border-solid border">
    <div class="h-[112px] bg-[rgb(45,_194,_117)] relative mb-4">
      <div class="absolute bottom-0 left-[10%] h-[60px] w-[85%] text-3xl font-bold text-white flex items-center">
        Đăng nhập
      </div>
    </div>
    <div class="flex flex-col gap-4 px-5">
      <a-form ref="formRef" :rules="rules" :model="form">
        <a-form-item name="email">
          <a-input v-model:value="form.email" size="large" placeholder="Please input your email" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="form.password" size="large" placeholder="Please input your password" />
        </a-form-item>
        <a-form-item class="mt-1">
          <a-button :disabled="isFormInvalid" type="primary" size="large" block @click="onLogin">
            Tiếp tục
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="flex justify-center text-sm text-[rgb(166,166,176)]">
      Chưa có tài khoản?
    </div>
    <div class="flex justify-center text-sm text-[rgb(45,194,117)] mt-1 mb-4 font-medium">
      <span @click="onRegister">Tạo tài khoản ngay</span>
    </div>
    <div class="flex justify-center text-sm text-[rgb(45,194,117)] mt-1 mb-4 font-medium">
      <span @click="router.push('/home')">Trở về trang chủ</span>
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

const { setToken, setUserData } = useAuth()
const router = useRouter()

const formRef = ref<FormInstance>()
const isFormInvalid = ref(true)
const form = reactive({
  email: '',
  password: '',
})

watch(form, async () => {
  try {
    await formRef.value?.validate()
    isFormInvalid.value = false
  } catch (_) {
    isFormInvalid.value = true
  }
})

const rules: Record<string, Rule[]> = {
  email: [{ required: true, message: 'Please input your email!', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: 'Please input your password!', trigger: ['blur', 'change'] }],
}

async function onLogin(): Promise<void> {
  try {
    const res = await userApi.login<{ token: string, user: any }>(form)

    setToken(res.data.token)
    setUserData(res.data.user)
    router.push('/')
  } catch (_) {
    notification.error({
      duration: 2,
      message: 'Login fail',
    })
  }
}

function onRegister(): void {
  router.push('/register')
}
</script>

<style lang="scss">
</style>
