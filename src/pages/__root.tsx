import { Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { AuthContext } from "../auth/auth";

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = rootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
});
