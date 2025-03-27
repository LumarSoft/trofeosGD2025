"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Trophy } from "lucide-react";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar el token en cookie
      Cookies.set("auth_token", data.token, { expires: 1 }); // Expira en 1 día

      // Redirigir al dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(
        message || "Credenciales inválidas. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-black/95 p-4">
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-5 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="relative border border-gold/30 rounded-lg p-8 bg-black/80 backdrop-blur-sm shadow-[0_0_35px_rgba(208,177,110,0.15)]">
          {/* Logo o icono decorativo */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="bg-black p-4 rounded-full border border-gold/40 shadow-[0_0_15px_rgba(208,177,110,0.3)]">
              <Trophy className="h-8 w-8 text-gold" />
            </div>
          </div>

          <div className="text-center mb-8 mt-4">
            <h1 className="text-2xl font-bold text-gold mb-2">
              Panel de Administración
            </h1>
            <p className="text-gold-light/70">
              Ingrese sus credenciales para acceder
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gold-light font-medium">
                Email
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light/50 h-4 w-4 group-hover:text-gold transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black/60 border-gold/30 focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_10px_rgba(208,177,110,0.2)]"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gold-light font-medium">
                Contraseña
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light/50 h-4 w-4 group-hover:text-gold transition-colors" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-black/60 border-gold/30 focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_10px_rgba(208,177,110,0.2)]"
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-black font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(208,177,110,0.4)] mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-t-2 border-b-2 border-black rounded-full animate-spin mr-2"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gold/10 text-center text-gold-light/50 text-sm">
            Trofeos GD © {new Date().getFullYear()} - Panel Administrativo
          </div>
        </div>
      </motion.div>
    </div>
  );
}
