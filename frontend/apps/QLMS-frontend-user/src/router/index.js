import { createWebHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginForm from "@/components/auth/LoginForm.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresGuest: true }, // Chỉ truy cập khi chưa đăng nhập
  },
  {
    path: "/sach",
    name: "sach.list",
    component: () => import("../views/SachListView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
    meta: { requiresAuth: true }, // BẮT BUỘC ĐĂNG NHẬP
  },
  // Thêm các routes khác (Đăng ký, Chi tiết sách, Mượn sách,...)
  // ...
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Thêm Navigation Guard (TÙY CHỌN, CÓ THỂ LÀM SAU) để kiểm tra trạng thái đăng nhập
// router.beforeEach(...)

export default router;
