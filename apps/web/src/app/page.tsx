"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function HomePage() {
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="text-xl font-bold text-gray-900">TurnSwap</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Cómo funciona
            </a>
            <a href="#beneficios" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Beneficios
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6" size="lg">
                <span className="animate-pulse">●</span>
                100% Gratis · Sin límites
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Intercambia turnos con tus compañeros
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600"> al instante</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                La forma más fácil de coordinar cambios de turno entre compañeros.
                Privado, directo y sin complicaciones.
              </p>

              {/* CTA Cards */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card padding="lg" className="text-left h-full hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                        👥
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">¿Te invitaron?</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Únete a tu equipo con el código de invitación
                        </p>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ej: RES123456"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={() => window.location.href = `/join/${joinCode}`}>
                            Unirme
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card padding="lg" className="text-left h-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                        ✨
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">¿Primera vez?</h3>
                        <p className="text-sm text-white/90 mb-4">
                          Crea una comunidad para tu equipo de trabajo
                        </p>
                        <Link href="/login">
                          <Button variant="secondary" fullWidth className="bg-white text-purple-600 hover:bg-white/90">
                            Crear comunidad gratis
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                En 3 pasos simples, coordina tus intercambios de turnos
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  icon: "📝",
                  title: "Publica tu turno",
                  description: "Si no puedes trabajar un día, publica tu turno. Opcionalmente ofrece una compensación para motivar a otros.",
                },
                {
                  step: "2",
                  icon: "🔍",
                  title: "Encuentra intercambios",
                  description: "Explora los turnos que tus compañeros han publicado. Filtra por fecha y ve los detalles.",
                },
                {
                  step: "3",
                  icon: "💬",
                  title: "Coordina directamente",
                  description: "Habla con tu compañero por chat integrado y acordad el intercambio de forma privada.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card padding="lg" className="text-center h-full hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    <Badge className="mb-3" size="sm">Paso {item.step}</Badge>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="beneficios" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ¿Por qué TurnSwap?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Más rápido, más seguro y más fácil que los grupos de WhatsApp
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: "⚡", title: "Rápido", desc: "Publica y recibe respuestas en minutos" },
                { icon: "🔒", title: "Privado", desc: "Solo tus compañeros ven tus turnos" },
                { icon: "💬", title: "Chat integrado", desc: "Coordina todo sin salir de la app" },
                { icon: "🆓", title: "100% Gratis", desc: "Sin límites, sin anuncios, sin planes" },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card padding="lg" className="text-center h-full">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <Card padding="none" className="overflow-hidden bg-gradient-to-br from-purple-600 to-cyan-600 text-white">
                <div className="p-12">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Empieza a intercambiar turnos hoy
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Únete a cientos de equipos que ya coordinan sus turnos de forma fácil y rápida
                  </p>
                  <Link href="/login">
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8">
                      Crear mi comunidad gratis →
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <span className="font-bold text-lg">TurnSwap</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma más fácil para intercambiar turnos entre compañeros de trabajo.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#como-funciona" className="hover:text-white transition">Cómo funciona</a></li>
                <li><a href="#beneficios" className="hover:text-white transition">Beneficios</a></li>
                <li><Link href="/login" className="hover:text-white transition">Crear comunidad</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>hola@turnswap.com</li>
                <li>Madrid, España</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 TurnSwap. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
