import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 쿠키/세션 쓰면 필요
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가 (에러 핸들링)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 백엔드에서 에러 메시지를 보냈을 경우 (message 필드 확인)
    if (error.response && error.response.data && error.response.data.message) {
      const { method } = error.config;
      // POST, PUT, PATCH, DELETE 요청에 대해서만 팝업 표시
      if (["post", "put", "patch", "delete"].includes(method)) {
        alert(error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
