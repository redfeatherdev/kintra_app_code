import { create } from "zustand";

const useNotificationStore = create((set) => ({
  loading: false,
  search: "",
  page: 1,
  limit: 5,
  count: 0,
  notifications: [],

  setLoading: (state: boolean) => set({loading: state}),
  setSearch: (search: string) => set({search: search}),
  setPage: (page: number) => set({page: page}),
  setLimit: (limit: number) => set({limit: limit}),
  setCount: (count: number) => set({count: count}),
  setNotifications: (notifications: any[]) => set({notifications: notifications})
}))

export {useNotificationStore};