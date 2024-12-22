import { ref } from 'vue'

const userInfoStorage = localStorage.getItem('user')

const isAuth = ref<boolean>(!!localStorage.getItem('token'))
const userData = ref(userInfoStorage ? JSON.parse(userInfoStorage) : {})

function useAuth() {
  const setToken = (token: string): void => {
    localStorage.setItem('token', token)
    isAuth.value = true
  }

  const setUserData = (data: any): void => {
    userData.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  const getToken = (): string => {
    return localStorage.getItem('token') || ''
  }

  const logout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    userData.value = {}
    isAuth.value = false
  }
  return { isAuth, userData, setToken, getToken, logout, setUserData }
}

export default useAuth
