import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.apiBase,
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = useCookie("auth_token").value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
