// app/routes.ts
import {
  type RouteConfig,
  index,
  route,
  prefix,
  layout,
} from "@react-router/dev/routes";

const relative = (base: string) => (path: string) => `${base}/${path}`;

const dashboardDir = relative("routes/dashboard");
const productsDir = relative("routes/dashboard/products");
const categoriesDir = relative("routes/dashboard/categories");
const articlesDir = relative("routes/articles");
const profileDir = relative("routes/dashboard/profile");
const adminDir = relative("routes/dashboard/admin");
const authDir = relative("routes/auth");

export default [
  layout("routes/_layout.tsx", [
    index("routes/_index.tsx"),
    route("article/:slug", articlesDir("[slug]/_index.tsx"))
  ]),

  layout(authDir("_layout.tsx"), [
    ...prefix("auth", [
      route("login", authDir("login.tsx")),
      route("register", authDir("register.tsx")),
      route("logout", authDir("logout.tsx")),
    ])
  ]),

  layout(dashboardDir("_layout.tsx"), [
    ...prefix("dashboard/profile", [
      index(profileDir("_index.tsx")),
      route("edit", profileDir("edit.tsx")),
    ]),

    ...prefix("dashboard/products", [
      index(productsDir("_index.tsx")),
      route("add", productsDir("add.tsx")),
      route(":slug", productsDir("[slug]/_index.tsx")),
      route(":slug/edit", productsDir("[slug]/edit.tsx")),
    ]),

    ...prefix("dashboard/categories", [
      index(categoriesDir("_index.tsx")),
      route("add", categoriesDir("add.tsx")),
      route(":slug/edit", categoriesDir("[slug]/edit.tsx")),
    ]),

    ...prefix("dashboard/orders", [
      route("notifications", dashboardDir("orders/notifications.tsx")),
    ]),

    ...prefix("dashboard/admin", [
      route("users", adminDir("users.tsx")),
    ]),
  ]),
] satisfies RouteConfig;
