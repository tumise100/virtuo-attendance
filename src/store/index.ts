import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ILecturer } from "../contracts/user";

interface UserToken {
  token: string | null;
  updateUserToken: (t: string) => void;
}
interface UserSlice {
  user: ILecturer | null;
  updateUser: (u: ILecturer) => void;
}

export const createUserToken: StateCreator<UserToken> = (set, get) => ({
  token: null,
  updateUserToken: (t) => {
    set({ token: t });
  },
});

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  user: null,
  updateUser: (user) => {
    set({ user });
  },
});

// export const createLecturerSlice: StateCreator<UserSlice> = (set, get) => ({
//   user: null,
//   updateUser: (user) => {
//     set({ user });
//   },
// });

export const combineStore = create<UserToken & UserSlice>()((...a) => ({
  ...createUserToken(...a),
  ...createUserSlice(...a),
}));

// export const combineStore = create<UserToken & UserSlice>()(
//   persist(
//     (...a) => ({
//       ...createUserToken(...a),
//       ...createUserSlice(...a),
//     }),
//     // { name: "new-store" }
//     { name: "new-store", storage: createJSONStorage(() => AsyncStorage) }
//   )
// );
