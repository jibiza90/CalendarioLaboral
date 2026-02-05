"use client";

import { useState } from "react";
import type { Department } from "../types";
import { useI18n } from "../contexts/I18nContext";

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
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError(t("offer.form.error.desc"));
      return;
    }
    if (description.length < 10) {
      setError(t("offer.form.error.min"));
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
        <label className="form-label">{t("offer.form.date")}</label>
        <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">{t("offer.form.department")}</label>
        <select className="form-select" value={deptId} onChange={e => setDeptId(e.target.value)}>
          <option value="">{t("offer.department.general")}</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">{t("offer.form.description")}</label>
        <textarea 
          className="form-textarea" 
          rows={3}
          placeholder={t("offer.form.placeholder")}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t("offer.form.compensation")}</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder={t("offer.form.compensation.placeholder")}
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className={`toggle ${hideName ? "active" : ""}`} onClick={() => setHideName(!hideName)} />
        <span style={{ fontSize: "14px" }}>{t("offer.form.hideName")}</span>
      </div>

      {error && (
        <div style={{ padding: "12px", background: "#fee2e2", color: "#dc2626", borderRadius: "6px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>{t("common.cancel")}</button>
        <button type="submit" className="btn btn-primary">{t("offer.form.submit")}</button>
      </div>
    </form>
  );
}
