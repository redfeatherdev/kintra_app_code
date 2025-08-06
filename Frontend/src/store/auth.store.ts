import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { email: string; name: string; role: string } | null;
  setAuthenticated: (state: boolean) => void;
  logIn: (token: string, user: any) => void;
  logOut: () => void;
  setUser: (user: any) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,

      setAuthenticated: (state: boolean) => set({ isAuthenticated: state }),
      
      logIn: (token: string, user: any) => set({
        isAuthenticated: true,
        token: token,
        user: user,
      }),

      logOut: () => set({ isAuthenticated: false, token: null, user: null }),

      setUser: (user: any) => set({ user: user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useAuthStore };







// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// const useAuthStore = create(persist(
//   (set) => ({
//     isAuthenticated: false,
//     token: null,
//     user: null,

//     setAuthenticated: (state: boolean) => set({ isAuthenticated: state }),
//     logIn: (token: string) => set({ isAuthenticated: true, token: token }),
//     logOut: () => set({ isAuthenticated: false, token: null, user: null }),
//     setUser: (user: any) => set({ user: user })
//   }),
//   {
//     name: 'auth-storage',
//     storage: createJSONStorage(() => localStorage)
//   }
// ))

// export { useAuthStore }