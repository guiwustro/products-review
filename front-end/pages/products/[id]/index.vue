<template>
  <div>
    <Header />
    <div class="p-4">
      <div v-if="loading" class="text-center">Loading...</div>

      <div v-if="product && !loading" class="bg-white p-4 rounded-lg shadow-md">
        <!-- Produto Detalhado -->
        <div class="flex flex-col items-center mb-6">
          <h1 class="text-3xl font-semibold">{{ product.name }}</h1>
          <p class="text-gray-600 mt-2">{{ product.description }}</p>
          <p class="mt-4 text-sm text-gray-500">
            Category: {{ product.category }}
          </p>
          <p class="text-sm text-gray-400 mt-2">
            Created at: {{ formatDate(product.createdAt) }}
          </p>
        </div>

        <!-- Formulário para adicionar comentários -->
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

        <!-- Comentários -->
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
                <!-- Estrelas -->
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
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router"; // Para pegar o ID da rota

  const route = useRoute();
  const product = ref(null);
  const reviews = ref([]);
  const loading = ref(true);
  const imageBase64 = ref("");
  const isNotCommented = ref(true);

  const newReview = ref({
    rating: 0,
    comment: "",
  });

  const productsAlreadyCommented = useCookie("products_review");

  isNotCommented.value = productsAlreadyCommented.value.every(
    (id) => id !== +route.params.id
  );

  const { $axios, $toast } = useNuxtApp();

  // Função para buscar o produto pelo ID
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

  // Função para buscar os reviews do produto
  const fetchReviews = async (id) => {
    try {
      const { data } = await $axios.get(`/products/${id}/reviews`);
      reviews.value = data;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  // Função para enviar um novo comentário
  const submitReview = async () => {
    if (!newReview.value.rating || !newReview.value.comment) {
      alert("Please provide a rating and a comment.");
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
      console.log(productsAlreadyCommented.value);

      fetchReviews(route.params.id);
      newReview.value = { rating: 0, comment: "" };
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // Definir o rating escolhido
  const setRating = (rating) => {
    newReview.value.rating = rating;
  };

  // Formatação de data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Carregar as informações do produto e reviews ao montar o componente
  onMounted(() => {
    const productId = route.params.id;
    fetchProduct(productId);
    fetchReviews(productId);
  });
</script>

<style scoped>
  /* Estilos adicionais */
</style>
