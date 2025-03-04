<template>
  <section class="bg-gray-100 py-16">
    <div class="container mx-auto px-6 lg:px-20">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-900">Contact Us</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Contact Form -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div v-if="errors.length > 0" class="bg-red-100 text-red-700 p-4 mb-4 rounded">
            <ul>
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </div>

          <form @submit.prevent="send">
            <div class="mb-4">
              <input type="text" v-model="formdata.name"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Full Name" />
            </div>
            <div class="mb-4">
              <input type="email" v-model="formdata.email"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Email" />
            </div>
            <div class="mb-4">
              <input type="text" v-model="formdata.subject"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Subject" />
            </div>
            <div class="mb-4">
              <textarea v-model="formdata.text"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500" rows="4"
                placeholder="Message"></textarea>
            </div>
            <div class="flex justify-center">
              <button
                class="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition flex items-center">
                Send Message
                <div v-if="loading" class="ml-2 border-t-2 border-white border-solid w-4 h-4 animate-spin rounded-full">
                </div>
              </button>
            </div>
          </form>
        </div>

        <!-- Google Map -->
        <div class="rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4853986116514!2d106.76933280928374!3d10.850637657778542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1741080873295!5m2!1svi!2s"
            class="w-full h-full rounded-lg" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();
const errors = ref([]);
const loading = ref(false);

const formdata = reactive({
  name: "",
  email: "",
  subject: "",
  text: ""
});

async function send() {
  try {
    loading.value = true;
    errors.value = [];

    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Your message has been sent successfully!");
  } catch (error) {
    errors.value = ["Please fill out all fields correctly"];
    toast.error("All fields are required");
  } finally {
    loading.value = false;
  }
}
</script>
