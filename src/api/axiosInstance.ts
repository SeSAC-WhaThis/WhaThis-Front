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
    // 디버깅: 에러 응답 상세 확인
    console.error("API 요청 에러:", error);
    if (error.response) {
      console.error("서버 응답 데이터:", error.response.data);
    }

    // 백엔드 에러 메시지 추출 (다양한 구조 대응)
    const data = error.response?.data;
    const message =
      data?.message ||
      (typeof data?.error === "string" ? data.error : data?.error?.message) ||
      (typeof data === "string" ? data : null);

    if (message) {
      const method = error.config?.method?.toLowerCase();
      // POST, PUT, PATCH, DELETE 요청에 대해서만 팝업 표시
      if (method && ["post", "put", "patch", "delete"].includes(method)) {
        alert(message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
