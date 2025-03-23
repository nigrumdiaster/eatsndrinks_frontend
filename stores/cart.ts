import { defineStore } from "pinia";
import { useApiFetch } from "@/composables/useApi";
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_mainimage: string;
  product_price:number;
  quantity: number;
}

interface Cart {
  id: number;
  user: number;
  items: CartItem[];
}

const toast = useToast();

export const useCartStore = defineStore("cart", () => {
  const cart = reactive<Cart>({
    id: 0,
    user: 0,
    items: [],
  }); // ✅ Khởi tạo với giá trị mặc định thay vì null

  const loading = ref(false);

  // ✅ Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalItems = computed(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  });

  // ✅ Lấy dữ liệu giỏ hàng từ API
  const fetchCart = async () => {
    try {
      loading.value = true;
      const data = await useApiFetch<Cart>("/cart/user/cart/");
      console.log("Cart:", data);

      if (data) {
        Object.assign(cart, data); // ✅ Cập nhật dữ liệu mà không thay đổi reactive object
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    const authStore = useAuthStore();
  
    // ✅ Kiểm tra nếu chưa đăng nhập
    if (!authStore.accessToken) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
  
    try {
      const response = await useApiFetch<{ 
        id: number; 
        product: number; 
        product_name: string; 
        product_mainimage: string; 
        product_price: number; 
        quantity: number 
      }>("/cart/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, quantity }),
      });
  
      if (response) {
        console.log("Sản phẩm đã thêm vào giỏ hàng:", response);
  
        // ✅ Cập nhật giỏ hàng
        const existingItem = cart.items.find((item) => item.product === response.product);
        if (existingItem) {
          existingItem.quantity += response.quantity;
        } else {
          cart.items.push(response);
        }
  
        // ✅ Hiển thị thông báo thành công
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
    }
  };
  


  // ✅ Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (itemId: number) => {
    try {
      await useApiFetch(`/cart/remove/${itemId}/`, { method: "DELETE" });

      cart.items = cart.items.filter((item) => item.id !== itemId); // ✅ Cập nhật lại danh sách sản phẩm
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ✅ Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      await useApiFetch("/cart/user/cart/", { method: "DELETE" });

      // ✅ Giữ nguyên id và user, chỉ xóa sản phẩm
      cart.items = [];
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return { cart, loading, totalItems, fetchCart, addToCart, removeItem, clearCart };
});
