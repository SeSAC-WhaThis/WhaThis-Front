import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// Redux Persist 모듈 불러오기
import { persistStore, persistReducer } from "redux-persist";
// 로컬 스토리지 불러오기
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // auth 상태만 유지 (다른 슬라이스가 있다면 여기에 추가)
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist 관련 직렬화 에러 방지
    }),
});

export const persistor = persistStore(store);
export default store;
