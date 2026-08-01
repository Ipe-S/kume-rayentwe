"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h2 className="font-serif text-2xl font-semibold text-text-main mb-2">
          ¡Cuenta creada!
        </h2>
        <p className="text-text-muted text-sm mb-6">
          Revisá tu email ({email}) para confirmar tu cuenta. Después podrás iniciar sesión.
        </p>
        <Link href="/login" className="btn-primary">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-main mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repetí la contraseña"
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
