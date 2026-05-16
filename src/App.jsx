import { useState, useEffect, useRef } from "react";
 
// ─── Supabase config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://rblnowaaflxfdwbhxvhp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibG5vd2FhZmx4ZmR3Ymh4dmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzA5OTUsImV4cCI6MjA5NDQ0Njk5NX0.fSlKzrrOZwwPoRLerU4fN2n9o_YKP3EEk6lShPk_DRg";
 
async function supabase(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
 
// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBasural = ({ color = "#fff", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 47.23 53.22" fill="none">
    <path fill={color} d="M8.81,53.22c-1.47,0-2.72-.51-3.74-1.54s-1.54-2.28-1.54-3.74V4.93H0v-2.47h13.04V0h21.15v2.47h13.04v2.47h-3.52v43c0,1.53-.5,2.79-1.5,3.79s-2.26,1.5-3.79,1.5H8.81ZM41.24,4.93H5.99v43c0,.82.26,1.5.79,2.03s1.2.79,2.03.79h29.61c.7,0,1.35-.29,1.94-.88s.88-1.23.88-1.94V4.93ZM16.74,43.7h2.47V11.98h-2.47v31.72ZM28.02,43.7h2.47V11.98h-2.47v31.72Z"/>
  </svg>
);
const IconBache = ({ color = "#fff", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 53.01 59.77" fill="none">
    <path fill={color} d="M19.31,50.11c-.82-.11-1.23-.51-1.23-1.22,0-.81.41-1.47,1.23-2.01.82-.53,1.82-.8,2.99-.8s2.17.27,2.98.81,1.22,1.21,1.22,2c0,.7-.41,1.11-1.23,1.22-.82.11-1.81.16-2.99.16s-2.17-.05-2.99-.16ZM42.41,56.21c-.81-.12-1.21-.53-1.21-1.24,0-.8.41-1.47,1.22-2.01.81-.54,1.81-.81,2.99-.81s2.18.27,3,.82,1.23,1.21,1.23,2c0,.71-.41,1.12-1.22,1.24-.82.12-1.82.18-3.01.18s-2.18-.06-2.99-.18ZM28.53,56.22c-.81-.12-1.22-.54-1.22-1.26,0-.79.41-1.46,1.23-2,.82-.54,1.82-.81,2.99-.81s2.17.27,3,.82c.83.55,1.24,1.21,1.24,2,0,.71-.41,1.13-1.24,1.24-.83.12-1.83.17-3.01.17s-2.18-.06-2.99-.17ZM4.61,56.21c-.82-.12-1.23-.54-1.23-1.25,0-.79.41-1.46,1.22-2,.82-.54,1.82-.81,3-.81s2.19.27,3.01.82c.82.55,1.23,1.21,1.23,2,0,.71-.41,1.12-1.24,1.24-.82.12-1.82.18-3,.18s-2.18-.06-2.99-.18ZM15.9,59.59c-.82-.12-1.23-.53-1.23-1.24,0-.81.41-1.48,1.22-2.01.82-.53,1.81-.8,2.99-.8s2.18.27,2.99.81c.81.54,1.22,1.21,1.22,2,0,.7-.41,1.12-1.23,1.23-.82.12-1.81.18-2.99.18s-2.17-.06-2.99-.17ZM3.74,39.71v5.12c0,.45-.15.82-.46,1.1-.3.29-.68.43-1.13.43h-.56c-.46,0-.85-.14-1.15-.43-.3-.29-.45-.65-.45-1.1v-24.46L6.65,1.53c.16-.48.46-.86.89-1.13C7.97.13,8.44,0,8.97,0h35.34c.48,0,.9.14,1.27.41.37.27.63.65.79,1.12l6.65,18.83v24.46c0,.45-.15.82-.46,1.1-.3.29-.68.43-1.13.43h-.56c-.46,0-.85-.14-1.15-.43-.3-.29-.45-.65-.45-1.1v-5.12H3.74ZM4.42,17.26h44.18l-5.03-14.14H9.45s-5.03,14.14-5.03,14.14ZM11.21,32.12c1.02,0,1.88-.36,2.59-1.07.71-.71,1.06-1.58,1.06-2.6s-.36-1.88-1.07-2.59c-.71-.71-1.58-1.06-2.6-1.06s-1.88.36-2.59,1.07c-.71.71-1.06,1.58-1.06,2.6s.36,1.88,1.07,2.59c.71.71,1.58,1.06,2.6,1.06ZM41.82,32.12c1.02,0,1.88-.36,2.59-1.07.71-.71,1.06-1.58,1.06-2.6,0-1.02-.36-1.88-1.07-2.59-.71-.71-1.58-1.06-2.6-1.06s-1.88.36-2.59,1.07c-.71.71-1.06,1.58-1.06,2.6s.36,1.88,1.07,2.59c.71.71,1.58,1.06,2.6,1.06ZM3.12,36.59h46.77v-16.22H3.12Z"/>
  </svg>
);
const IconIluminacion = ({ color = "#fff", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 56.38 58.65" fill="none">
    <path fill={color} d="M26.22,57.16c-1.1-.99-1.75-2.23-1.96-3.71h11.67c-.21,1.48-.86,2.72-1.96,3.71-1.1.99-2.39,1.49-3.87,1.49s-2.77-.5-3.87-1.49ZM30.11,3.03c-2.46,0-4.81.48-7.04,1.44-2.23.96-4.14,2.23-5.73,3.81l-2.12-2.13c2.1-2.02,4.39-3.55,6.86-4.59,2.48-1.04,5.14-1.56,7.99-1.56,5.85,0,10.8,2.03,14.86,6.09,4.06,4.06,6.09,9.01,6.09,14.85,0,3.25-.6,6.08-1.79,8.49-1.2,2.41-2.69,4.54-4.48,6.39l-2.17-2.17c1.34-1.27,2.58-2.97,3.72-5.11,1.13-2.14,1.7-4.68,1.7-7.61,0-4.99-1.73-9.22-5.2-12.69-3.47-3.47-7.7-5.21-12.69-5.21ZM56.38,56.32l-2.14,2.14-19.89-19.87h-15.42c-3.04-2.01-5.43-4.52-7.17-7.55-1.74-3.03-2.61-6.4-2.61-10.1,0-1.15.1-2.34.3-3.58.2-1.24.46-2.21.77-2.92L0,4.2l2.13-2.13s54.25,54.25,54.25,54.25ZM19.85,35.56h11.48L12.69,16.92c-.13.52-.24,1.16-.35,1.93-.11.77-.16,1.47-.16,2.09,0,2.93.66,5.67,1.99,8.22,1.33,2.55,3.22,4.68,5.67,6.4ZM41.34,44.5v3.03h-22.54v-3.03h22.54Z"/>
  </svg>
);
 
const CATEGORIAS = {
  basural: {
    id: "basural", label: "Basural", Icon: IconBasural,
    color: "#2D9E4F", colorDark: "#1e7a3a",
    desc: "Residuos acumulados, containers desbordados, chancherías.",
    niveles: [
      { id: 1, label: "Descuido puntual", color: "#86efac" },
      { id: 2, label: "Acumulación vecinal", color: "#4ade80" },
      { id: 3, label: "Basural establecido", color: "#16a34a" },
    ],
    tipos: ["Domiciliario", "Escombros", "Mixto", "Chanchería", "Industrial"],
  },
  bache: {
    id: "bache", label: "Bache", Icon: IconBache,
    color: "#E03131", colorDark: "#b91c1c",
    desc: "Pozos en calles, asfalto en deterioro.",
    niveles: [
      { id: 1, label: "Pozo chico", color: "#fca5a5" },
      { id: 2, label: "Pozo mediano", color: "#f87171" },
      { id: 3, label: "Pozo grande", color: "#dc2626" },
    ],
    tipos: ["Alcantarilla", "Asfalto roto", "Badén", "Vereda", "Escombros"],
  },
  iluminacion: {
    id: "iluminacion", label: "Iluminación", Icon: IconIluminacion,
    color: "#334155", colorDark: "#1e293b",
    desc: "Luminarias rotas, zonas sin luz, cables colgando.",
    niveles: [
      { id: 1, label: "Luminaria apagada", color: "#94a3b8" },
      { id: 2, label: "Varias luces apagadas", color: "#64748b" },
      { id: 3, label: "Cuadra/s sin luz", color: "#1e293b" },
    ],
    tipos: ["Luminaria rota", "Cable caído", "No hay luminarias"],
  },
};
 
const CDELU = [-32.4833, -58.2333];
 
// ─── Hook animación de vista ──────────────────────────────────────────────────
function useAnimatedVista(initial) {
  const [vista, setVistaState] = useState(initial);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  function setVista(next) {
    if (next === vista) return;
    setDirection(next === "mapa" ? 1 : -1);
    setAnimating(true);
    setTimeout(() => { setVistaState(next); setAnimating(false); }, 220);
  }
  return { vista, setVista, animating, direction };
}
 
// ─── Leaflet helpers ──────────────────────────────────────────────────────────
function loadLeaflet(cb) {
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css"; link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
  }
  if (window.L) { cb(); return; }
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
  s.onload = cb; document.head.appendChild(s);
}
 
function makeCatPin(catId, nivel) {
  if (!window.L) return null;
  const cat = CATEGORIAS[catId];
  const opacity = nivel === 1 ? 0.85 : nivel === 2 ? 0.92 : 1;
  const svgPaths = {
    basural: "M8.81,53.22c-1.47,0-2.72-.51-3.74-1.54s-1.54-2.28-1.54-3.74V4.93H0v-2.47h13.04V0h21.15v2.47h13.04v2.47h-3.52v43c0,1.53-.5,2.79-1.5,3.79s-2.26,1.5-3.79,1.5H8.81ZM41.24,4.93H5.99v43c0,.82.26,1.5.79,2.03s1.2.79,2.03.79h29.61c.7,0,1.35-.29,1.94-.88s.88-1.23.88-1.94V4.93ZM16.74,43.7h2.47V11.98h-2.47v31.72ZM28.02,43.7h2.47V11.98h-2.47v31.72Z",
    bache: "M3.74,39.71v5.12c0,.45-.15.82-.46,1.1-.3.29-.68.43-1.13.43h-.56c-.46,0-.85-.14-1.15-.43-.3-.29-.45-.65-.45-1.1v-24.46L6.65,1.53c.16-.48.46-.86.89-1.13C7.97.13,8.44,0,8.97,0h35.34c.48,0,.9.14,1.27.41.37.27.63.65.79,1.12l6.65,18.83v24.46c0,.45-.15.82-.46,1.1-.3.29-.68.43-1.13.43h-.56c-.46,0-.85-.14-1.15-.43-.3-.29-.45-.65-.45-1.1v-5.12H3.74ZM4.42,17.26h44.18l-5.03-14.14H9.45s-5.03,14.14-5.03,14.14ZM11.21,32.12c1.02,0,1.88-.36,2.59-1.07.71-.71,1.06-1.58,1.06-2.6s-.36-1.88-1.07-2.59c-.71-.71-1.58-1.06-2.6-1.06s-1.88.36-2.59,1.07c-.71.71-1.06,1.58-1.06,2.6s.36,1.88,1.07,2.59c.71.71,1.58,1.06,2.6,1.06ZM41.82,32.12c1.02,0,1.88-.36,2.59-1.07.71-.71,1.06-1.58,1.06-2.6,0-1.02-.36-1.88-1.07-2.59-.71-.71-1.58-1.06-2.6-1.06s-1.88.36-2.59,1.07c-.71.71-1.06,1.58-1.06,2.6s.36,1.88,1.07,2.59c.71.71,1.58,1.06,2.6,1.06ZM3.12,36.59h46.77v-16.22H3.12Z",
    iluminacion: "M26.22,57.16c-1.1-.99-1.75-2.23-1.96-3.71h11.67c-.21,1.48-.86,2.72-1.96,3.71-1.1.99-2.39,1.49-3.87,1.49s-2.77-.5-3.87-1.49ZM56.38,56.32l-2.14,2.14-19.89-19.87h-15.42c-3.04-2.01-5.43-4.52-7.17-7.55-1.74-3.03-2.61-6.4-2.61-10.1,0-1.15.1-2.34.3-3.58.2-1.24.46-2.21.77-2.92L0,4.2l2.13-2.13s54.25,54.25,54.25,54.25ZM19.85,35.56h11.48L12.69,16.92c-.13.52-.24,1.16-.35,1.93-.11.77-.16,1.47-.16,2.09,0,2.93.66,5.67,1.99,8.22,1.33,2.55,3.22,4.68,5.67,6.4ZM41.34,44.5v3.03h-22.54v-3.03h22.54Z",
  };
  const vb = { basural: "0 0 47.23 53.22", bache: "0 0 53.01 59.77", iluminacion: "0 0 56.38 58.65" };
  const html = `<div style="width:38px;height:38px;border-radius:50%;background:${cat.color};opacity:${opacity};border:2.5px solid rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);">
    <svg width="17" height="17" viewBox="${vb[catId]}" fill="white"><path d="${svgPaths[catId]}"/></svg>
  </div>`;
  return window.L.divIcon({ html, className: "", iconSize: [38, 38], iconAnchor: [19, 19] });
}
 
// ─── Mapa pin selector ────────────────────────────────────────────────────────
function LeafletPinSelector({ catColor, onConfirm }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [coords, setCoords] = useState(CDELU);
 
  useEffect(() => {
    loadLeaflet(() => {
      if (!mapRef.current || leafletMap.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { center: CDELU, zoom: 15 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM", maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ html: `<div style="width:28px;height:28px;border-radius:50%;background:${catColor};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`, className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
      const marker = L.marker(CDELU, { icon, draggable: true }).addTo(map);
      marker.on("dragend", () => { const p = marker.getLatLng(); setCoords([p.lat, p.lng]); });
      map.on("click", e => { marker.setLatLng(e.latlng); setCoords([e.latlng.lat, e.latlng.lng]); });
      leafletMap.current = map;
      setTimeout(() => map.invalidateSize(), 300);
    });
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, []);
 
  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>Navegá el mapa y tocá el lugar exacto, o arrastrá el pin.</p>
      <div ref={mapRef} style={{ width: "100%", height: 200, borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }} />
      <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>📍</span>
        <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>CdelU, ER</span>
      </div>
      <button onClick={() => onConfirm({ lat: coords[0].toFixed(5), lng: coords[1].toFixed(5) })}
        style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 50, border: "none", background: catColor, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s, transform 0.15s" }}>
        Confirmar ubicación
      </button>
    </div>
  );
}
 
// ─── Mapa reportes ────────────────────────────────────────────────────────────
function LeafletReportesMap({ reportes, filtroCat, onSelect }) {
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
      setTimeout(() => { map.invalidateSize(); updateMarkers(map, reportes, filtroCat); }, 300);
    });
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, []);
 
  useEffect(() => { if (leafletMap.current) updateMarkers(leafletMap.current, reportes, filtroCat); }, [reportes, filtroCat]);
 
  function updateMarkers(map, reps, fil) {
    const L = window.L; if (!L) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    reps.filter(r => fil === "todos" || r.categoria === fil).forEach(r => {
      const icon = r.estado === "resuelto"
        ? L.divIcon({ html: `<div style="width:32px;height:32px;border-radius:50%;background:#22c55e;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">✓</div>`, className: "", iconSize: [32, 32], iconAnchor: [16, 16] })
        : makeCatPin(r.categoria, r.nivel);
      const m = L.marker([r.lat, r.lng], { icon }).addTo(map);
      m.on("click", () => onSelect(r));
      markersRef.current.push(m);
    });
  }
 
  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
 
// ─── Detalle reporte ──────────────────────────────────────────────────────────
function ReporteDetalle({ r, onVotar, onClose }) {
  const cat = CATEGORIAS[r.categoria];
  const nivel = cat.niveles.find(n => n.id === r.nivel);
  const [visible, setVisible] = useState(false);
  const [votando, setVotando] = useState(false);
 
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
 
  function handleClose() { setVisible(false); setTimeout(onClose, 280); }
 
  async function handleVotar(nuevoEstado) {
    setVotando(true);
    await onVotar(r.id, nuevoEstado, r.confirmaciones);
    handleClose();
  }
 
  const diasDesdeCreacion = r.created_at
    ? Math.floor((Date.now() - new Date(r.created_at)) / 86400000)
    : r.dias || 0;
 
  return (
    <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "16px 16px 20px", boxShadow: "0 -8px 30px rgba(0,0,0,0.15)", transform: visible ? "translateY(0)" : "translateY(100%)", opacity: visible ? 1 : 0, transition: "transform 0.3s cubic-bezier(0.34,1.2,0.64,1), opacity 0.25s ease" }}>
      <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 2, margin: "0 auto 14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <cat.Icon color="#fff" size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#1e293b", fontSize: 14 }}>{r.direccion}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{cat.label} · {r.tipo}</div>
          </div>
        </div>
        <button onClick={handleClose} style={{ background: "#f1f5f9", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 16, color: "#64748b" }}>×</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: nivel.color, border: "1px solid rgba(0,0,0,0.1)" }} />
        <span style={{ fontSize: 12, color: "#475569" }}>Nivel {nivel.id} — {nivel.label}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 10px", borderRadius: 20, background: r.estado === "resuelto" ? "#dcfce7" : "#fee2e2", color: r.estado === "resuelto" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
          {r.estado === "resuelto" ? "⭐ Resuelto" : "Activo"}
        </span>
      </div>
      {r.comentario && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "#f8fafc", borderLeft: `3px solid ${cat.color}`, marginBottom: 10, fontSize: 12, color: "#475569", fontStyle: "italic" }}>
          "{r.comentario}"
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[{ val: `${diasDesdeCreacion}d`, sub: "sin resolver" }, { val: r.confirmaciones, sub: "confirmaron" }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "#f8fafc", textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: i === 0 && diasDesdeCreacion > 14 ? "#dc2626" : "#1e293b" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {r.estado !== "resuelto" && (
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { estado: "activo", label: "Sigue ahí", color: "#dc2626", bg: "#fee2e2" },
            { estado: "parcial", label: "En proceso", color: "#d97706", bg: "#fef3c7" },
            { estado: "resuelto", label: "⭐ Resuelto", color: "#16a34a", bg: "#dcfce7" },
          ].map(b => (
            <button key={b.estado} onClick={() => handleVotar(b.estado)} disabled={votando}
              style={{ flex: 1, padding: "9px 0", borderRadius: 50, border: "none", background: b.bg, color: b.color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: votando ? 0.6 : 1, transition: "transform 0.15s, opacity 0.15s" }}>
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
 
// ─── Formulario denuncia ──────────────────────────────────────────────────────
function FormDenuncia({ categoria, onClose, onSubmit }) {
  const cat = CATEGORIAS[categoria];
  const [paso, setPaso] = useState(1);
  const [nivel, setNivel] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [comentario, setComentario] = useState("");
  const [ubicacion, setUbicacion] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [pasoDir, setPasoDir] = useState(1);
  const [error, setError] = useState(null);
 
  function goTo(p) { setPasoDir(p > paso ? 1 : -1); setPaso(p); }
 
  async function handleSubmit() {
    if (!nivel || !tipo || !ubicacion || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      await onSubmit({
        categoria, nivel, tipo,
        comentario: comentario || null,
        direccion: `${ubicacion.lat}, ${ubicacion.lng}`,
        lat: parseFloat(ubicacion.lat),
        lng: parseFloat(ubicacion.lng),
        estado: "activo",
        confirmaciones: 1,
      });
      setEnviado(true);
      setTimeout(onClose, 2500);
    } catch (e) {
      setError("Hubo un error al enviar. Intentá de nuevo.");
      setEnviando(false);
    }
  }
 
  if (enviado) return (
    <div style={{ textAlign: "center", padding: "50px 20px", animation: "popIn 0.4s cubic-bezier(0.34,1.4,0.64,1)" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 24px ${cat.color}66` }}>
        <cat.Icon color="#fff" size={30} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 22, color: "#1e293b", marginBottom: 8 }}>¡Reclamo enviado!</div>
      <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>100% anónimo.<br />La comunidad puede confirmarlo.</div>
    </div>
  );
 
  const stepAnim = `stepIn${pasoDir > 0 ? "Right" : "Left"} 0.25s cubic-bezier(0.4,0,0.2,1)`;
 
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "12px 14px", borderRadius: 14, background: cat.color, boxShadow: `0 4px 14px ${cat.color}55` }}>
        <cat.Icon color="#fff" size={22} />
        <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Nuevo reclamo — {cat.label}</div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {["Gravedad", "Tipo", "Ubicación"].map((p, i) => (
          <div key={p} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 2, background: i + 1 <= paso ? cat.color : "#e2e8f0", marginBottom: 4, transition: "background 0.4s ease" }} />
            <div style={{ fontSize: 10, color: i + 1 <= paso ? cat.color : "#94a3b8", fontWeight: 700, transition: "color 0.3s" }}>{p}</div>
          </div>
        ))}
      </div>
 
      {paso === 1 && (
        <div style={{ animation: stepAnim }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1e293b", marginBottom: 4 }}>¿Qué tan grave es?</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Elegí el nivel que mejor describe la situación</div>
          {cat.niveles.map((n, i) => (
            <div key={n.id} onClick={() => setNivel(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, marginBottom: 10, cursor: "pointer", border: `2px solid ${nivel === n.id ? cat.color : "#e2e8f0"}`, background: nivel === n.id ? cat.color + "10" : "#fff", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", transform: nivel === n.id ? "scale(1.01)" : "scale(1)", animation: `fadeUp 0.25s ease-out ${i * 0.06}s both` }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: n.color, flexShrink: 0, transition: "transform 0.2s", transform: nivel === n.id ? "scale(1.3)" : "scale(1)" }} />
              <span style={{ fontSize: 14, color: "#1e293b", fontWeight: nivel === n.id ? 800 : 500 }}>Nivel {n.id} — {n.label}</span>
              {nivel === n.id && <span style={{ marginLeft: "auto", color: cat.color, fontSize: 18 }}>✓</span>}
            </div>
          ))}
          <button onClick={() => nivel && goTo(2)}
            style={{ width: "100%", marginTop: 4, padding: "14px", borderRadius: 50, border: "none", background: nivel ? cat.color : "#e2e8f0", color: nivel ? "#fff" : "#94a3b8", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: nivel ? "pointer" : "default", transition: "all 0.25s", boxShadow: nivel ? `0 4px 14px ${cat.color}44` : "none" }}>
            Siguiente
          </button>
        </div>
      )}
 
      {paso === 2 && (
        <div style={{ animation: stepAnim }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1e293b", marginBottom: 4 }}>¿Qué tipo?</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Seleccioná el tipo predominante</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {cat.tipos.map((t, i) => (
              <button key={t} onClick={() => setTipo(t)}
                style={{ padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontFamily: "inherit", border: `1.5px solid ${tipo === t ? cat.color : "#e2e8f0"}`, background: tipo === t ? cat.color : "#fff", color: tipo === t ? "#fff" : "#475569", fontSize: 13, fontWeight: tipo === t ? 700 : 500, transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", transform: tipo === t ? "scale(1.04)" : "scale(1)", boxShadow: tipo === t ? `0 2px 10px ${cat.color}44` : "none", animation: `fadeUp 0.2s ease-out ${i * 0.04}s both` }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 8, fontWeight: 700 }}>Comentario <span style={{ color: "#94a3b8", fontWeight: 400 }}>(opcional)</span></div>
            <textarea value={comentario} onChange={e => setComentario(e.target.value)}
              placeholder="Describí lo que ves con más detalle." maxLength={280} rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #e2e8f0", color: "#1e293b", fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, outline: "none", resize: "none", background: "#f8fafc", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = cat.color}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{comentario.length}/280</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1.5px dashed #e2e8f0", marginBottom: 14, cursor: "pointer", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            📷 Agregar foto (próximamente)
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => goTo(1)} style={{ flex: 1, padding: "14px", borderRadius: 50, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Atrás</button>
            <button onClick={() => tipo && goTo(3)} style={{ flex: 2, padding: "14px", borderRadius: 50, border: "none", background: tipo ? cat.color : "#e2e8f0", color: tipo ? "#fff" : "#94a3b8", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: tipo ? "pointer" : "default", transition: "all 0.25s", boxShadow: tipo ? `0 4px 14px ${cat.color}44` : "none" }}>Siguiente</button>
          </div>
        </div>
      )}
 
      {paso === 3 && (
        <div style={{ animation: stepAnim }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1e293b", marginBottom: 4 }}>Marcá la ubicación</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>Navegá el mapa y tocá el lugar exacto.</div>
          {!ubicacion ? (
            <>
              <LeafletPinSelector catColor={cat.color} onConfirm={pos => setUbicacion(pos)} />
              <button onClick={() => goTo(2)} style={{ width: "100%", marginTop: 10, padding: "13px", borderRadius: 50, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Atrás</button>
            </>
          ) : (
            <div style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.3,0.64,1)" }}>
              <div style={{ padding: "12px 14px", borderRadius: 12, background: cat.color + "10", border: `1.5px solid ${cat.color}44`, marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Ubicación confirmada</div>
                <div style={{ fontSize: 13, color: "#475569", fontFamily: "monospace" }}>📍 {ubicacion.lat}, {ubicacion.lng}</div>
                <button onClick={() => setUbicacion(null)} style={{ marginTop: 6, background: "none", border: "none", color: cat.color, fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0, fontWeight: 700 }}>Cambiar ubicación</button>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1.5px solid #e2e8f0", marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Resumen</div>
                {[
                  { label: "Categoría", val: cat.label },
                  { label: "Gravedad", val: `Nivel ${nivel} — ${cat.niveles.find(n => n.id === nivel)?.label}` },
                  { label: "Tipo", val: tipo },
                  ...(comentario ? [{ label: "Comentario", val: comentario.length > 40 ? comentario.slice(0, 40) + "…" : comentario }] : []),
                ].map((item, i) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 8, animation: `fadeUp 0.2s ease-out ${i * 0.05}s both` }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, textAlign: "right" }}>{item.val}</span>
                  </div>
                ))}
              </div>
              {error && <div style={{ fontSize: 12, color: "#dc2626", textAlign: "center", marginBottom: 10 }}>{error}</div>}
              <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginBottom: 12 }}>🔒 Reclamo 100% anónimo · Sin datos personales</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setUbicacion(null)} style={{ flex: 1, padding: "14px", borderRadius: 50, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Atrás</button>
                <button onClick={handleSubmit} disabled={enviando}
                  style={{ flex: 2, padding: "14px", borderRadius: 50, border: "none", background: cat.color, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: enviando ? "default" : "pointer", boxShadow: `0 4px 16px ${cat.color}55`, opacity: enviando ? 0.7 : 1, transition: "all 0.2s" }}>
                  {enviando ? "Enviando..." : "Enviar reclamo"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 
// ─── App principal ────────────────────────────────────────────────────────────
export default function App() {
  const { vista, setVista, animating, direction } = useAnimatedVista("reclamar");
  const [showForm, setShowForm] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [filtroCat, setFiltroCat] = useState("todos");
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
 
  // Cargar reclamos desde Supabase
  async function cargarReclamos() {
    try {
      const data = await supabase("GET", "reclamos?order=created_at.desc");
      setReportes(data || []);
    } catch (e) {
      console.error("Error cargando reclamos:", e);
    } finally {
      setCargando(false);
    }
  }
 
  useEffect(() => { cargarReclamos(); }, []);
 
  function openForm(catId) {
    setCategoriaActiva(catId);
    setShowForm(true);
    requestAnimationFrame(() => setFormVisible(true));
  }
 
  function closeForm() {
    setFormVisible(false);
    setTimeout(() => { setShowForm(false); setCategoriaActiva(null); }, 300);
  }
 
  async function onSubmit(data) {
    const nuevo = await supabase("POST", "reclamos", data);
    if (nuevo && nuevo[0]) setReportes(prev => [nuevo[0], ...prev]);
    closeForm();
    setTimeout(() => { setVista("mapa"); setFiltroCat(data.categoria); }, 320);
  }
 
  async function onVotar(id, nuevoEstado, confirmacionesActuales) {
    await supabase("PATCH", `reclamos?id=eq.${id}`, {
      estado: nuevoEstado,
      confirmaciones: confirmacionesActuales + 1,
    });
    setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado, confirmaciones: r.confirmaciones + 1 } : r));
  }
 
  const totalActivos = reportes.filter(r => r.estado === "activo").length;
 
  const slideStyle = {
    transform: animating ? `translateX(${direction * -40}px)` : "translateX(0)",
    opacity: animating ? 0 : 1,
    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
        @keyframes stepInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes stepInLeft { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .leaflet-control-zoom { border:none!important; box-shadow:0 2px 8px rgba(0,0,0,0.15)!important; border-radius:10px!important; overflow:hidden; }
        .leaflet-control-zoom a { background:#fff!important; color:#1e293b!important; border:none!important; font-weight:700; width:32px!important; height:32px!important; line-height:32px!important; }
        .leaflet-control-zoom a:hover { background:#f1f5f9!important; }
        .leaflet-control-attribution { font-size:9px!important; }
        textarea::placeholder { color:#cbd5e1; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.1); border-radius:2px; }
      `}</style>
 
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#131d35", fontFamily: "'Nunito', sans-serif", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 390, height: 760, display: "flex", flexDirection: "column", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.6)", background: "#1e3163", position: "relative" }}>
 
          {/* Header */}
          <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 22, color: "#fff", letterSpacing: -0.5 }}>CdelU Reclama</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Concepción del Uruguay, Entre Ríos</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "6px 14px", textAlign: "center" }}>
                {cargando
                  ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                  : <div style={{ fontWeight: 900, fontSize: 20, color: "#fff", lineHeight: 1 }}>{totalActivos}</div>
                }
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>activos</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: 4, marginBottom: 20 }}>
              {[{ id: "reclamar", label: "Reclamar" }, { id: "mapa", label: "Ver mapa" }].map(tab => (
                <button key={tab.id} onClick={() => setVista(tab.id)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 50, border: "none", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", background: vista === tab.id ? "#fff" : "transparent", color: vista === tab.id ? "#1e3163" : "rgba(255,255,255,0.5)", boxShadow: vista === tab.id ? "0 2px 8px rgba(0,0,0,0.15)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
 
          {/* Contenido */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ ...slideStyle, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
 
              {/* Vista RECLAMAR */}
              {vista === "reclamar" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 18, textAlign: "center", lineHeight: 1.6 }}>
                    Hacé tu reclamo en 3 pasos.<br />
                    <span style={{ color: "rgba(255,255,255,0.25)" }}>Anónimo, gratis y directo.</span>
                  </div>
                  {Object.values(CATEGORIAS).map((cat, i) => (
                    <div key={cat.id} onClick={() => openForm(cat.id)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderRadius: 18, marginBottom: 12, background: "#fff", cursor: "pointer", transition: "transform 0.2s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.15)", animation: `fadeUp 0.35s ease-out ${i * 0.08}s both` }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.01)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)"; }}>
                      <div style={{ width: 50, height: 50, borderRadius: 15, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${cat.color}55` }}>
                        <cat.Icon color="#fff" size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#1e293b" }}>{cat.label}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, lineHeight: 1.4 }}>{cat.desc}</div>
                      </div>
                      <div style={{ color: "#cbd5e1", fontSize: 22 }}>›</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 4, padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", animation: "fadeUp 0.35s ease-out 0.24s both" }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Más categorías próximamente</div>
                  </div>
                </div>
              )}
 
              {/* Vista MAPA */}
              {vista === "mapa" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                  <div style={{ padding: "0 12px 10px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
                    {[{ id: "todos", label: "Todos" }, ...Object.values(CATEGORIAS).map(c => ({ id: c.id, label: c.label }))].map(f => (
                      <button key={f.id} onClick={() => setFiltroCat(f.id)}
                        style={{ padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700, border: "none", background: filtroCat === f.id ? "#fff" : "rgba(255,255,255,0.1)", color: filtroCat === f.id ? "#1e3163" : "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", transform: filtroCat === f.id ? "scale(1.04)" : "scale(1)" }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    {cargando ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.4)", flexDirection: "column", gap: 12 }}>
                        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.2)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        <div style={{ fontSize: 13 }}>Cargando reclamos...</div>
                      </div>
                    ) : (
                      <LeafletReportesMap reportes={reportes} filtroCat={filtroCat} onSelect={r => setReporteSeleccionado(r)} />
                    )}
                  </div>
                  {/* Leyenda */}
                  <div style={{ position: "absolute", bottom: reporteSeleccionado ? 220 : 12, left: 12, zIndex: 500, background: "rgba(30,49,99,0.92)", borderRadius: 12, padding: "8px 10px", backdropFilter: "blur(8px)", transition: "bottom 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
                    {Object.values(CATEGORIAS).map(c => (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                        <span>{c.label}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                      <span>Resuelto</span>
                    </div>
                  </div>
                  {reporteSeleccionado && (
                    <div style={{ flexShrink: 0 }}>
                      <ReporteDetalle r={reporteSeleccionado} onVotar={onVotar} onClose={() => setReporteSeleccionado(null)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
 
          {/* Modal formulario */}
          {showForm && categoriaActiva && (
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${formVisible ? 0.6 : 0})`, display: "flex", alignItems: "flex-end", zIndex: 20, transition: "background 0.3s ease" }}
              onClick={e => e.target === e.currentTarget && closeForm()}>
              <div style={{ width: "100%", background: "#fff", borderRadius: "24px 24px 0 0", padding: "16px 18px 28px", maxHeight: "92%", overflowY: "auto", transform: formVisible ? "translateY(0)" : "translateY(100%)", opacity: formVisible ? 1 : 0, transition: "transform 0.35s cubic-bezier(0.34,1.1,0.64,1), opacity 0.25s ease" }}>
                <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 2, margin: "0 auto 12px" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                  <button onClick={closeForm} style={{ background: "#f1f5f9", border: "none", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16, color: "#64748b", transition: "background 0.15s, transform 0.15s" }}
                    onMouseEnter={e => { e.target.style.background = "#e2e8f0"; e.target.style.transform = "rotate(90deg)"; }}
                    onMouseLeave={e => { e.target.style.background = "#f1f5f9"; e.target.style.transform = "rotate(0)"; }}>×</button>
                </div>
                <FormDenuncia categoria={categoriaActiva} onClose={closeForm} onSubmit={onSubmit} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
