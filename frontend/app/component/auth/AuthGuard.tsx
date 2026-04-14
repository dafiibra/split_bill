"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (requireAuth && !token) {
      router.replace(redirectTo || "/login");
    } else if (!requireAuth && token) {
      router.replace(redirectTo || "/");
    } else {
      setIsAuthorized(true);
    }
    setIsChecking(false);
  }, [requireAuth, redirectTo, router]);

  if (isChecking || !isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)" }}>
        <div style={{ width: "2rem", height: "2rem", border: "3px solid var(--surface-container-highest)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}