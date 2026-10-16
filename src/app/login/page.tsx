"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      callbackURL: "/",
    });

    if (result.error) {
      setError(result.error.message ?? "بيانات الدخول غير صحيحة");
      setIsLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md border border-black/10 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-emerald-800">يسلم بابا</p>
        <h1 className="mb-2 text-3xl font-bold">تسجيل الدخول</h1>
        <p className="mb-8 text-sm text-foreground/60">ادخل إلى حسابك بالبريد وكلمة المرور.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            البريد الإلكتروني
            <input className="mt-2 w-full border border-black/15 px-3 py-3" name="email" type="email" required />
          </label>
          <label className="block text-sm font-medium">
            كلمة المرور
            <input className="mt-2 w-full border border-black/15 px-3 py-3" name="password" type="password" required />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="w-full bg-emerald-900 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={isLoading} type="submit">
            {isLoading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
        <p className="mt-6 text-sm text-foreground/70">
          ليس لديك حساب؟ <Link className="font-semibold text-emerald-800" href="/register">إنشاء حساب</Link>
        </p>
      </section>
    </main>
  );
}
