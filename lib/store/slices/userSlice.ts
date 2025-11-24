import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  user: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
}

const initialState: UserState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
    removeToken: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const { setToken, removeToken, setUser } = userSlice.actions;
export default userSlice.reducer;

