"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../contexts/AppContext";
import { Sidebar } from "../../components/Sidebar";
import { CompanySelector } from "../../components/CompanySelector";
import { getInitials } from "../../lib/utils";
import { useI18n } from "../../contexts/I18nContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../src/components/ui/Tabs";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { showToast } from "../../src/components/ui/Toast";

const basePlans = [
  { id: "free", price: 0, features: ["profile.plan.free.f1", "profile.plan.free.f2", "profile.plan.free.f3"] },
  { id: "pro", price: 9.99, features: ["profile.plan.pro.f1", "profile.plan.pro.f2", "profile.plan.pro.f3", "profile.plan.pro.f4", "profile.plan.pro.f5"] },
  { id: "business", price: 29.99, features: ["profile.plan.business.f1", "profile.plan.business.f2", "profile.plan.business.f3", "profile.plan.business.f4", "profile.plan.business.f5"] },
];

export default function PerfilPage() {
  const { user, isAuthenticated, logout, updateUser } = useApp();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"general" | "empresas" | "suscripcion">("general");

  const subscriptionPlans = useMemo(() => basePlans.map((plan) => ({
    ...plan,
    name: t(`profile.plan.${plan.id}.name`),
    features: plan.features.map((key) => t(key)),
  })), [t]);

  const handleSubscribe = (planId: string) => {
    // Aquí iría la integración con Stripe/PayPal
    updateUser({ subscription: planId as any });
    showToast.success(t("profile.subscribe.toast", { plan: t(`profile.plan.${planId}.name`) }));
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Card variant="elevated" padding="none">
            <EmptyState
              icon="🔐"
              title={t("profile.login.title")}
              description={t("profile.login.desc")}
            />
          </Card>
        </main>
      </div>
    );
  }

  const currentPlan = subscriptionPlans.find((p) => p.id === user.subscription) || subscriptionPlans[0];

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              {t("profile.title")}
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {t("profile.subtitle")}
            </p>
          </motion.div>

          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" padding="lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
                    {user.name}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-2">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user.subscription === "pro" || user.subscription === "business" ? "primary" : "default"}
                      size="sm"
                    >
                      {currentPlan.name}
                    </Badge>
                    {(user.subscription === "pro" || user.subscription === "business") && (
                      <span className="text-xl">⭐</span>
                    )}
                  </div>
                </div>
                <Button variant="secondary" onClick={logout} className="w-full sm:w-auto">
                  {t("profile.logout")}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList>
                <TabsTrigger value="general">{t("profile.tabs.general")}</TabsTrigger>
                <TabsTrigger value="empresas">{t("profile.tabs.companies")}</TabsTrigger>
                <TabsTrigger value="suscripcion">{t("profile.tabs.subscription")}</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general">
                <Card variant="elevated" padding="lg">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                    {t("profile.personal.title")}
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label={t("profile.personal.name")}
                      value={user.name}
                      readOnly
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={user.email}
                      readOnly
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Companies Tab */}
              <TabsContent value="empresas">
                <CompanySelector />
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="suscripcion">
                <div className="space-y-6">
                  {/* Current Plan Info */}
                  <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                      {t("profile.subscription.current", { plan: currentPlan.name })}
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
                      {currentPlan.price === 0
                        ? t("profile.subscription.free")
                        : t("profile.subscription.paid", { price: String(currentPlan.price) })}
                    </p>
                  </Card>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan, index) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          variant={user.subscription === plan.id ? "elevated" : "default"}
                          padding="lg"
                          className={`h-full flex flex-col ${
                            user.subscription === plan.id
                              ? "ring-2 ring-[var(--color-brand-primary)] shadow-lg"
                              : ""
                          } ${plan.id !== "free" ? "bg-gradient-to-br from-purple-500/5 to-cyan-500/5" : ""}`}
                        >
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                              {plan.name}
                            </h4>
                            <div className="mb-4">
                              <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                                €{plan.price}
                              </span>
                              <span className="text-[var(--color-text-secondary)]">/mes</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                                  <span className="text-[var(--color-success)] mt-0.5">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {user.subscription === plan.id ? (
                            <Button variant="secondary" fullWidth disabled>
                              {t("profile.subscription.currentButton")}
                            </Button>
                          ) : (
                            <Button
                              variant={plan.id === "free" ? "ghost" : "primary"}
                              fullWidth
                              onClick={() => handleSubscribe(plan.id)}
                            >
                              {plan.price === 0
                                ? t("profile.subscription.select")
                                : t("profile.subscription.subscribe")}
                            </Button>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
