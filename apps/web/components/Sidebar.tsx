const navigation = [
  { label: "Calendario", active: true },
  { label: "Ofertas", active: false },
  { label: "Negociaciones", active: false },
  { label: "Notificaciones", active: false },
  { label: "Perfil", active: false }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-badge">CL</div>
        Calendario Laboral
      </div>
      <nav>
        {navigation.map((item) => (
          <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
            <span>{item.label}</span>
            {item.active && <span>●</span>}
          </div>
        ))}
      </nav>
      <div className="sidebar-card">
        <strong>Centro: Barcelona</strong>
        <span>Empresa: Iberia Servicios</span>
        <span>Departamentos activos: 4</span>
      </div>
    </aside>
  );
}
