import { useState, useEffect } from 'react';
import { type MetricasEstadisticas } from './types';
import SelectorDepto from './componentes/SelectorDepto';
import TarjetasMetricas from './componentes/TarjetasMetricas';
import MapaDispersion from './componentes/MapaDispersion';
import MapDashboard from './componentes/Mapa_dasboard';

export default function App() {
  const [departamento, setDepartamento] = useState<string>('');
  const [listaDeptos, setListaDeptos] = useState<string[]>([]); // <-- ESTADO PARA LA LISTA
  const [datos, setDatos] = useState<MetricasEstadisticas | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/departamentos')
      .then((res) => res.json())
      .then((list) => {
        setListaDeptos(list);
        if (list.length > 0) setDepartamento(list[0]); // Selecciona el primero por defecto
      })
      .catch((err) => console.error("Error cargando departamentos:", err));
  }, []);


  useEffect(() => {
    if (!departamento) return;
    setCargando(true);
    fetch(`http://127.0.0.1:8000/api/estadistica?depto=${encodeURIComponent(departamento)}`)
      .then((res) => res.json())
      .then((data: MetricasEstadisticas) => {
        setDatos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error conectando con Python:", err);
        setCargando(false);
      });
  }, [departamento]);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#121214', minHeight: '100vh', color: '#f3f4f6' }}>
      <header style={{ marginBottom: '25px' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontWeight: 'bold' }}>Dashboard de Infraestructura Urbana de Bolivia</h1>
        <p style={{ color: '#9ca3af', marginTop: '5px' }}>Análisis de Estadística Descriptiva y Probabilidad Condicional</p>
      </header>

      <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
        <SelectorDepto deptoSeleccionado={departamento} alCambiarDepto={setDepartamento} listaDepartamentos={listaDeptos} />
      </div>

      {cargando && <p style={{ color: '#60a5fa', fontWeight: 'bold' }}>Calculando fórmulas estadísticas en Python...</p>}

      {!cargando && datos && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
          <div>
            <TarjetasMetricas resumen={datos.resumen} probabilidades={datos.probabilidades} depto={departamento} />
          </div>
          <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#ffffff', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>Mapa de Dispersión de Coordenadas</h3>
            <MapaDispersion puntos={datos.puntos} centro={datos.resumen.centro_urbano} depto={departamento} />
          </div>
        </div> 
      )}
      <MapDashboard />
    </div>
  );
}