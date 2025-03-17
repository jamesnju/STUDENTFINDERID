export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api/auth",
    "/api/auth/callback",
    // Protect all routes under `/pro` and `/admin`
    "/main/:path*", // Protects `/pro` and all subroutes like `/pro/dashboard`, `/pro/settings`, etc.
    "/admin/:path*", // Protects `/admin` and all subroutes like `/admin/users`, `/admin/settings`, etc.

    // Protect other specific routes
    "/main",
    "/manageAppointment",
    "/report",
    "/serviceManagement",
    "/appointment",
    "/book",
    "/dashboard",
    "/managepayment",
  ],
};
