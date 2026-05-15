import { useState, useEffect, useRef } from "react";

// ─── Configuración de categorías ──────────────────────────────────────────────
const CATEGORIAS = {
  basural: {
    id: "basural",
    label: "Basural",
    emoji: "🗑️",
    color: "#ef4444",
    colorDark: "#dc2626",
    colorBg: "rgba(239,68,68,0.08)",
    colorBorder: "rgba(239,68,68,0.2)",
    desc: "Residuos acumulados, containers desbordados, chanchería",
    niveles: [
      { id: 1, label: "Descuido puntual", desc: "Container desbordado, bolsas sueltas", emoji: "🟡", color: "#facc15" },
      { id: 2, label: "Acumulación vecinal", desc: "Zona hasta 30m con residuos", emoji: "🟠", color: "#f97316" },
      { id: 3, label: "Basural establecido", desc: "Más de 50m, muebles, escombros", emoji: "🔴", color: "#ef4444" },
      { id: 4, label: "Crítico / Sanitario", desc: "Riesgo de salud, urgente", emoji: "⚫", color: "#7f1d1d" },
    ],
    tipos: ["Domiciliario", "Escombros", "Industrial", "Orgánico", "Mixto", "Chanchería 🐷"],
  },
  bache: {
    id: "bache",
    label: "Bache",
    emoji: "🕳️",
    color: "#f97316",
    colorDark: "#ea580c",
    colorBg: "rgba(249,115,22,0.08)",
    colorBorder: "rgba(249,115,22,0.2)",
    desc: "Pozos en calles y veredas, asfalto deteriorado",
    niveles: [
      { id: 1, label: "Pozo chico", desc: "Menos de 20cm, molesto pero transitable", emoji: "🟡", color: "#facc15" },
      { id: 2, label: "Pozo mediano", desc: "20-50cm, daño a vehículos probable", emoji: "🟠", color: "#f97316" },
      { id: 3, label: "Pozo grande", desc: "Más de 50cm, peligroso", emoji: "🔴", color: "#ef4444" },
      { id: 4, label: "Intransitable", desc: "Corta el paso, riesgo de accidente", emoji: "⚫", color: "#7f1d1d" },
    ],
    tipos: ["Asfalto", "Adoquín", "Tierra / ripio", "Vereda", "Esquina"],
  },
  iluminacion: {
    id: "iluminacion",
    label: "Iluminación",
    emoji: "💡",
    color: "#eab308",
    colorDark: "#ca8a04",
    colorBg: "rgba(234,179,8,0.08)",
    colorBorder: "rgba(234,179,8,0.2)",
    desc: "Farolas rotas, zonas sin luz, cables colgando",
    niveles: [
      { id: 1, label: "Luminaria fundida", desc: "Una sola luz apagada", emoji: "🟡", color: "#facc15" },
      { id: 2, label: "Varias luces apagadas", desc: "Zona con poca iluminación", emoji: "🟠", color: "#f97316" },
      { id: 3, label: "Cuadra sin luz", desc: "Zona completamente oscura", emoji: "🔴", color: "#ef4444" },
      { id: 4, label: "Riesgo eléctrico", desc: "Cables colgando, poste caído", emoji: "⚫", color: "#7f1d1d" },
    ],
    tipos: ["Luminaria rota", "Cable suelto", "Poste caído", "Sin lámpara", "Parpadea"],
  },
};

const CDELU = [-32.4833, -58.2333];

