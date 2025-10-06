import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import HomeView from "@/views/HomeView.vue";

import DocGiaList from "@/views/docgia/DocGiaList.vue";
import DocGiaAdd from "@/views/docgia/DocGiaAdd.vue";
import DocGiaEdit from "@/views/docgia/DocGiaEdit.vue";

import NhaXuatBanList from "@/views/nhaxuatban/NhaXuatBanList.vue";
import NhaXuatBanAdd from "@/views/nhaxuatban/NhaXuatBanAdd.vue";
import NhaXuatBanEdit from "@/views/nhaxuatban/NhaXuatBanEdit.vue";

import SachList from "@/views/sach/SachList.vue";
import SachAdd from "@/views/sach/SachAdd.vue";
import SachEdit from "@/views/sach/SachEdit.vue";

import NhanVienList from "@/views/nhanvien/NhanVienList.vue";
import NhanVienAdd from "@/views/nhanvien/NhanVienAdd.vue";
import NhanVienEdit from "@/views/nhanvien/NhanVienEdit.vue";

import TheoDoiMuonSachList from "@/views/theodoimuonsach/TheoDoiMuonSachList.vue";
import TheoDoiMuonSachAdd from "@/views/theodoimuonsach/TheoDoiMuonSachAdd.vue";
import TheoDoiMuonSachEdit from "@/views/theodoimuonsach/TheoDoiMuonSachEdit.vue";

import ThongKeView from "@/views/ThongKeView.vue";
const routes = [
  // ROUTE TRANG CHỦ
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  // Các routes độc giả
  {
    path: "/docgia",
    name: "docgia.list",
    component: DocGiaList,
    meta: { requiresAuth: true },
  },
  {
    path: "/docgia/add",
    name: "docgia.add",
    component: DocGiaAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/docgia/:id",
    name: "docgia.edit",
    component: DocGiaEdit,
    props: true,
    meta: { requiresAuth: true },
  },
  // CÁC ROUTES NXB
  {
    path: "/nhaxuatban",
    name: "nxb.list",
    component: NhaXuatBanList,
    meta: { requiresAuth: true },
  },
  {
    path: "/nhaxuatban/add",
    name: "nxb.add",
    component: NhaXuatBanAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/nhaxuatban/:id",
    name: "nxb.edit",
    component: NhaXuatBanEdit,
    props: true,
    meta: { requiresAuth: true },
  },

  // các routes nhân viên
  {
    path: "/nhanvien",
    name: "nhanvien.list",
    component: NhanVienList,
    meta: { requiresAuth: true },
  },
  {
    path: "/nhanvien/add",
    name: "nhanvien.add",
    component: NhanVienAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/nhanvien/:id",
    name: "nhanvien.edit",
    component: NhanVienEdit,
    props: true,
    meta: { requiresAuth: true },
  },
  // Các routes sách
  {
    path: "/sach",
    name: "sach.list",
    component: SachList,
    meta: { requiresAuth: true },
  },
  {
    path: "/sach/add",
    name: "sach.add",
    component: SachAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/sach/:id",
    name: "sach.edit",
    component: SachEdit,
    props: true,
    meta: { requiresAuth: true },
  },

  // Các routes THEO DÕI MƯỢN SÁCH
  {
    path: "/theodoimuonsach",
    name: "theodoimuonsach.list",
    component: TheoDoiMuonSachList,
    meta: { requiresAuth: true },
  },
  {
    path: "/theodoimuonsach/add",
    name: "theodoimuonsach.add",
    component: TheoDoiMuonSachAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/theodoimuonsach/edit/:id",
    name: "theodoimuonsach.edit",
    component: TheoDoiMuonSachEdit,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/thongke",
    name: "thongke",
    component: ThongKeView,
    meta: {
      requiresAuth: true,
      roles: ["Admin", "QuanLy"],
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isLoggedIn;

  // SỬ DỤNG 'to.matched.some' để kiểm tra thuộc tính 'requiresAuth'
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Kiểm tra route đích yêu cầu xác thực
  if (requiresAuth) {
    if (isAuthenticated) {
      // đã đăng nhập -> cho phép đi tiếp
      next();
    } else {
      // chưa đăng nhập -> Chuyển hướng về trang đăng nhập
      next({ name: "login" });
    }
    s;
  } else {
    // các route không yêu cầu xác thực (Login, Register, Home) -> Cho phép đi tiếp
    next();
  }
});

export default router;
