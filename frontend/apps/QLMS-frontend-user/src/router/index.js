import { createWebHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

const DOCGIA_TOKEN_KEY = "docgiaToken";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/sach",
    name: "sach.list",
    component: () => import("@/views/readers/BookListView.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  {
    path: "/reader/books/:id",
    name: "reader.book-detail",
    component: () => import("@/views/readers/BookDetailView.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  {
    path: "/reader/checkout/:id",
    name: "reader.checkout-book",
    component: () => import("@/views/muonsach/MuonSachAdd.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  // --- đảm bảo có route cho /reader/borrowed ---
  {
    path: "/reader/borrowed",
    name: "borrowed.list",
    component: () => import("@/views/muonsach/MuonSachList.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  {
    path: "/docgia/profile",
    name: "docgia.profile",
    component: () => import("@/views/docgia/ProfileView.vue"),
    meta: { requiresAuth: true, role: "docgia" },
  },
  // fallback
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

function isTokenPresent(raw) {
  return raw && raw !== "null" && raw !== "undefined" && raw !== "";
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem(DOCGIA_TOKEN_KEY);

//   console.log(
//     "[ROUTER GUARD] to:",
//     to.name,
//     "requiresAuth:",
//     !!to.meta.requiresAuth,
//     "requiresGuest:",
//     !!to.meta.requiresGuest,
//     "tokenPresent:",
//     !!token
//   );

//   const requiresAuth = !!to.meta.requiresAuth;
//   const requiresGuest = !!to.meta.requiresGuest;

//   if (requiresAuth && !token) {
//     // eslint-disable-next-line no-console
//     console.warn("[ROUTER GUARD] redirect -> login (no token)");
//     return next({ name: "login" });
//   }

//   if (token && requiresGuest) {
//     // eslint-disable-next-line no-console
//     console.warn("[ROUTER GUARD] already logged in -> redirect to home");
//     return next({ name: "home" });
//   }

//   return next();
// });
router.beforeEach((to, from, next) => {
  const raw = localStorage.getItem(DOCGIA_TOKEN_KEY);
  const tokenPresent = isTokenPresent(raw);

  console.log(
    "[ROUTER GUARD] to:",
    to.name,
    "requiresAuth:",
    !!to.meta.requiresAuth,
    "tokenPresent:",
    tokenPresent
  );

  if (to.meta.requiresAuth && !tokenPresent) {
    // đảm bảo xóa token rác nếu có
    localStorage.removeItem(DOCGIA_TOKEN_KEY);
    return next({ name: "login" });
  }

  if (tokenPresent && to.meta.requiresGuest) {
    return next({ name: "home" });
  }

  return next();
});

export default router;
