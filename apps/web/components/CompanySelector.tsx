"use client";

import { useMemo, useState } from "react";
import type { Company } from "../types";
import { useApp } from "../contexts/AppContext";
import { useI18n } from "../contexts/I18nContext";

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
  const { lang } = useI18n();

  const labels = useMemo(() => {
    const map = {
      es: {
        title: "Mis Empresas",
        subtitleActive: "Activa: {name}",
        subtitleSelect: "Selecciona una empresa",
        searchPlaceholder: "Buscar empresa por nombre o código...",
        join: "Unirse",
        create: "Crear",
        active: "Activa",
        code: "Código",
        shareTitle: "Comparte tu código",
        shareSubtitle: "Envía el código a un compañero para que se una",
        sharePlaceholder: "compañero@empresa.com",
        shareSend: "Enviar código",
        shareCopy: "Copiar código",
        generated: "Código generado",
        shareClose: "Compartir y cerrar",
        joinTitle: "Unirse a empresa",
        joinDesc: "Introduce el código de invitación de 7 caracteres (ej: IBE-7843)",
        joinCodeLabel: "Código de invitación",
        joinPlaceholder: "XXX-0000",
        joinCancel: "Cancelar",
        joinSubmit: "Unirse",
        createTitle: "Crear empresa",
        createName: "Nombre de la empresa",
        createProvince: "Provincia",
        createCancel: "Cancelar",
        createSubmit: "Crear empresa",
        joinedAlert: (name: string, code: string) => `Te has unido a ${name}. Código: ${code}`,
        shareAlert: (code: string) => `Envía este código a tu equipo: ${code}`,
      },
      ca: {
        title: "Les meves empreses",
        subtitleActive: "Activa: {name}",
        subtitleSelect: "Selecciona una empresa",
        searchPlaceholder: "Cerca empresa per nom o codi...",
        join: "Unir-se",
        create: "Crear",
        active: "Activa",
        code: "Codi",
        shareTitle: "Comparteix el teu codi",
        shareSubtitle: "Envia el codi a un company perquè s'hi uneixi",
        sharePlaceholder: "company@empresa.com",
        shareSend: "Envia el codi",
        shareCopy: "Copia el codi",
        generated: "Codi generat",
        shareClose: "Compartir i tancar",
        joinTitle: "Unir-se a empresa",
        joinDesc: "Introdueix el codi d'invitació de 7 caràcters (ex: IBE-7843)",
        joinCodeLabel: "Codi d'invitació",
        joinPlaceholder: "XXX-0000",
        joinCancel: "Cancel·lar",
        joinSubmit: "Unir-se",
        createTitle: "Crear empresa",
        createName: "Nom de l'empresa",
        createProvince: "Província",
        createCancel: "Cancel·lar",
        createSubmit: "Crear empresa",
        joinedAlert: (name: string, code: string) => `T'has unit a ${name}. Codi: ${code}`,
        shareAlert: (code: string) => `Envia aquest codi al teu equip: ${code}`,
      },
      en: {
        title: "My Companies",
        subtitleActive: "Active: {name}",
        subtitleSelect: "Select a company",
        searchPlaceholder: "Search company by name or code...",
        join: "Join",
        create: "Create",
        active: "Active",
        code: "Code",
        shareTitle: "Share your code",
        shareSubtitle: "Send the code to a teammate to join",
        sharePlaceholder: "teammate@company.com",
        shareSend: "Send code",
        shareCopy: "Copy code",
        generated: "Generated code",
        shareClose: "Share and close",
        joinTitle: "Join company",
        joinDesc: "Enter the 7-character invite code (e.g. IBE-7843)",
        joinCodeLabel: "Invite code",
        joinPlaceholder: "XXX-0000",
        joinCancel: "Cancel",
        joinSubmit: "Join",
        createTitle: "Create company",
        createName: "Company name",
        createProvince: "Province",
        createCancel: "Cancel",
        createSubmit: "Create company",
        joinedAlert: (name: string, code: string) => `You joined ${name}. Code: ${code}`,
        shareAlert: (code: string) => `Share this code with your team: ${code}`,
      },
      fr: {
        title: "Mes entreprises",
        subtitleActive: "Active : {name}",
        subtitleSelect: "Sélectionne une entreprise",
        searchPlaceholder: "Chercher par nom ou code...",
        join: "Rejoindre",
        create: "Créer",
        active: "Active",
        code: "Code",
        shareTitle: "Partage ton code",
        shareSubtitle: "Envoie le code à un collègue pour qu'il rejoigne",
        sharePlaceholder: "collègue@entreprise.com",
        shareSend: "Envoyer le code",
        shareCopy: "Copier le code",
        generated: "Code généré",
        shareClose: "Partager et fermer",
        joinTitle: "Rejoindre une entreprise",
        joinDesc: "Saisis le code d'invitation de 7 caractères (ex : IBE-7843)",
        joinCodeLabel: "Code d'invitation",
        joinPlaceholder: "XXX-0000",
        joinCancel: "Annuler",
        joinSubmit: "Rejoindre",
        createTitle: "Créer une entreprise",
        createName: "Nom de l'entreprise",
        createProvince: "Province",
        createCancel: "Annuler",
        createSubmit: "Créer l'entreprise",
        joinedAlert: (name: string, code: string) => `Tu as rejoint ${name}. Code : ${code}`,
        shareAlert: (code: string) => `Partage ce code avec ton équipe : ${code}`,
      },
      it: {
        title: "Le mie aziende",
        subtitleActive: "Attiva: {name}",
        subtitleSelect: "Seleziona un'azienda",
        searchPlaceholder: "Cerca per nome o codice...",
        join: "Unisciti",
        create: "Crea",
        active: "Attiva",
        code: "Codice",
        shareTitle: "Condividi il tuo codice",
        shareSubtitle: "Invia il codice a un collega per unirsi",
        sharePlaceholder: "collega@azienda.com",
        shareSend: "Invia codice",
        shareCopy: "Copia codice",
        generated: "Codice generato",
        shareClose: "Condividi e chiudi",
        joinTitle: "Unisciti all'azienda",
        joinDesc: "Inserisci il codice invito di 7 caratteri (es: IBE-7843)",
        joinCodeLabel: "Codice invito",
        joinPlaceholder: "XXX-0000",
        joinCancel: "Annulla",
        joinSubmit: "Unisciti",
        createTitle: "Crea azienda",
        createName: "Nome azienda",
        createProvince: "Provincia",
        createCancel: "Annulla",
        createSubmit: "Crea azienda",
        joinedAlert: (name: string, code: string) => `Ti sei unito a ${name}. Codice: ${code}`,
        shareAlert: (code: string) => `Invia questo codice al tuo team: ${code}`,
      },
      de: {
        title: "Meine Unternehmen",
        subtitleActive: "Aktiv: {name}",
        subtitleSelect: "Wähle ein Unternehmen",
        searchPlaceholder: "Suche nach Name oder Code...",
        join: "Beitreten",
        create: "Erstellen",
        active: "Aktiv",
        code: "Code",
        shareTitle: "Teile deinen Code",
        shareSubtitle: "Sende den Code an einen Kollegen zum Beitreten",
        sharePlaceholder: "kollege@firma.com",
        shareSend: "Code senden",
        shareCopy: "Code kopieren",
        generated: "Generierter Code",
        shareClose: "Teilen und schließen",
        joinTitle: "Unternehmen beitreten",
        joinDesc: "Gib den 7-stelligen Einladungscode ein (z. B. IBE-7843)",
        joinCodeLabel: "Einladungscode",
        joinPlaceholder: "XXX-0000",
        joinCancel: "Abbrechen",
        joinSubmit: "Beitreten",
        createTitle: "Unternehmen erstellen",
        createName: "Name des Unternehmens",
        createProvince: "Provinz",
        createCancel: "Abbrechen",
        createSubmit: "Unternehmen erstellen",
        joinedAlert: (name: string, code: string) => `Du bist ${name} beigetreten. Code: ${code}`,
        shareAlert: (code: string) => `Teile diesen Code mit deinem Team: ${code}`,
      },
    } as const;
    return map[lang as keyof typeof map] || map.es;
  }, [lang]);

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
    setCreatedCompanyCode(company.inviteCode);
    setNewCompanyName("");
  };

  const [shareTarget, setShareTarget] = useState("");
  const [createdCompanyCode, setCreatedCompanyCode] = useState<string>("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    const company = joinCompanyByCode(joinCode.trim());
    if (company) {
      setShowJoinForm(false);
      setJoinCode("");
      alert(`Te has unido a ${company.name}. Código: ${company.inviteCode}`);
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
          <h3 className="card-title">{labels.title}</h3>
          <p className="card-subtitle">
            {activeCompany ? labels.subtitleActive.replace("{name}", activeCompany.name) : labels.subtitleSelect}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setShowJoinForm(true)}
          >
            {labels.join}
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setShowCreateForm(true)}
          >
            {labels.create}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          className="form-input"
          placeholder={labels.searchPlaceholder}
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
                  {labels.code}: {company.inviteCode} · {company.location}
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
                {company.inviteCode} · {company.location}
              </div>
            </div>
            {activeCompany?.id === company.id && (
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#007aff", fontWeight: 600 }}>
                  {labels.active}
                </span>
                <div style={{ fontSize: "12px", color: "#515154" }}>
                  {labels.code}: <strong style={{ letterSpacing: "0.06em" }}>{company.inviteCode}</strong>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeCompany && (
        <div className="card" style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{labels.shareTitle}</div>
              <div style={{ fontSize: "13px", color: "#515154" }}>{labels.shareSubtitle}</div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 700 }}>
              {activeCompany.inviteCode}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{labels.sharePlaceholder}</label>
            <input
              type="text"
              className="form-input"
              placeholder={labels.sharePlaceholder}
              value={shareTarget}
              onChange={(e) => setShareTarget(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" type="button" onClick={() => {
              if (!activeCompany || !shareTarget.trim()) return;
              alert(`${labels.shareSend}: ${activeCompany.inviteCode} → ${shareTarget}`);
              setShareTarget("");
            }}>
              {labels.shareSend}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => navigator.clipboard?.writeText(activeCompany.inviteCode)}>
              {labels.shareCopy}
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{labels.createTitle}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreateForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{labels.createName}</label>
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
                  <label className="form-label">{labels.createProvince}</label>
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

                {createdCompanyCode && (
                  <div style={{ padding: "12px", background: "#f5f5f7", borderRadius: "10px", display: "grid", gap: "8px" }}>
                    <div style={{ fontWeight: 700 }}>{labels.generated}</div>
                    <div style={{ fontFamily: "monospace", fontSize: "18px", letterSpacing: "0.1em" }}>{createdCompanyCode}</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-outline" type="button" onClick={() => navigator.clipboard?.writeText(createdCompanyCode)}>
                        {labels.shareCopy}
                      </button>
                      <button className="btn btn-secondary" type="button" onClick={() => {
                        alert(labels.shareAlert(createdCompanyCode));
                        setCreatedCompanyCode("");
                        setShowCreateForm(false);
                      }}>
                        {labels.shareClose}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreateForm(false)}>
                  {labels.createCancel}
                </button>
                <button type="submit" className="btn btn-primary">
                  {labels.createSubmit}
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
              <h3 className="modal-title">{labels.joinTitle}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowJoinForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleJoin}>
              <div className="modal-body">
                <p style={{ fontSize: "14px", color: "#515154", marginBottom: "16px" }}>
                  {labels.joinDesc}
                </p>
                <div className="form-group">
                  <label className="form-label">{labels.joinCodeLabel}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder={labels.joinPlaceholder}
                    style={{ textTransform: "uppercase", fontSize: "18px", letterSpacing: "0.1em" }}
                    maxLength={8}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowJoinForm(false)}>
                  {labels.joinCancel}
                </button>
                <button type="submit" className="btn btn-primary">
                  {labels.joinSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
