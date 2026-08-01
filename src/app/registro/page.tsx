import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Registrate en Küme Rayentwe para planificar tu huerto.",
};

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl" aria-hidden="true">🌱</span>
          <h1 className="font-serif text-3xl font-bold text-text-main mt-3">
            Crear tu cuenta
          </h1>
          <p className="text-text-muted mt-2">
            Registrate para usar el planificador de huerto y guardar tus cultivos.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
