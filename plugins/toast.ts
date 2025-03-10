import { defineNuxtPlugin } from "#app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        position: "top-right",
        timeout: 3000, // 3 giây
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: "Vue-Toastification__bounce",
    });
});
