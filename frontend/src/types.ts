export interface MetricasEstadisticas {
  resumen: {
    total_registros: number;
    centro_urbano: { lat: number; lon: number };
    dispersion: { std_lat: number; std_lon: number };
  };
  probabilidades: Record<string, number>;
  puntos: {
    Nombre: string;
    Tipo: string;
    Latitud: number;
    Longitud: number;
  }[];
}