interface MetricasProps {
  resumen: {
    total_registros: number;
    centro_urbano: { lat: number; lon: number };
    dispersion: { std_lat: number; std_lon: number };
  };
  probabilidades: Record<string, number>;
  depto: string;
}


export default function TarjetasMetricas({ resumen, probabilidades, depto }: MetricasProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Tarjeta de Estadística Descriptiva */}
      <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: 0, color: '#ffffff', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
          Estadística Descriptiva
        </h3>
        <p style={{ fontSize: '15px', color: '#e5e7eb' }}><b>Tamaño de la Muestra (n):</b> {resumen.total_registros} establecimientos.</p>
        
        <h4 style={{ color: '#60a5fa', marginBottom: '5px', fontWeight: 'bold' }}>Centro Urbano (Media)</h4>
        <p style={{ margin: '3px 0', fontSize: '14px', color: '#d1d5db' }}>Latitud Promedio: <b style={{ color: '#ffffff' }}>{resumen.centro_urbano.lat.toFixed(6)}°</b></p>
        <p style={{ margin: '3px 0', fontSize: '14px', color: '#d1d5db' }}>Longitud Promedio: <b style={{ color: '#ffffff' }}>{resumen.centro_urbano.lon.toFixed(6)}°</b></p>
        
        <h4 style={{ color: '#60a5fa', marginBottom: '5px', marginTop: '15px', fontWeight: 'bold' }}>Dispersión Espacial (Desviación Estándar s)</h4>
        <p style={{ margin: '3px 0', fontSize: '14px', color: '#d1d5db' }}>Dispersión Latitud: <b style={{ color: '#ffffff' }}>{resumen.dispersion.std_lat.toFixed(6)}</b></p>
        <p style={{ margin: '3px 0', fontSize: '14px', color: '#d1d5db' }}>Dispersión Longitud: <b style={{ color: '#ffffff' }}>{resumen.dispersion.std_lon.toFixed(6)}</b></p>
      </div>

      {/* Tarjeta de Probabilidad Condicional */}
      <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: 0, color: '#34d399', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
          Teorema de Probabilidad Condicional
        </h3>
        <p style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>
          Si seleccionamos un establecimiento al azar dentro de la subpoblación de <b>{depto}</b>:
        </p>
        <div style={{ marginTop: '15px' }}>
          {Object.keys(probabilidades).length > 0 ? (
            Object.entries(probabilidades).map(([tipo, porcentaje]) => (
              <div key={tipo} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#2d2d34', borderRadius: '6px', borderLeft: '4px solid #34d399' }}>
                <span style={{ fontSize: '15px', color: '#ffffff' }}>
                  P({tipo} | {depto}) = <b style={{ color: '#34d399' }}>{porcentaje}%</b>
                </span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#f87171' }}>No hay probabilidades calculadas.</p>
          )}
        </div>
      </div>

    </div>
  );
}