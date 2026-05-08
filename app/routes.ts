// app/routes.ts
import {
  type RouteConfig,
  index,
  route,
  prefix,
  layout,
} from "@react-router/dev/routes";

const resolveRoute = (path: string) => `./routes/${path}`;

const dashboardDir = (path: string) => resolveRoute(`dashboard/${path}`);
const productsDir = (path: string) => resolveRoute(`dashboard/products/${path}`);
const categoriesDir = (path: string) => resolveRoute(`dashboard/categories/${path}`);
const articlesDir = (path: string) => resolveRoute(`articles/${path}`);
const notificationsDir = (path: string) => resolveRoute(`notifications/${path}`);
const ordersDir = (path: string) => resolveRoute(`orders/${path}`);
const profileDir = (path: string) => resolveRoute(`profile/${path}`);
const adminDir = (path: string) => resolveRoute(`dashboard/admin/${path}`);
const authDir = (path: string) => resolveRoute(`auth/${path}`);

export default [
  layout(resolveRoute("_layout.tsx"), [
    index(resolveRoute("_index.tsx")),
    ...prefix("article", [
      route(":slug", articlesDir("[slug]/_index.tsx")),
    ]),

    ...prefix("profile", [
        index(profileDir("_index.tsx")),
        route("edit", profileDir("edit.tsx")),
      ]),
    
    ...prefix("notifications", [
      index(notificationsDir("_index.tsx")),
    ]),

    ...prefix("orders", [
      index(ordersDir("_index.tsx")),
    ]),
  ]),

  layout(authDir("_layout.tsx"), [
    ...prefix("auth", [
      route("login", authDir("login.tsx")),
      route("register", authDir("register.tsx")),
      route("logout", authDir("logout.tsx")),
    ]),
  ]),

  layout(dashboardDir("_layout.tsx"), [
    ...prefix("dashboard", [
      index(dashboardDir("_index.tsx")),
  
      ...prefix("products", [
        index(productsDir("_index.tsx")),
        route("add", productsDir("add.tsx")),
        route(":slug", productsDir("[slug]/_index.tsx")),
        route(":slug/edit", productsDir("[slug]/edit.tsx")),
      ]),
  
      ...prefix("categories", [
        index(categoriesDir("_index.tsx")),
        route("add", categoriesDir("add.tsx")),
        route(":slug/edit", categoriesDir("[slug]/edit.tsx")),
      ]),
  
      ...prefix("orders", [
        index(dashboardDir("orders/_index.tsx")),
      ]),
  
      ...prefix("admin", [
        route("users", adminDir("users.tsx")),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
