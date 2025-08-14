import { create } from "zustand";

const useUserStore = create((set) => ({
  loading: false,
  search: "",
  page: 1,
  limit: 5,
  count: 0,
  users: [],
  filteredUsers: [],
  regions: [],

  setLoading: (state: boolean) => set({ loading: state }),
  setSearch: (search: string) => set({ search: search }),
  setPage: (page: number) => set({ page: page }),
  setLimit: (limit: number) => set({ limit: limit }),
  setCount: (count: number) => set({ count: count }),
  setUsers: (users: any[]) => set({ users: users }),
  setFilteredUsers: (users: any[]) => set({filteredUsers: users}),
  setRegions: (regions: any[]) => set({regions: regions})
}));

export { useUserStore };