export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Se o usuário não estiver autenticado e tentando acessar páginas protegidas
  if (!authStore.token && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login"); // Redireciona para a página de login
  }
});
