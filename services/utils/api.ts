import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      const refresh =
        typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

      if (refresh) {
        try {
          const { data } = await axios.post<{
            access: string;
          }>(`${process.env.NEXT_PUBLIC_AUTH_API}/token/refresh/`, { refresh });

          if (typeof window !== "undefined") {
            localStorage.setItem("access", data.access);
          }

          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          if (typeof window !== "undefined") {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
