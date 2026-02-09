"use client";

import { ReactNode } from "react";
import { I18nProvider } from "../contexts/I18nContext";
import { AppProvider } from "../contexts/AppContext";
import { ToastProvider } from "../src/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AppProvider>
        {children}
        <ToastProvider />
      </AppProvider>
    </I18nProvider>
  );
}
