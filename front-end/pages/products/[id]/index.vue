<template>
  <div>
    <Header />
    <div class="p-4">
      <div v-if="loading" class="text-center">Loading...</div>

      <div v-if="product && !loading" class="bg-white p-4 rounded-lg shadow-md">
        <div
          v-if="product && !loading"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <div class="flex flex-col items-center mb-6">
            <!-- Product Image -->
            <div
              class="w-full max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              <img
                v-if="product.image"
                :src="product.image"
                alt="Product Image"
                class="w-full h-64 object-contain bg-gray-100"
              />
            </div>

            <!-- Product Details -->
            <h1 class="text-3xl font-semibold mt-4 text-center">
              {{ product.name }}
            </h1>
            <p class="text-gray-600 mt-2 text-center">
              {{ product.description }}
            </p>
            <p class="mt-4 text-sm text-gray-500">
              Category: {{ product.category }}
            </p>

            <!-- Média de Avaliações em Estrelas -->
            <div class="mt-4 flex items-center">
              <div class="flex">
                <svg
                  v-for="star in 5"
                  :key="`average-star-${star}`"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="
                    star <= Math.ceil(averageRating)
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                  "
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 15.27l4.15 2.18-1.08-4.69L18 7.24l-4.91-.42L10 2 7.91 6.82 3 7.24l3.93 5.52-1.08 4.69L10 15.27z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="ml-2 text-gray-600 text-sm">
                {{ averageRating.toFixed(1) }} / 5.0
              </span>
            </div>

            <button
              @click="openEditModal"
              v-if="isAdmin"
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit Product
            </button>

            <button
              @click="deleteProduct"
              v-if="isAdmin"
              class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete product
            </button>
          </div>
        </div>

        <!-- Modal -->
        <div
          v-if="showEditModal"
          class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white w-96 p-6 rounded-lg shadow-md">
            <h2 class="text-lg font-semibold mb-4">Edit Product</h2>
            <form @submit.prevent="updateProduct">
              <div class="mb-4">
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  v-model="editProduct.name"
                  type="text"
                  class="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Enter product name"
                />
              </div>
              <div class="mb-4">
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="editProduct.description"
                  rows="3"
                  class="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Enter product description"
                ></textarea>
              </div>
              <div class="mb-4">
                <label
                  for="category"
                  class="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  id="category"
                  v-model="editProduct.category"
                  type="text"
                  class="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Enter product category"
                />
              </div>

              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  @click="closeEditModal"
                  class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="isNotCommented" class="mt-6">
          <h2 class="text-xl font-semibold">Add a Review</h2>
          <form @submit.prevent="submitReview" class="mt-4">
            <div class="flex items-center mb-4">
              <label class="mr-4">Rating:</label>
              <div class="flex">
                <svg
                  v-for="star in 5"
                  :key="`star-form-${star}`"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="
                    star <= newReview.rating
                      ? 'h-6 w-6 cursor-pointer text-yellow-500'
                      : 'h-6 w-6 cursor-pointer text-gray-400'
                  "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  @click="setRating(star)"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 15.27l4.15 2.18-1.08-4.69L18 7.24l-4.91-.42L10 2 7.91 6.82 3 7.24l3.93 5.52-1.08 4.69L10 15.27z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Campo de Comentário -->
            <div class="mb-4">
              <label
                for="comment"
                class="block text-sm font-medium text-gray-700"
              >
                Comment:
              </label>
              <textarea
                id="comment"
                v-model="newReview.comment"
                rows="3"
                class="mt-1 block w-full p-2 border rounded-md"
                placeholder="Write your comment here..."
              ></textarea>
            </div>

            <!-- Botão de Enviar -->
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div v-if="reviews.length > 0" class="mt-8">
          <h2 class="text-2xl font-semibold">Reviews</h2>
          <div
            v-for="review in reviews"
            :key="review.id"
            class="mt-4 p-4 border-b"
          >
            <div class="flex items-center">
              <div class="text-sm font-semibold">
                {{ review.user.fullName }}
              </div>
              <div class="ml-2 text-sm text-gray-500">
                {{ formatDate(review.createdAt) }}
              </div>
            </div>
            <div class="mt-2">
              <div class="flex">
                <svg
                  v-for="star in 5"
                  :key="`star-${review.id}-${star}`"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="
                    star <= review.rating
                      ? 'h-5 w-5 text-yellow-500'
                      : 'h-5 w-5 text-gray-400'
                  "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 15.27l4.15 2.18-1.08-4.69L18 7.24l-4.91-.42L10 2 7.91 6.82 3 7.24l3.93 5.52-1.08 4.69L10 15.27z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="mt-2 text-gray-600">{{ review.comment }}</p>
            </div>
          </div>
        </div>
        <div v-else class="mt-8 text-center text-gray-600">No reviews yet.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    middleware: ["auth"],
  });

  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useRouter } from "#app";

  import { useAuthStore } from "~/stores/auth";

  const authStore = useAuthStore();
  const route = useRoute();
  const router = useRouter();

  const product = ref(null);
  const reviews = ref([]);
  const averageRating = ref(null);
  const loading = ref(true);
  const imageBase64 = ref("");
  const isNotCommented = ref(true);
  const isAdmin = ref(authStore?.user?.isAdmin ?? 0);

  const showEditModal = ref(false);
  const editProduct = ref({
    name: "",
    description: "",
  });

  const newReview = ref({
    rating: 0,
    comment: "",
  });

  const productsAlreadyCommented = useCookie("products_review");

  isNotCommented.value = productsAlreadyCommented.value.every(
    (id) => id !== +route.params.id
  );

  const { $axios, $toast } = useNuxtApp();

  const fetchProduct = async (id) => {
    try {
      const { data } = await $axios.get(`/products/${id}`);
      product.value = data;
      if (data.image) {
        imageBase64.value = btoa(
          String.fromCharCode(...new Uint8Array(data.image.data))
        );
      }
      loading.value = false;
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const fetchReviews = async (id) => {
    try {
      const { data } = await $axios.get(`/products/${id}/reviews`);
      reviews.value = data.reviews;
      averageRating.value = data.averageRating;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const submitReview = async () => {
    if (!newReview.value.rating || !newReview.value.comment) {
      $toast.error("Please provide a rating and a comment.");
      return;
    }

    try {
      await $axios.post(`/products/${route.params.id}/reviews`, {
        rating: newReview.value.rating,
        comment: newReview.value.comment,
      });
      isNotCommented.value = false;
      $toast.success("Review submitted successfully");

      const productsAlreadyCommented = useCookie("products_review");
      productsAlreadyCommented.value = [
        ...productsAlreadyCommented.value,
        +route.params.id,
      ];

      fetchReviews(route.params.id);
      newReview.value = { rating: 0, comment: "" };
    } catch (error) {
      $toast.error("Failed to submit review.");
    }
  };

  const setRating = (rating) => {
    newReview.value.rating = rating;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const openEditModal = () => {
    editProduct.value = {
      name: product.value.name,
      description: product.value.description,
      category: product.value.category,
    };
    showEditModal.value = true;
  };

  const closeEditModal = () => {
    showEditModal.value = false;
  };

  const updateProduct = async () => {
    try {
      await $axios.put(`/products/${route.params.id}`, {
        name: editProduct.value.name,
        description: editProduct.value.description,
        category: editProduct.value.category,
      });
      product.value.name = editProduct.value.name;
      product.value.description = editProduct.value.description;
      product.value.category = editProduct.value.category;
      $toast.success("Product updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Failed to update product:", error);
      $toast.error("Failed to update product.");
    }
  };

  const deleteProduct = async () => {
    try {
      await $axios.delete(`/products/${route.params.id}`);
      $toast.success("Product deleted successfully");
      router.push("/products");
    } catch (error) {
      $toast.error("Product can't be deleted");
    }
  };

  onMounted(() => {
    const productId = route.params.id;
    fetchProduct(productId);
    fetchReviews(productId);
  });
</script>
