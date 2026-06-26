interface SelectorProps {
  deptoSeleccionado: string;
  alCambiarDepto: (nuevoDepto: string) => void;
  listaDepartamentos: string[]; // <-- NUEVA PROPIEDAD
}

export default function SelectorDepto({ deptoSeleccionado, alCambiarDepto, listaDepartamentos }: SelectorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <label htmlFor="depto-select" style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
        Filtrar Región de Análisis:
      </label>
      <select
        id="depto-select"
        value={deptoSeleccionado}
        onChange={(e) => alCambiarDepto(e.target.value)}
        style={{
          padding: '10px 15px',
          fontSize: '16px',
          borderRadius: '6px',
          border: '1px solid #4b5563',
          backgroundColor: '#2d2d34',
          color: '#ffffff',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {listaDepartamentos.map((depto) => (
          <option key={depto} value={depto} style={{ backgroundColor: '#2d2d34', color: '#ffffff' }}>
            {depto}
          </option>
        ))}
      </select>
    </div>
  );
}