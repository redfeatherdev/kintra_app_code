import { create } from "zustand";

const useDemographcisStore = create((set) => ({
  loading: false,
  data: {
    day: {
      top_heights: { Man: [], Woman: [] },
      top_skin_colors: { Man: [], Woman: [] },
      top_job_prominences: { Man: [], Woman: [] },
      top_yearly_incomes: { Man: [], Woman: [] },
      top_hobbies: { Man: [], Woman: [] },
      top_colleges: [],
      top_cities: [],
    },
    week: {
      top_heights: { Man: [], Woman: [] },
      top_skin_colors: { Man: [], Woman: [] },
      top_job_prominences: { Man: [], Woman: [] },
      top_yearly_incomes: { Man: [], Woman: [] },
      top_hobbies: { Man: [], Woman: [] },
      top_colleges: [],
      top_cities: [],
    },
    month: {
      top_heights: { Man: [], Woman: [] },
      top_skin_colors: { Man: [], Woman: [] },
      top_job_prominences: { Man: [], Woman: [] },
      top_yearly_incomes: { Man: [], Woman: [] },
      top_hobbies: { Man: [], Woman: [] },
      top_colleges: [],
      top_cities: [],
    },
    "6months": {
      top_heights: { Man: [], Woman: [] },
      top_skin_colors: { Man: [], Woman: [] },
      top_job_prominences: { Man: [], Woman: [] },
      top_yearly_incomes: { Man: [], Woman: [] },
      top_hobbies: { Man: [], Woman: [] },
      top_colleges: [],
      top_cities: [],
    },
    year: {
      top_heights: { Man: [], Woman: [] },
      top_skin_colors: { Man: [], Woman: [] },
      top_job_prominences: { Man: [], Woman: [] },
      top_yearly_incomes: { Man: [], Woman: [] },
      top_hobbies: { Man: [], Woman: [] },
      top_colleges: [],
      top_cities: [],
    }
  },
  setLoading: (state: boolean) => set({ loading: state }),
  setData: (data: any) => set({ data: data }),
}))

export { useDemographcisStore }