import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../contracts/user";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

interface UserToken {
  token: string | null;
  tokenIssuedAt: number | null;
  updateUserToken: (t: string) => void;
}
interface UserSlice {
  user: IUser | null;
  updateUser: (u: IUser) => void;
}
interface AppSlice {
  activeTermId: number | null;
  activeSessionId: number | null;
  activeBranchId: number | null;
  updateActiveTerm: (termId: number | null, sessionId?: number | null) => void;
  updateActiveBranch: (branchId: number | null) => void;
}

export const createUserToken: StateCreator<UserToken> = (set, get) => ({
  token: null,
  tokenIssuedAt: null,
  updateUserToken: (t) => {
    set({ token: t, tokenIssuedAt: t ? Date.now() : null });
  },
});

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  user: null,
  updateUser: (user) => {
    set({ user });
  },
});

export const createAppSlice: StateCreator<AppSlice> = (set, get) => ({
  activeTermId: null,
  activeSessionId: null,
  activeBranchId: null,
  updateActiveTerm: (termId, sessionId) => {
    set({ activeTermId: termId, activeSessionId: sessionId ?? get().activeSessionId });
  },
  updateActiveBranch: (branchId) => {
    set({ activeBranchId: branchId });
  },
});

export const combineStore = create<UserToken & UserSlice & AppSlice>()(
  persist(
    (...a) => ({
      ...createUserToken(...a),
      ...createUserSlice(...a),
      ...createAppSlice(...a),
    }),
    {
      name: "virtuo-auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        tokenIssuedAt: state.tokenIssuedAt,
        user: state.user,
        activeTermId: state.activeTermId,
        activeSessionId: state.activeSessionId,
        activeBranchId: state.activeBranchId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.tokenIssuedAt && Date.now() - state.tokenIssuedAt > THREE_DAYS_MS) {
          state.token = null;
          state.tokenIssuedAt = null;
          state.user = null;
        }
      },
    },
  ),
);
