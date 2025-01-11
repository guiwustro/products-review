<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-semibold text-center mb-6">Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>
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
        <div class="mb-4">
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
        <div class="mb-6">
          <label
            for="confirm_password"
            class="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            v-model="confirmPassword"
            class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-center text-sm">
        Already have an account?
        <NuxtLink to="/" class="text-blue-500 hover:underline">
          Login here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    },
    methods: {
      async handleRegister() {
        const { $axios, $toast } = useNuxtApp();

        if (this.password !== this.confirmPassword) {
          $toast.error("Passwords do not match");

          return;
        }
        try {
          await $axios.post("/register", {
            fullName: this.name,
            email: this.email,
            password: this.password,
          });
          this.$router.push("/");
        } catch (error) {
          $toast.error(
            error?.response?.data?.message ??
              error?.response?.data?.errors?.[0]?.message ??
              "Registration failed. Please try again"
          );
        }
      },
    },
  };
</script>
