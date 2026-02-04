"use client";

import { useState } from "react";
import type { Department } from "../types";

interface OfferFormProps {
  departments: Department[];
  initialDate: string;
  onSubmit: (data: {
    date: string;
    description: string;
    amount?: string;
    hideName: boolean;
    departmentId?: string;
  }) => void;
  onCancel: () => void;
}

export function OfferForm({ departments, initialDate, onSubmit, onCancel }: OfferFormProps) {
  const [date, setDate] = useState(initialDate);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [hideName, setHideName] = useState(false);
  const [deptId, setDeptId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Describe el turno");
      return;
    }
    if (description.length < 10) {
      setError("Minimo 10 caracteres");
      return;
    }
    setError("");
    onSubmit({
      date,
      description: description.trim(),
      amount: amount.trim() || undefined,
      hideName,
      departmentId: deptId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Fecha</label>
        <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Departamento</label>
        <select className="form-select" value={deptId} onChange={e => setDeptId(e.target.value)}>
          <option value="">General</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Descripcion</label>
        <textarea 
          className="form-textarea" 
          rows={3}
          placeholder="Describe el turno..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Compensacion (opcional)</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Ej: 50€"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className={`toggle ${hideName ? "active" : ""}`} onClick={() => setHideName(!hideName)} />
        <span style={{ fontSize: "14px" }}>Publicar anonimamente</span>
      </div>

      {error && (
        <div style={{ padding: "12px", background: "#fee2e2", color: "#dc2626", borderRadius: "6px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Publicar</button>
      </div>
    </form>
  );
}
