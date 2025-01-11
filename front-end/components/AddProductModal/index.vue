<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-xl font-semibold mb-4">Add new product</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block font-medium mb-1">Product name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded p-2"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">
            {{ errors.name }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Description</label>
          <textarea
            v-model="form.description"
            class="w-full border rounded p-2"
            :class="{ 'border-red-500': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">
            {{ errors.description }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Category</label>
          <input
            v-model="form.category"
            type="text"
            class="w-full border rounded p-2"
            :class="{ 'border-red-500': errors.category }"
          />
          <p v-if="errors.category" class="text-red-500 text-sm mt-1">
            {{ errors.category }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Image (optional)</label>
          <input
            @change="handleImageUpload"
            type="file"
            class="w-full border rounded p-2"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="modalStore.closeModal()"
            class="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { useModalStore } from "~/stores/modal";
  import { ref } from "vue";

  const modalStore = useModalStore();

  const form = ref({
    name: "",
    description: "",
    category: "",
    image: null,
  });

  const errors = ref({});
  const emit = defineEmits(["added"]); // Define o evento 'added'

  const validateForm = () => {
    errors.value = {};
    if (!form.value.name) {
      errors.value.name = "Campo obrigatório";
    }
    if (!form.value.description) {
      errors.value.description = "Campo obrigatório";
    }
    if (!form.value.category) {
      errors.value.category = "Campo obrigatório";
    }
    return Object.keys(errors.value).length === 0;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    form.value.image = file || null;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("description", form.value.description);
    formData.append("category", form.value.category);
    if (form.value.image) {
      formData.append("image", form.value.image);
    }

    try {
      await useNuxtApp().$axios.post("/products", formData);

      emit("added");

      modalStore.closeModal();
      form.value = { name: "", description: "", category: "", image: null };
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };
</script>

<style scoped>
  .border-red-500 {
    border-color: #f56565; /* Red for error */
  }
  .text-red-500 {
    color: #f56565; /* Red for error messages */
  }
</style>
