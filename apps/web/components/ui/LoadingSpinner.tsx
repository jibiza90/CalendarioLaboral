"use client";

export function LoadingSpinner() {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "3px solid #e5e7eb",
        borderTopColor: "#4f46e5",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}
