<template>
  <header class="flex justify-between p-4 bg-blue-600 text-white">
    <NuxtLink to="/products">
      <div class="text-xl font-bold">Products</div>
    </NuxtLink>
    <button
      @click="handleLogout"
      class="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  </header>
</template>

<script setup>
  import { useAuthStore } from "~/stores/auth";
  import { useRouter } from "#app";

  const authStore = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    authStore.clearAuth();
    useCookie("auth_token").value = ""; // Limpa o cookie de token
    router.push("/"); // Redireciona para o login
  };
</script>

<style scoped>
  /* Estilos podem ser personalizados conforme necessário */
</style>
