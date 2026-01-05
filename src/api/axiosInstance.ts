import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 쿠키/세션 쓰면 필요
});

// ▼▼▼ 요청 인터셉터 추가 (이 부분이 핵심입니다!) ▼▼▼
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져옵니다.
    const token = localStorage.getItem("token");

    // 토큰이 있으면 헤더에 'Bearer {토큰}' 형태로 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
