"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../contexts/AppContext";

export default function Home() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useApp();

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
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f5f5f7"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e5e5e5",
          borderTopColor: "#007aff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto"
        }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
