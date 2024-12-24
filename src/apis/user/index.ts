import type { TDataAxios } from '../_base'
import apiClient from '../_base'

const userApi = {
  login: <Res>(data: { email: string, password: string }): Promise<TDataAxios<Res>> => {
    const url = '/guest/login'
    return apiClient.post(url, { ...data })
  },
  register: <Res>(data: { email: string, password: string, name: string, age: number }): Promise<TDataAxios<Res>> => {
    const url = '/guest/register'
    return apiClient.post(url, { ...data })
  },
  update: <Res>(data: { email: string, name: string, age: number, userId: string }): Promise<TDataAxios<Res>> => {
    const url = `/user/${data.userId}`
    return apiClient.put(url, { ...data })
  },
  getScheduler: <Res>(id: string): Promise<TDataAxios<Res>> => {
    const url = '/user/showtime/get'
    return apiClient.post(url, { id })
  },
  getTicketBookedByScheduler: <Res>(id: string): Promise<TDataAxios<Res>> => {
    const url = '/user/ticket/booked-scheduler'
    return apiClient.post(url, { id })
  },
  buyTicket: <Res>(data: { userId: string, schedulerId: string, seatName: string }): Promise<TDataAxios<Res>> => {
    const url = '/user/ticket/buy'
    return apiClient.post(url, { ...data })
  },
  getTicket: <Res>(state: number, userId: string): Promise<TDataAxios<Res>> => {
    const url = '/user/ticket/state'
    return apiClient.post(url, { state, userId })
  },
  rejectTicket: <Res>(idTicket: string): Promise<TDataAxios<Res>> => {
    const url = '/user/ticket/reject'
    return apiClient.post(url, { id: idTicket })
  },
  getAllSchedule: <Res>(): Promise<TDataAxios<Res>> => {
    const url = '/guest/showtime/getAll'
    return apiClient.get(url)
  },

}

export default userApi