const MOCK_REPORTES = [
  { id: 1, categoria: "basural", nivel: 3, tipo: "Mixto", direccion: "Av. Ramírez esq. Zufriategui", lat: -32.481, lng: -58.231, dias: 18, confirmaciones: 23, estado: "activo", comentario: "Hay líquidos y olor muy fuerte." },
  { id: 2, categoria: "bache", nivel: 2, tipo: "Asfalto", direccion: "Galarza 400", lat: -32.485, lng: -58.237, dias: 5, confirmaciones: 12, estado: "activo", comentario: "" },
  { id: 3, categoria: "basural", nivel: 4, tipo: "Chanchería 🐷", direccion: "Camino rural s/n", lat: -32.470, lng: -58.220, dias: 45, confirmaciones: 61, estado: "activo", comentario: "Animales muertos y moscas." },
  { id: 4, categoria: "iluminacion", nivel: 3, tipo: "Sin lámpara", direccion: "Urquiza 1200", lat: -32.488, lng: -58.240, dias: 12, confirmaciones: 9, estado: "activo", comentario: "Cuadra completamente oscura de noche." },
  { id: 5, categoria: "bache", nivel: 4, tipo: "Adoquín", direccion: "Colón esq. Moreno", lat: -32.479, lng: -58.235, dias: 30, confirmaciones: 28, estado: "activo", comentario: "Intransitable para motos." },
  { id: 6, categoria: "iluminacion", nivel: 1, tipo: "Luminaria rota", direccion: "San Martín 850", lat: -32.483, lng: -58.229, dias: 2, confirmaciones: 3, estado: "resuelto", comentario: "" },
];

