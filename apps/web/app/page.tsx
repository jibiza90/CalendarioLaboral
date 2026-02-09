"use client";

import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <div className="landing-container">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-p1CmS6Z0k6KrrO5T8v7FpC18JNpDutVdGs14Q6gttxyPjdvVSxGInxje1Up43EIBgzHuLlHotE5Z7PqL/ZiZJw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <header className="topbar">
        <div className="container nav">
          <Link href="#" className="logo">
            <i className="fas fa-exchange-alt" aria-hidden />
            <span>TurnSwap</span>
          </Link>
          <nav className="nav-links" aria-label="Principal">
            <Link href="#how-it-works">Cómo funciona</Link>
            <Link href="#benefits">Beneficios</Link>
            <Link href="#auth-forms">Contacto</Link>
          </nav>
          <div className="actions">
            <Link className="btn btn-outline" href="/login">
              <span>Iniciar sesión</span>
              <i className="fas fa-arrow-right" aria-hidden />
            </Link>
            <Link className="btn btn-primary" href="/login">
              <span>Registrarse</span>
              <i className="fas fa-arrow-right" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text">
              <h1>Intercambia tus turnos de trabajo fácilmente</h1>
              <p>
                ¿No puedes trabajar un sábado? Publica tu turno y ofrece una compensación para que alguien lo cubra. Encuentra turnos disponibles y
                gana dinero extra cubriendo los turnos de otros.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/login">
                  <span>Comienza ahora</span>
                  <i className="fas fa-arrow-right" aria-hidden />
                </Link>
                <Link className="btn btn-outline" href="/login">
                  <span>Inicia sesión</span>
                  <i className="fas fa-arrow-right" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="hero-image" role="presentation">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1170&q=80"
                alt="Intercambio de turnos de trabajo"
              />
            </div>
          </div>
        </section>

        <section className="section alt" id="benefits">
          <div className="container">
            <h2 className="section-title">Beneficios</h2>
            <div className="steps">
              <div className="step">
                <div className="step-icon"><i className="fas fa-bolt" aria-hidden /></div>
                <div className="step-emoji" aria-hidden>⚡️</div>
                <h3>Rápido</h3>
                <p>Publica y recibe propuestas en minutos.</p>
              </div>
              <div className="step">
                <div className="step-icon"><i className="fas fa-shield-alt" aria-hidden /></div>
                <div className="step-emoji" aria-hidden>🛡️</div>
                <h3>Seguro</h3>
                <p>Perfiles verificados y acuerdos claros.</p>
              </div>
              <div className="step">
                <div className="step-icon"><i className="fas fa-comments" aria-hidden /></div>
                <div className="step-emoji" aria-hidden>💬</div>
                <h3>Comunicación</h3>
                <p>Coordina todo por chat integrado.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="container">
            <h2 className="section-title">¿Cómo funciona TurnSwap?</h2>
            <div className="steps">
              <div className="step">
                <div className="step-icon"><i className="fas fa-calendar-plus" aria-hidden /></div>
                <div className="step-emoji" aria-hidden>📅</div>
                <h3>Publica tu turno</h3>
                <p>Si no puedes trabajar un día, publica tu turno en la plataforma. Puedes ofrecer una compensación económica para motivar a otros.</p>
              </div>
              <div className="step">
                <div className="step-icon"><i className="fas fa-search" aria-hidden /></div>
                <div className="step-emoji" aria-hidden>🔍</div>
                <h3>Encuentra turnos</h3>
                <p>Busca entre los turnos disponibles que otros han publicado. Filtra por fecha, ubicación o compensación ofrecida.</p>
              </div>
              <div className="step">
                <div className="step-icon"><i className="fas fa-handshake" aria-hidden /></div>
                <div className="step-emoji" aria-hidden>🤝</div>
                <h3>Intercambia</h3>
                <p>Coordina el intercambio directamente con la otra persona. La plataforma te ayuda a gestionar el proceso de forma segura.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section alt" id="auth-forms">
          <div className="container">
            <h2 className="section-title">Únete a la comunidad</h2>
            <div className="forms">
              <div className="form-card">
                <h3>Crear una cuenta</h3>
                <Link className="btn btn-primary full" href="/login">
                  <span>Registrarse</span>
                  <i className="fas fa-arrow-right" aria-hidden />
                </Link>
                <p className="note">¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link></p>
              </div>
              <div className="form-card">
                <h3>Iniciar sesión</h3>
                <Link className="btn btn-outline full" href="/login">Ir a login</Link>
                <p className="note">¿No tienes cuenta? <Link href="/login">Regístrate</Link></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div>
            <h3>TurnSwap</h3>
            <p>La plataforma líder para intercambio de turnos de trabajo. Conectamos a trabajadores para facilitar la gestión de horarios.</p>
          </div>
          <div>
            <h3>Enlaces rápidos</h3>
            <ul>
              <li><Link href="#how-it-works">Cómo funciona</Link></li>
              <li><Link href="#auth-forms">Registrarse</Link></li>
              <li><Link href="/login">Buscar turnos</Link></li>
              <li><Link href="/login">Publicar turno</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contacto</h3>
            <ul>
              <li>info@turnswap.com</li>
              <li>+34 912 345 678</li>
              <li>Madrid, España</li>
            </ul>
          </div>
        </div>
        <div className="copy">© 2023 TurnSwap. Todos los derechos reservados.</div>
      </footer>

      <style jsx>{`
        :global(body) {
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.6;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .landing-container {
          width: 100%;
        }
        .topbar {
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 0;
          flex-wrap: wrap;
        }
        .logo {
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          text-decoration: none;
        }
        .logo i { color: #3498db; }
        .nav-links {
          display: flex;
          gap: 25px;
          align-items: center;
          flex-wrap: wrap;
          flex: 1;
          justify-content: center;
        }
        .nav-links a {
          color: #2c3e50;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: #3498db; }
        .actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
        }
        .btn {
          padding: 10px 24px;
          border-radius: 30px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          line-height: 1.1;
        }
        .btn-primary { background: #3498db; color: #fff; }
        .btn-outline { background: transparent; color: #3498db; border: 2px solid #3498db; }
        .btn-primary:hover { background: #2980b9; }
        .btn-outline:hover { background: rgba(52,152,219,0.1); }
        .hero { padding: 80px 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
        .hero-grid { display: flex; align-items: center; gap: 40px; justify-content: space-between; flex-wrap: wrap; }
        .hero-text { flex: 1; min-width: 300px; }
        .hero-text h1 { font-size: 3rem; color: #2c3e50; margin-bottom: 18px; line-height: 1.2; }
        .hero-text p { font-size: 1.15rem; color: #555; margin-bottom: 26px; max-width: 620px; }
        .hero-image { flex: 1; min-width: 280px; display: flex; justify-content: center; }
        .hero-image img { max-width: 100%; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .section { padding: 80px 0; background: #fff; }
        .section.alt { background: #f8f9fa; }
        .section-title { text-align: center; font-size: 2.4rem; color: #2c3e50; margin-bottom: 40px; }
        .steps { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
        .step { flex: 1; min-width: 240px; max-width: 300px; text-align: center; padding: 26px 18px; border-radius: 10px; background: #f8f9fa; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .step-icon { display: none; }
        .step-emoji { font-size: 2.4rem; margin-bottom: 12px; }
        .step h3 { margin-bottom: 12px; color: #2c3e50; }
        .forms { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 20px; justify-content: center; }
        .form-card { background: #fff; padding: 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; }
        .form-card h3 { margin-bottom: 16px; color: #2c3e50; }
        .form-card .btn.full { width: 100%; justify-content: center; display: inline-flex; text-align: center; }
        .note { margin-top: 12px; color: #666; }
        .note a { color: #3498db; text-decoration: none; }
        .footer { background: #2c3e50; color: #fff; padding: 60px 0 30px; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 24px; }
        .footer h3 { margin-bottom: 14px; }
        .footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
        .footer a { color: #ddd; text-decoration: none; }
        .footer a:hover { color: #fff; }
        .copy { text-align: center; margin-top: 30px; color: #aaa; font-size: 0.95rem; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 18px; }
        @media (max-width: 992px) {
          .hero-text h1 { font-size: 2.6rem; }
          .hero-grid { flex-direction: column; text-align: center; }
          .actions { justify-content: center; }
          .nav { justify-content: center; }
          .nav-links { justify-content: center; }
        }
        @media (max-width: 768px) {
          .nav { flex-direction: column; align-items: stretch; }
          .nav-links { justify-content: center; }
          .actions { justify-content: center; }
          .hero-text h1 { font-size: 2.2rem; }
          .section-title { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
