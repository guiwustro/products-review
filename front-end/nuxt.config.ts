// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "vue3-toastify/dist/index.css"],
  plugins: [
    "~/plugins/toast.ts", // Path to your plugin
  ],
  modules: ["@pinia/nuxt"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: "2025-01-08",
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:9229/",
    },
  },
});
