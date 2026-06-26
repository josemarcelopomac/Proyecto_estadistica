import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface Punto {
  Nombre: string;
  Tipo: string;
  Latitud: number;
  Longitud: number;
}

interface MapaProps {
  puntos: Punto[];
  centro: { lat: number; lon: number };
  depto: string;
}

export default function MapaDispersion({ puntos, centro }: MapaProps) {
  const mercados = puntos.filter(p => p.Tipo === 'Mercado');
  const centrosMedicos = puntos.filter(p => p.Tipo === 'CentroMedico');

  return (
    <div style={{ width: '100%', height: '450px', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          {/* Cambiamos las líneas de la cuadrícula a un color sutil para modo oscuro */}
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          {/* Los textos de los ejes ahora se renderizan en gris claro usando el atributo stroke */}
          <XAxis type="number" dataKey="Longitud" name="Longitud" domain={['dataMin', 'dataMax']} tickFormatter={(v) => v.toFixed(2)} stroke="#9ca3af" />
          <YAxis type="number" dataKey="Latitud" name="Latitud" domain={['dataMin', 'dataMax']} tickFormatter={(v) => v.toFixed(2)} stroke="#9ca3af" />
          {/* Contenedor del Tooltip adaptado a modo oscuro */}
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#4b5563', color: '#ffffff' }}
          />
          <Scatter name="Mercados" data={mercados} fill="#60a5fa" shape="circle" />
          <Scatter name="Centros Médicos" data={centrosMedicos} fill="#34d399" shape="circle" />
          <ReferenceDot x={centro.lon} y={centro.lat} r={9} fill="#f87171" stroke="#ffffff" strokeWidth={2} />
        </ScatterChart>
      </ResponsiveContainer>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', fontSize: '13px', marginTop: '15px', color: '#e5e7eb' }}>
        <span><span style={{ color: '#60a5fa', marginRight: '5px' }}>●</span> Mercados</span>
        <span><span style={{ color: '#34d399', marginRight: '5px' }}>●</span> Centros Médicos</span>
        <span><span style={{ color: '#f87171', marginRight: '5px' }}>●</span> Centro Geográfico Urbano (Media X)</span>
      </div>
    </div>
  );
}