import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function MapDashboard() {
  const [cargando, setCargando] = useState(false);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  
  const [listaCiudades, setListaCiudades] = useState<string[]>([]);
  const [listaTipos, setListaTipos] = useState<string[]>([]);
  
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('Todos');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/departamentos')
      .then((res) => res.json())
      .then((data) => {
        setListaCiudades(data);
        if (data.length > 0) setCiudadSeleccionada(data[0]);
      });

    fetch('http://127.0.0.1:8000/api/tipos')
      .then((res) => res.json())
      .then((data) => {
        setListaTipos(['Todos', ...data]);
      });
  }, []);

  const manejarBusqueda = async () => {
    if (!ciudadSeleccionada) return;
    setCargando(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/conteo-tipos?depto=${encodeURIComponent(ciudadSeleccionada)}`);
      const datos = await res.json();
      setEstadisticas(datos);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const datosGrafica = estadisticas?.data_grafica || [];
  
  const datosFiltrados = tipoSeleccionado === 'Todos' 
    ? datosGrafica 
    : datosGrafica.filter((d: any) => d.nombre === tipoSeleccionado);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
      
      <div>
        <h3 style={{ marginTop: 0, color: '#ffffff', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
          Histograma de Infraestructuras
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          
          <select
            value={ciudadSeleccionada}
            onChange={(e) => setCiudadSeleccionada(e.target.value)}
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #4b5563',
              backgroundColor: '#2d2d34',
              color: '#ffffff',
              outline: 'none'
            }}
          >
            {listaCiudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>

          <select
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #4b5563',
              backgroundColor: '#2d2d34',
              color: '#ffffff',
              outline: 'none'
            }}
          >
            {listaTipos.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <button 
            onClick={manejarBusqueda} 
            disabled={cargando}
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: cargando ? '#4b5563' : '#3b82f6',
              color: '#ffffff',
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            {cargando ? 'Cargando...' : `Buscar en ${ciudadSeleccionada}`}
          </button>
        </div>
        
        {estadisticas && (
          <div style={{ padding: '15px', backgroundColor: '#2d2d34', borderRadius: '6px', borderLeft: '4px solid #e928d9' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#d1d5db', fontWeight: 'bold', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
              Total en {ciudadSeleccionada}: <span style={{ color: '#00d1ff' }}>{estadisticas.total_encontrados}</span>
            </p>
            <div style={{ display: 'grid', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
              {datosFiltrados.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e24', padding: '8px 12px', borderRadius: '4px' }}>
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>{item.nombre}</span>
                  <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>{item.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '350px', backgroundColor: '#16161a', padding: '15px', borderRadius: '8px', border: '1px solid #374151' }}>
        {estadisticas && datosFiltrados.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosFiltrados}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="nombre" stroke="#9ca3af" fontSize={12} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                cursor={{ fill: '#2d2d34' }} 
                contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#4b5563', color: '#ffffff' }}
              />
              <Bar dataKey="cantidad" fill="#00d1ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
              {estadisticas ? 'Sin datos para el filtro seleccionado.' : 'Haz clic en buscar para ver el histograma.'}
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
}