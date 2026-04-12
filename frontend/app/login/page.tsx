"use client";

import { Suspense } from "react";
import AuthLayout from "@/app/component/auth/AuthLayout";
import LoginForm from "@/app/component/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout activeTab="login">
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--on-surface-variant)" }}>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}