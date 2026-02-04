"use client";

import { useState } from "react";
import type { Company } from "../types";
import { useApp } from "../contexts/AppContext";

const provinces = [
  "Barcelona", "Madrid", "Valencia", "Sevilla", "Bizkaia", 
  "Zaragoza", "Málaga", "Murcia"
];

export function CompanySelector() {
  const { 
    companies, 
    activeCompany, 
    setActiveCompany, 
    addCompany, 
    joinCompanyByCode,
    searchCompanies 
  } = useApp();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyProvince, setNewCompanyProvince] = useState(provinces[0]);
  const [joinCode, setJoinCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Company[]>([]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    
    const company = addCompany(newCompanyName.trim(), newCompanyProvince);
    setActiveCompany(company);
    setShowCreateForm(false);
    setNewCompanyName("");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    const success = joinCompanyByCode(joinCode.trim());
    if (success) {
      setShowJoinForm(false);
      setJoinCode("");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchResults(searchCompanies(query));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Mis Empresas</h3>
          <p className="card-subtitle">
            {activeCompany ? `Activa: ${activeCompany.name}` : "Selecciona una empresa"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setShowJoinForm(true)}
          >
            Unirse
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setShowCreateForm(true)}
          >
            Crear
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Buscar empresa por nombre o código..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchQuery && searchResults.length > 0 && (
          <div style={{ 
            marginTop: "8px", 
            background: "#f5f5f7", 
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            {searchResults.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  setActiveCompany(company);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  textAlign: "left",
                  border: "none",
                  background: "transparent",
                  borderBottom: "1px solid #e5e5e5",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 500 }}>{company.name}</div>
                <div style={{ fontSize: "12px", color: "#86868b" }}>
                  Código: {company.code} · {company.province}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Companies List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => setActiveCompany(company)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: activeCompany?.id === company.id ? "#007aff" : "#e5e5e5",
              background: activeCompany?.id === company.id ? "#007aff08" : "#f5f5f7",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                {company.name}
              </div>
              <div style={{ fontSize: "12px", color: "#86868b" }}>
                {company.code} · {company.province}
              </div>
            </div>
            {activeCompany?.id === company.id && (
              <span style={{ fontSize: "12px", color: "#007aff", fontWeight: 500 }}>
                Activa
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Crear empresa</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreateForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre de la empresa</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Ej: Mi Empresa"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Provincia</label>
                  <select
                    className="form-select"
                    value={newCompanyProvince}
                    onChange={(e) => setNewCompanyProvince(e.target.value)}
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinForm && (
        <div className="modal-overlay" onClick={() => setShowJoinForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Unirse a empresa</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowJoinForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleJoin}>
              <div className="modal-body">
                <p style={{ fontSize: "14px", color: "#515154", marginBottom: "16px" }}>
                  Introduce el código de invitación de 7 caracteres (ej: IBE-7843)
                </p>
                <div className="form-group">
                  <label className="form-label">Código de invitación</label>
                  <input
                    type="text"
                    className="form-input"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="XXX-0000"
                    style={{ textTransform: "uppercase", fontSize: "18px", letterSpacing: "0.1em" }}
                    maxLength={8}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowJoinForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Unirse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
