import type { AuthResponse } from "../store/authSlice";
import { dummyUser } from "./dummyUser";

export const dummyAuthResponse: AuthResponse = {
  user: dummyUser,
  token: "dummy-token",
};
