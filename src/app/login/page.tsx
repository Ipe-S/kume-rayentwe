import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Ingresá a tu cuenta de Küme Rayentwe.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl" aria-hidden="true">🌿</span>
          <h1 className="font-serif text-3xl font-bold text-text-main mt-3">
            Bienvenido de vuelta
          </h1>
          <p className="text-text-muted mt-2">
            Ingresá a tu cuenta para acceder al planificador de huerto.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
