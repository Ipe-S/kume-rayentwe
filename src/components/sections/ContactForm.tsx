"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Simulación de envío (reemplazar con fetch a tu endpoint real)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h3 className="font-serif text-2xl font-semibold text-green-800 mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-green-700 text-sm">
          Gracias por contactarnos. Te responderemos en menos de 24 horas.
        </p>
        <button
          className="mt-6 btn-primary"
          onClick={() => {
            setStatus("idle");
            setForm({ nombre: "", email: "", mensaje: "" });
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-text-main mb-1"
        >
          Nombre completo <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autoComplete="name"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Juan Pérez"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-main mb-1"
        >
          Email <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="juan@ejemplo.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-text-main mb-1"
        >
          Mensaje <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Contanos sobre tu espacio y qué tenés en mente…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando…
          </span>
        ) : (
          "Enviar mensaje"
        )}
      </button>
    </form>
  );
}
