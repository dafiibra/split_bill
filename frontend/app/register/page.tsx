"use client";

import AuthLayout from "@/app/component/auth/AuthLayout";
import RegisterForm from "@/app/component/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout activeTab="register">
      <RegisterForm />
    </AuthLayout>
  );
}