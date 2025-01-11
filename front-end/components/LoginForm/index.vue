<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-semibold text-center mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
      <p class="mt-4 text-center text-sm">
        Don't have an account?
        <NuxtLink to="/register" class="text-blue-500 hover:underline">
          Register here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from "#app";
  import { useAuthStore } from "~/stores/auth";

  const email = ref("");
  const password = ref("");
  const router = useRouter();
  const authStore = useAuthStore();

  const authTokenCookies = useCookie("auth_token");
  const user = useCookie("user");
  const productsWithReview = useCookie("products_review");

  const handleLogin = async () => {
    const { $axios, $toast } = useNuxtApp();

    try {
      const response = await $axios.post("/login", {
        email: email.value,
        password: password.value,
      });

      const token = response.data.token.token;
      const reviews = response.data.user.reviews;

      productsWithReview.value = JSON.stringify(
        reviews.map((review) => review.productId)
      );
      user.value = JSON.stringify(response.data.user);

      authTokenCookies.value = token;

      authStore.setToken(token);
      authStore.setUser(response.data.user);

      await router.push("/products");
    } catch (error) {
      $toast.error("Invalid credentials");
    }
  };
</script>
