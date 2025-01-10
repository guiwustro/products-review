<script setup>
  import { useModalStore } from "~/stores/modal";
  import { onMounted } from "vue";
  import AddProductModal from "~/components/AddProductModal";

  const modalStore = useModalStore();
  const { $axios } = useNuxtApp();

  const products = ref([]);
  const loading = ref(true);

  const fetchProducts = async () => {
    try {
      const { data } = await $axios.get("/products");
      products.value = data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchProducts);
</script>

<template>
  <div>
    <Header />
    <div class="p-4">
      <h1 class="text-2xl font-semibold mb-4">Product List</h1>

      <button
        @click="modalStore.openModal"
        class="bg-blue-600 text-white py-2 px-4 rounded mb-4"
      >
        Adicionar Novo Produto
      </button>

      <AddProductModal
        v-if="modalStore.isModalVisible"
        @close="modalStore.closeModal"
        @added="fetchProducts"
      />

      <div v-if="loading" class="text-center">Loading...</div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <NuxtLink :to="`/products/${product.id}`" class="block">
            <h2 class="text-xl font-semibold">{{ product.name }}</h2>
            <p class="text-gray-700">{{ product.description }}</p>
            <div class="mt-2">
              <span class="text-sm text-gray-500">
                Category: {{ product.category }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
