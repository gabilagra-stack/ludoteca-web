import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";
import type { JSX } from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

export function RoleRoute({ children, role }: { children: JSX.Element; role: string }) {
  const user = useAuthStore((s) => s.user);
  return user?.roles?.includes(role) ? children : <Navigate to="/" replace />;
}