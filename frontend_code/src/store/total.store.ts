import { create } from 'zustand';

const useTotalStore = create((set) => ({
  loading: false,
  total_count: 0,
  gained_user: {
    last_week: {} as { [key: string]: number },
    last_month: {} as { [key: string]: number },
    last_4_months: {} as { [key: string]: number },
    last_6_months: {} as { [key: string]: number },
    last_year: {} as { [key: string]: number },
  },
  locations: [] as { id: string; latitude: number; longitude: number }[],
  top_locations: [] as { name: string, user_count: number }[],
  top_colleges: [] as { college: string, user_count: number }[],
  recent_users_12h_count: 0,
  recent_users_4h_count: 0,

  setLoading: (state: boolean) => set({ loading: state }),
  setTotalCount: (count: number) => set({ total_count: count }),
  setGainedUser: (users: {
    last_week: { [key: string]: number };
    last_month: { [key: string]: number };
    last_4_months: { [key: string]: number };
    last_6_months: { [key: string]: number };
    last_year: { [key: string]: number }
  }) =>
    set({ gained_user: users }),
  setLocations: (locations: { id: string; latitude: number; longitude: number }[]) =>
    set({ locations }),
  setTopLocations: (top_locations: { name: string, user_count: number }[]) =>
    set({ top_locations }),
  setTopColleges: (top_colleges: { college: string, user_count: number }[]) =>
    set({ top_colleges }),
  setRecentUsers12hCount: (recent_users_12h_count: number) => set({ recent_users_12h_count: recent_users_12h_count }),
  setRecentUsers4hCount: (recent_users_4h_count: number) => set({ recent_users_4h_count: recent_users_4h_count })
}));

export { useTotalStore }