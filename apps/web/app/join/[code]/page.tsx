"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "../../../contexts/AppContext";
import { Card } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { Input } from "../../../src/components/ui/Input";
import Link from "next/link";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code as string;
  const { companies, joinCompanyByCode, user, isAuthenticated } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Find the company by invite code
  const company = companies.find(
    (c) => c.inviteCode.toLowerCase() === code?.toLowerCase()
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!code) {
        setError("Código de invitación inválido");
        return;
      }

      // If user is not authenticated, they need to register first
      if (!isAuthenticated && (!name.trim() || !email.trim())) {
        setError("Por favor, introduce tu nombre y email");
        return;
      }

      // Join the company
      const joinedCompany = joinCompanyByCode(code);

      if (joinedCompany) {
        // Redirect to calendar after successful join
        setTimeout(() => {
          router.push("/calendario");
        }, 1500);
      } else {
        setError("No se encontró ninguna empresa con este código");
      }
    } catch (err) {
      setError("Ocurrió un error al unirse a la empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl">
              T
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Unirse a equipo</h1>
          <p className="text-gray-600 mt-2">
            Te han invitado a unirte a un equipo en TurnSwap
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" padding="lg">
            {/* Company Info */}
            {company ? (
              <div className="mb-6 p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {company.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info" size="sm">
                        {company.location}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {company.category}
                      </Badge>
                      <Badge variant="primary" size="sm" className="font-mono">
                        {company.inviteCode}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">
                      Código inválido
                    </h3>
                    <p className="text-sm text-red-700">
                      No se encontró ningún equipo con el código:{" "}
                      <span className="font-mono font-semibold">{code}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Join Form */}
            {company && (
              <form onSubmit={handleJoin} className="space-y-4">
                {!isAuthenticated && (
                  <>
                    <Input
                      label="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                    <Input
                      label="Tu email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={!company || loading}
                >
                  {loading ? "Uniéndose..." : "Unirse al equipo"}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Al unirte, aceptas que este es un grupo privado entre
                  compañeros de trabajo. TurnSwap no verifica la relación
                  laboral.
                </p>
              </form>
            )}

            {!company && (
              <div className="text-center">
                <Link href="/">
                  <Button variant="primary" fullWidth>
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-700 transition"
            >
              Iniciar sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
