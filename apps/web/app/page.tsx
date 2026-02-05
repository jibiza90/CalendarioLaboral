"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../contexts/AppContext";
import { useI18n } from "../contexts/I18nContext";

export default function Home() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useApp();
  const { t } = useI18n();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/calendario");
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="splash-screen">
      <div className="loading-spinner" aria-label={t("common.loading")}></div>
    </div>
  );
}
