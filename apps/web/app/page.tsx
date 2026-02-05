"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useI18n } from "../contexts/I18nContext";

import heroImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0001.jpg";
import stepsImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0002.jpg";
import benefitsImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0003.jpg";
import sectorsImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0004.jpg";
import dashboardImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0005.jpg";
import calendarImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0006.jpg";
import securityImg from "./Intercambia-Turnos-de-Trabajo-al-Instante_compressed_compressed_page-0007.jpg";

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();

  const handlePrimary = () => router.push("/login");
  const handleSecondary = () => {
    const el = document.getElementById("landing-how");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      <header className="hero full-bleed">
        <div className="hero-bg">
          <Image src={heroImg} alt="Hero" fill priority className="hero-img" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <h1>{t("landing.hero.title")}</h1>
          <p className="subtitle">{t("landing.hero.subtitle")}</p>
          <div className="cta-group">
            <button className="btn hero-primary" onClick={handlePrimary}>{t("landing.hero.ctaPrimary")}</button>
            <button className="btn hero-secondary" onClick={handleSecondary}>{t("landing.hero.ctaSecondary")}</button>
          </div>
        </div>
      </header>

      <section className="section full-bleed" id="landing-how">
        <div className="section-inner">
          <h2>¿Cómo Funciona?</h2>
          <div className="steps-row">
            <div className="step-card chevron">
              <div className="step-icon">📅</div>
              <h3>Publica tu turno</h3>
              <p>Selecciona el día que no puedes trabajar y establece tu precio.</p>
            </div>
            <div className="step-card chevron">
              <div className="step-icon">🔎</div>
              <h3>Encuentra compradores</h3>
              <p>Otros trabajadores verán tu oferta y podrán comprarla.</p>
            </div>
            <div className="step-card chevron">
              <div className="step-icon">🤝</div>
              <h3>Confirma el cambio</h3>
              <p>Ambas partes aprueban y el intercambio queda registrado.</p>
            </div>
          </div>
          <p className="section-note">Todo el proceso está protegido con verificación de identidad y sistema de valoraciones.</p>
        </div>
      </section>

      <section className="section" id="landing-benefits">
        <div className="section-inner benefits">
          <div className="benefits-left">
            <h2>Beneficios Principales</h2>
            <div className="benefit-grid">
              {[
                { title: "Flexibilidad Total", desc: "Gestiona tu horario según tus necesidades personales." },
                { title: "Ingresos Extra", desc: "Monetiza los turnos que no puedes cubrir." },
                { title: "Seguridad Garantizada", desc: "Sistema de verificación y protección de pagos." },
                { title: "Proceso Rápido", desc: "Encuentra reemplazos en minutos, no en horas." },
              ].map((b) => (
                <div key={b.title} className="benefit-card">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="benefits-right">
            <h3>¿Por qué elegir nuestra plataforma?</h3>
            <p>Más de 10,000 trabajadores ya confían en nosotros para gestionar sus turnos de manera eficiente y segura.</p>
          </div>
        </div>
      </section>

      <section className="section full-bleed" id="landing-sectors">
        <div className="img-block">
          <Image src={sectorsImg} alt="Sectores" fill className="rounded" />
        </div>
      </section>

      <section className="section" id="landing-stats">
        <div className="section-inner">
          <h2>Panel de Control Intuitivo</h2>
          <p className="subtitle">Visualiza ofertas, mensajes y turnos en un solo lugar con calendario inteligente.</p>
          <div className="stats-row">
            {["Ofertas activas", "Este mes", "Hoy", "Mensajes sin leer"].map((label) => (
              <div key={label} className="stat-box">
                <div className="stat-number">0</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="landing-calendar">
        <div className="section-inner calendar">
          <div className="calendar-copy">
            <h2>Calendario Mensual Interactivo</h2>
            <h3>Navegación Sencilla</h3>
            <ul>
              <li>Vista mensual completa de febrero 2026</li>
              <li>Filtros por empresa y tipo de turno</li>
              <li>Indicadores visuales de disponibilidad</li>
              <li>Sincronización automática con tu agenda</li>
            </ul>
          </div>
          <div className="calendar-img">
            <Image src={calendarImg} alt="Calendario" fill className="rounded" />
          </div>
        </div>
      </section>

      <section className="section" id="landing-security">
        <div className="section-inner">
          <h2>Seguridad y Confianza</h2>
          <div className="security-grid">
            {[
              { title: "Verificación de Identidad", desc: "Todos los usuarios verifican identidad y empresa antes de transaccionar." },
              { title: "Sistema de Valoraciones", desc: "Califica tras cada intercambio para mantener la calidad." },
              { title: "Pagos Protegidos", desc: "El dinero se libera cuando ambas partes confirman el cambio." },
              { title: "Soporte 24/7", desc: "Equipo disponible para resolver incidencias en tiempo real." },
            ].map((item) => (
              <div key={item.title} className="security-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>{t("landing.footer.made")}</p>
      </footer>
    </div>
  );
}
