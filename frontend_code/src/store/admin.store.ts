import { create } from "zustand";

const useAdminStroe = create((set) => ({
  loading: false,
  search: "",
  page: 1,
  limit: 5,
  count: 0,
  admins: [],

  setLoading: (state: boolean) => set({loading: state}),
  setSearch: (search: string) => set({search: search}),
  setPage: (page: number) => set({page: page}),
  setLimit: (limit: number) => set({limit: limit}),
  setCount: (count: number) => set({count: count}),
  setAdmins: (admins: any[]) => set({admins: admins})
}))

export {useAdminStroe};