const ESTADO_CONFIG = {
  activo: { label: "Sigue ahí", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  parcial: { label: "En proceso", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  resuelto: { label: "Resuelto ✓", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

// ─── Helpers Leaflet ──────────────────────────────────────────────────────────
function loadLeaflet(cb) {
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css"; link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
  }
  if (window.L) { cb(); return; }
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
  script.onload = cb;
  document.head.appendChild(script);
}

function makePinIcon(color) {
  if (!window.L) return null;
  return window.L.divIcon({
    html: `<svg width="28" height="38" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26S32 28 32 16C32 7.2 24.8 0 16 0z" fill="${color}" stroke="rgba(0,0,0,0.4)" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.85"/>
      <text x="16" y="21" text-anchor="middle" font-size="11" fill="${color}" font-weight="bold" font-family="sans-serif">!</text>
    </svg>`,
    className: "", iconSize: [28, 38], iconAnchor: [14, 38],
  });
}

// ─── Mapa selector pin ────────────────────────────────────────────────────────
function LeafletPinSelector({ color, onConfirm }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [coords, setCoords] = useState(CDELU);

  useEffect(() => {
    loadLeaflet(() => {
      if (!mapRef.current || leafletMap.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { center: CDELU, zoom: 15 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM", maxZoom: 19 }).addTo(map);
      const marker = L.marker(CDELU, { icon: makePinIcon(color), draggable: true }).addTo(map);
      marker.on("dragend", () => { const p = marker.getLatLng(); setCoords([p.lat, p.lng]); });
      map.on("click", (e) => { marker.setLatLng(e.latlng); setCoords([e.latlng.lat, e.latlng.lng]); });
      leafletMap.current = map;
      setTimeout(() => map.invalidateSize(), 300);
    });
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, []);

  return (
    <div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>Navegá el mapa y tocá el lugar exacto, o arrastrá el pin.</div>
      <div ref={mapRef} style={{ width: "100%", height: 220, borderRadius: 12, overflow: "hidden", border: `1px solid ${color}44`, background: "#1a2332" }} />
      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: `${color}10`, border: `1px solid ${color}30`, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>📍</span>
        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</span>
        <span style={{ fontSize: 11, color: "#334155" }}>CdelU, ER</span>
      </div>
      <button onClick={() => onConfirm({ lat: coords[0].toFixed(5), lng: coords[1].toFixed(5) })} style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, letterSpacing: 1, cursor: "pointer" }}>
        CONFIRMAR UBICACIÓN →
      </button>
    </div>
  );
}

// ─── Mapa de reportes ─────────────────────────────────────────────────────────
function LeafletReportesMap({ reportes, filtroCategoria, onSelect }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    loadLeaflet(() => {
      if (!mapRef.current || leafletMap.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { center: CDELU, zoom: 14 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM", maxZoom: 19 }).addTo(map);
      leafletMap.current = map;
      setTimeout(() => { map.invalidateSize(); updateMarkers(map, reportes, filtroCategoria); }, 300);
    });
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, []);

  useEffect(() => { if (leafletMap.current) updateMarkers(leafletMap.current, reportes, filtroCategoria); }, [reportes, filtroCategoria]);

  function updateMarkers(map, reps, filCat) {
    const L = window.L; if (!L) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    reps.filter(r => filCat === "todos" || r.categoria === filCat).forEach(r => {
      const cat = CATEGORIAS[r.categoria];
      const nivel = cat.niveles.find(n => n.id === r.nivel);
      const color = r.estado === "resuelto" ? "#22c55e" : nivel.color;
      const m = L.marker([r.lat, r.lng], { icon: makePinIcon(color) }).addTo(map);
      m.on("click", () => onSelect(r));
      markersRef.current.push(m);
    });
  }

  return <div ref={mapRef} style={{ width: "100%", height: "100%", background: "#1a2332" }} />;
}

// ─── Detalle de reporte en mapa ───────────────────────────────────────────────
function ReporteDetalle({ r, onVotar, onClose }) {
  const cat = CATEGORIAS[r.categoria];
  const nivel = cat.niveles.find(x => x.id === r.nivel);
  const estado = ESTADO_CONFIG[r.estado];
  return (
    <div style={{ animation: "slideUp 0.25s ease-out", background: "#0d1117", borderRadius: "16px 16px 0 0", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: cat.colorBg, color: cat.color, fontWeight: 700, border: `1px solid ${cat.color}33` }}>{cat.emoji} {cat.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: nivel.color + "22", color: nivel.color }}>{nivel.emoji} Nivel {nivel.id}</span>
            <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: estado.bg, color: estado.color, fontWeight: 600 }}>{estado.label}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>📍 {r.direccion}</div>
          <div style={{ fontSize: 12, color: "#475569" }}>{r.tipo}</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#475569", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 16, flexShrink: 0, marginLeft: 8 }}>×</button>
      </div>
      {r.comentario && (
        <div style={{ margin: "8px 0", padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${cat.color}` }}>
          <div style={{ fontSize: 11, color: "#334155", marginBottom: 3 }}>COMENTARIO</div>
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, fontStyle: "italic" }}>"{r.comentario}"</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
        {[{ label: `${r.dias} días`, sub: "sin resolver" }, { label: r.confirmaciones, sub: "confirmaron" }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: i === 0 && r.dias > 14 ? "#ef4444" : "#94a3b8", lineHeight: 1 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {r.estado !== "resuelto" && (
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { estado: "activo", label: "🔴 Sigue ahí", color: "#ef4444" },
            { estado: "parcial", label: "🟡 En proceso", color: "#f97316" },
            { estado: "resuelto", label: "✅ Resuelto", color: "#22c55e" },
          ].map(b => (
            <button key={b.estado} onClick={() => { onVotar(r.id, b.estado); onClose(); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${b.color}44`, background: b.color + "10", color: b.color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{b.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Formulario de denuncia ───────────────────────────────────────────────────
function FormDenuncia({ categoria, onClose, onSubmit }) {
  const cat = CATEGORIAS[categoria];
  const [paso, setPaso] = useState(1);
  const [nivel, setNivel] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [comentario, setComentario] = useState("");
  const [ubicacion, setUbicacion] = useState(null);
  const [enviado, setEnviado] = useState(false);

  function handleSubmit() {
    if (!nivel || !tipo || !ubicacion) return;
    setEnviado(true);
    setTimeout(() => {
      onSubmit({ categoria, nivel, tipo, comentario, direccion: `${ubicacion.lat}, ${ubicacion.lng}`, lat: parseFloat(ubicacion.lat), lng: parseFloat(ubicacion.lng) });
      onClose();
    }, 2000);
  }

  if (enviado) return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>{cat.emoji}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: cat.color, letterSpacing: 2 }}>¡RECLAMO ENVIADO!</div>
      <div style={{ color: "#64748b", fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>100% anónimo.<br />La comunidad puede confirmarlo.</div>
    </div>
  );

  return (
    <div>
      {/* Header categoría */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 12px", borderRadius: 10, background: cat.colorBg, border: `1px solid ${cat.color}33` }}>
        <span style={{ fontSize: 24 }}>{cat.emoji}</span>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: cat.color, letterSpacing: 1 }}>NUEVO RECLAMO — {cat.label.toUpperCase()}</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{cat.desc}</div>
        </div>
      </div>

      {/* Progreso */}
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        {["Gravedad", "Tipo", "Ubicación"].map((p, i) => (
          <div key={p} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 2, marginBottom: 4, background: i + 1 <= paso ? cat.color : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
            <div style={{ fontSize: 10, color: i + 1 <= paso ? cat.color : "#334155", fontWeight: 600 }}>{p}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "12px 0" }} />

      {/* Paso 1 */}
      {paso === 1 && (
        <div style={{ animation: "fadeUp 0.25s ease-out" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#f1f5f9", marginBottom: 4, letterSpacing: 1 }}>¿QUÉ TAN GRAVE ES?</div>
          <div style={{ color: "#475569", fontSize: 12, marginBottom: 14 }}>Elegí el nivel que mejor describe la situación</div>
          {cat.niveles.map(n => (
            <div key={n.id} onClick={() => setNivel(n.id)} style={{ padding: "11px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer", border: `1px solid ${nivel === n.id ? n.color : "rgba(255,255,255,0.07)"}`, background: nivel === n.id ? n.color + "12" : "rgba(255,255,255,0.02)", transition: "all 0.18s" }}>
              <div style={{ fontWeight: 600, color: n.color, fontSize: 13 }}>{n.emoji} Nivel {n.id} — {n.label}</div>
              <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{n.desc}</div>
            </div>
          ))}
          <button onClick={() => nivel && setPaso(2)} style={{ width: "100%", marginTop: 4, padding: "13px", borderRadius: 10, border: "none", background: nivel ? `linear-gradient(135deg,${cat.colorDark},${cat.color})` : "rgba(255,255,255,0.04)", color: nivel ? "#fff" : "#334155", fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, letterSpacing: 1, cursor: nivel ? "pointer" : "default" }}>SIGUIENTE →</button>
        </div>
      )}

      {/* Paso 2 */}
      {paso === 2 && (
        <div style={{ animation: "fadeUp 0.25s ease-out" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#f1f5f9", marginBottom: 4, letterSpacing: 1 }}>¿QUÉ TIPO?</div>
          <div style={{ color: "#475569", fontSize: 12, marginBottom: 14 }}>Seleccioná el tipo predominante</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {cat.tipos.map(t => (
              <button key={t} onClick={() => setTipo(t)} style={{ padding: "9px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${tipo === t ? cat.color : "rgba(255,255,255,0.09)"}`, background: tipo === t ? cat.color + "20" : "rgba(255,255,255,0.02)", color: tipo === t ? cat.color : "#94a3b8", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>{t}</button>
            ))}
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", marginBottom: 12, cursor: "pointer", textAlign: "center", color: "#334155", fontSize: 13 }}>
            📷 Agregar foto (recomendado)
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>💬 Comentario <span style={{ color: "#334155" }}>(opcional)</span></div>
            <textarea value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Describí lo que ves con más detalle..." maxLength={280} rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, outline: "none", resize: "none" }}
              onFocus={e => e.target.style.borderColor = cat.color + "66"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: "#334155", marginTop: 4 }}>{comentario.length}/280</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPaso(1)} style={{ flex: 1, padding: "13px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, cursor: "pointer" }}>← ATRÁS</button>
            <button onClick={() => tipo && setPaso(3)} style={{ flex: 2, padding: "13px", borderRadius: 10, border: "none", background: tipo ? `linear-gradient(135deg,${cat.colorDark},${cat.color})` : "rgba(255,255,255,0.04)", color: tipo ? "#fff" : "#334155", fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, letterSpacing: 1, cursor: tipo ? "pointer" : "default" }}>SIGUIENTE →</button>
          </div>
        </div>
      )}

      {/* Paso 3 */}
      {paso === 3 && (
        <div style={{ animation: "fadeUp 0.25s ease-out" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#f1f5f9", marginBottom: 4, letterSpacing: 1 }}>MARCÁ LA UBICACIÓN</div>
          {!ubicacion ? (
            <>
              <LeafletPinSelector color={cat.color} onConfirm={pos => setUbicacion(pos)} />
              <button onClick={() => setPaso(2)} style={{ width: "100%", marginTop: 8, padding: "11px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, cursor: "pointer" }}>← ATRÁS</button>
            </>
          ) : (
            <div style={{ animation: "fadeUp 0.25s ease-out" }}>
              <div style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 14, background: cat.colorBg, border: `1px solid ${cat.color}33` }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Ubicación confirmada</div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>📍 {ubicacion.lat}, {ubicacion.lng}</div>
                <button onClick={() => setUbicacion(null)} style={{ marginTop: 6, background: "none", border: "none", color: cat.color, fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>Cambiar ubicación</button>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 11, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Resumen</div>
                {[
                  { label: "Categoría", val: `${cat.emoji} ${cat.label}` },
                  { label: "Gravedad", val: `${cat.niveles.find(n => n.id === nivel)?.emoji} Nivel ${nivel}` },
                  { label: "Tipo", val: tipo },
                  ...(comentario ? [{ label: "Comentario", val: comentario.length > 45 ? comentario.slice(0, 45) + "…" : comentario }] : []),
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#475569", flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{item.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#334155", textAlign: "center", marginBottom: 12 }}>🔒 Reclamo 100% anónimo · Sin datos personales</div>
              <button onClick={handleSubmit} style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${cat.colorDark},${cat.color})`, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, cursor: "pointer", boxShadow: `0 6px 20px ${cat.color}40` }}>
                📢 ENVIAR RECLAMO
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pantalla de inicio ───────────────────────────────────────────────────────
function PantallaInicio({ onSeleccionar }) {
  const cats = Object.values(CATEGORIAS);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", animation: "fadeUp 0.4s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          Hacé tu reclamo en 3 pasos.<br />
          <span style={{ color: "#334155" }}>Anónimo, gratis y directo.</span>
        </div>
      </div>

      {cats.map((cat, i) => (
        <div
          key={cat.id}
          onClick={() => onSeleccionar(cat.id)}
          style={{
            marginBottom: 14, padding: "20px 18px", borderRadius: 16, cursor: "pointer",
            background: cat.colorBg, border: `1px solid ${cat.color}33`,
            transition: "all 0.2s",
            animation: `fadeUp 0.4s ease-out ${i * 0.08}s both`,
          }}
          onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${cat.color}77`; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${cat.color}33`; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: cat.color + "20", border: `1px solid ${cat.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              {cat.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: cat.color, letterSpacing: 1, lineHeight: 1 }}>{cat.label.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4, lineHeight: 1.4 }}>{cat.desc}</div>
            </div>
            <div style={{ color: cat.color, fontSize: 20, opacity: 0.5 }}>›</div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 8, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#334155" }}>
          ¿Otro problema en tu barrio?<br />
          <span style={{ color: "#475569" }}>Más categorías próximamente</span>
        </div>
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────
export default function App() {
  const [pantalla, setPantalla] = useState("inicio"); // inicio | denunciar | mapa
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [filtroCat, setFiltroCat] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [reportes, setReportes] = useState(MOCK_REPORTES);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  function seleccionarCategoria(id) {
    setCategoriaActiva(id);
    setShowForm(true);
    setPantalla("denunciar");
  }

  function onSubmit(data) {
    setReportes(prev => [{ id: Date.now(), ...data, dias: 0, confirmaciones: 1, estado: "activo" }, ...prev]);
    setShowForm(false);
    setPantalla("mapa");
    setFiltroCat(data.categoria);
  }

  function onVotar(id, nuevoEstado) {
    setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado, confirmaciones: r.confirmaciones + 1 } : r));
  }

  const totalActivos = reportes.filter(r => r.estado === "activo").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .leaflet-control-zoom a { background:#1a1f2e!important; color:#f97316!important; border-color:rgba(249,115,22,0.3)!important; font-weight:700; }
        .leaflet-control-zoom a:hover { background:rgba(249,115,22,0.15)!important; }
        .leaflet-control-attribution { font-size:9px!important; background:rgba(0,0,0,0.55)!important; color:#334155!important; }
        textarea::placeholder { color:#334155; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 30% 20%, #0f0a00 0%, #080c10 60%)", fontFamily: "'DM Sans', sans-serif", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 420, height: 720, display: "flex", flexDirection: "column", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 25px 60px rgba(0,0,0,0.7)", background: "#0d1117", position: "relative" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#0f0a00,#1a1200)", padding: "16px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 2, lineHeight: 1 }}>
                  <span style={{ color: "#f97316" }}>CDELU</span>
                  <span style={{ color: "#e2e8f0" }}> RECLAMA</span>
                </div>
                <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>Concepción del Uruguay, Entre Ríos</div>
              </div>
              <div style={{ textAlign: "center", paddingTop: 4 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#f97316", lineHeight: 1 }}>{totalActivos}</div>
                <div style={{ fontSize: 10, color: "#334155" }}>reclamos activos</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex" }}>
              {[
                { id: "inicio", label: "📢 RECLAMAR" },
                { id: "mapa", label: "🗺️ VER MAPA" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setPantalla(tab.id)} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 1, color: pantalla === tab.id || (tab.id === "inicio" && pantalla === "denunciar") ? "#f97316" : "#334155", borderBottom: `2px solid ${pantalla === tab.id || (tab.id === "inicio" && pantalla === "denunciar") ? "#f97316" : "transparent"}`, cursor: "pointer", transition: "all 0.2s" }}>{tab.label}</button>
              ))}
            </div>
          </div>

          {/* Pantalla inicio */}
          {(pantalla === "inicio" || pantalla === "denunciar") && !showForm && (
            <PantallaInicio onSeleccionar={seleccionarCategoria} />
          )}

          {/* Pantalla mapa */}
          {pantalla === "mapa" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", animation: "fadeUp 0.3s ease-out" }}>
              {/* Filtros flotantes */}
              <div style={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 500, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[{ id: "todos", label: "Todos" }, ...Object.values(CATEGORIAS).map(c => ({ id: c.id, label: `${c.emoji} ${c.label}` }))].map(f => (
                  <button key={f.id} onClick={() => setFiltroCat(f.id)} style={{ padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${filtroCat === f.id ? "#f97316" : "rgba(255,255,255,0.15)"}`, background: filtroCat === f.id ? "rgba(249,115,22,0.85)" : "rgba(13,17,23,0.85)", color: filtroCat === f.id ? "#fff" : "#94a3b8", cursor: "pointer", fontFamily: "inherit", backdropFilter: "blur(6px)" }}>{f.label}</button>
                ))}
              </div>
              {/* Mapa */}
              <div style={{ flex: 1 }}>
                <LeafletReportesMap reportes={reportes} filtroCategoria={filtroCat} onSelect={r => setReporteSeleccionado(r)} />
              </div>
              {/* Detalle */}
              {reporteSeleccionado && (
                <div style={{ flexShrink: 0 }}>
                  <ReporteDetalle r={reporteSeleccionado} onVotar={onVotar} onClose={() => setReporteSeleccionado(null)} />
                </div>
              )}
            </div>
          )}

          {/* Modal formulario */}
          {showForm && categoriaActiva && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", backdropFilter: "blur(4px)", zIndex: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
              <div style={{ width: "100%", background: "#0d1117", borderRadius: "20px 20px 0 0", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 18px 24px", animation: "slideUp 0.3s ease-out", maxHeight: "93%", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div />
                  <button onClick={() => { setShowForm(false); setPantalla("inicio"); }} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#475569", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>×</button>
                </div>
                <FormDenuncia categoria={categoriaActiva} onClose={() => { setShowForm(false); setPantalla("inicio"); }} onSubmit={onSubmit} />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
