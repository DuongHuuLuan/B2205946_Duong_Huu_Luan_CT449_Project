import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresGuest: true }, // Chỉ truy cập khi chưa đăng nhập
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { requiresGuest: true }, // Chỉ truy cập khi đăng ký
  },
  {
    path: "/sach",
    name: "sach.list",
    component: () => import("../views/readers/BookListView.vue"),
  },
  {
    path: "/reader/books/:id",
    name: "reader.book-detail",
    component: () => import("@/views/readers/BookDetailView.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
    meta: { requiresAuth: true }, // BẮT BUỘC ĐĂNG NHẬP
  },
  {
    path: "/borrow",
    name: "borrow-list",
    component: () => import("@/views/muonsach/BorrowListView.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  {
    path: "/borrow/new",
    name: "borrow-create",
    component: () => import("@/views/muonsach/BorrowCreateView.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Thêm Navigation Guard (Tùy chọn: Để kiểm tra đăng nhập)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Import useAuthStore

  // Kiểm tra xem route có yêu cầu đăng nhập không VÀ người dùng CHƯA đăng nhập
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: "login" }); // Chuyển hướng về trang đăng nhập
  } else {
    next(); // Tiếp tục
  }
});

export default router;
