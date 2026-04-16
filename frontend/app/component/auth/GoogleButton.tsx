"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { setToken } from "@/lib/auth";

function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    try {
      setLoading(true);
      const res = await api.post("/api/auth/google", {
        idToken: credentialResponse.credential,
      });
      if (res.data?.token) {
        setToken(res.data.token);
        router.push("/");
      }
    } catch (err) {
      console.error("Google login failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button disabled className="google-auth-btn">
        Loading...
        <style jsx>{`
          .google-auth-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: var(--surface-container-lowest, #ffffff);
            color: var(--on-surface);
            font-family: var(--font-display);
            font-size: 0.9375rem;
            font-weight: 600;
            border-radius: var(--radius-full);
            border: 1px solid rgba(178, 172, 169, 0.15);
            cursor: not-allowed;
            opacity: 0.5;
          }
        `}</style>
      </button>
    );
  }

  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google Login Failed")}
        useOneTap={false}
        width="100%"
        text="signin_with"
        shape="pill"
        theme="outline"
        locale="id"
      />
      <style jsx>{`
        .google-btn-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .google-btn-wrapper :global(div[role="button"]) {
          width: 100% !important;
          border-radius: var(--radius-full) !important;
        }
      `}</style>
    </div>
  );
}

export default function GoogleButton() {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  if (!clientId || clientId === "your-google-client-id") {
    return (
      <button disabled className="google-auth-btn">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Sign in with Google</span>
        <style jsx>{`
          .google-auth-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: var(--surface-container-lowest, #ffffff);
            color: var(--on-surface);
            font-family: var(--font-display);
            font-size: 0.9375rem;
            font-weight: 600;
            border-radius: var(--radius-full);
            border: 1px solid rgba(178, 172, 169, 0.15);
            cursor: not-allowed;
            opacity: 0.4;
          }
        `}</style>
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
}
