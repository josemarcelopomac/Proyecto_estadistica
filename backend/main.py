from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from formulas import calcular_estadistica_descriptiva, calcular_probabilidad_condicional
import os # <-- IMPORTAMOS ESTO
app = FastAPI()

# Permite que tu frontend de React (localhost:5173) se conecte con Python sin bloqueos de seguridad
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUTA_CSV = os.path.join(BASE_DIR, "infraestructuras_bolivia_v1.csv")

# Cargar el archivo maestro forzando el separador correcto (punto y coma o coma)
# Si tu archivo usa comas, puedes cambiar sep=';' por sep=',' 
try:
    df_global = pd.read_csv(RUTA_CSV, sep=';')
    if 'Latitud' not in df_global.columns:
        df_global = pd.read_csv(RUTA_CSV, sep=',') 
except Exception:
    df_global = pd.read_csv(RUTA_CSV)

# LIMPIEZA CRÍTICA: Forzar que Latitud y Longitud sean números puros
df_global['Latitud'] = pd.to_numeric(df_global['Latitud'], errors='coerce')
df_global['Longitud'] = pd.to_numeric(df_global['Longitud'], errors='coerce')

# Limpiar espacios en los nombres de los departamentos
df_global['Departamento'] = df_global['Departamento'].astype(str).str.strip().str.upper()

# Eliminar filas que se hayan quedado sin coordenadas válidas por el error
df_global = df_global.dropna(subset=['Latitud', 'Longitud'])



@app.get("/api/departamentos")
def obtener_departamentos():
    # Extrae todos los departamentos únicos, quita repetidos y elimina espacios vacíos
    deptos_unicos = df_global['Departamento'].unique().tolist()
    # Volvemos a poner el formato correcto (Ej: LA PAZ -> La Paz)
    deptos_formateados = [d.title() for d in deptos_unicos if str(d).strip() != ""]
    return sorted(deptos_formateados) 



@app.get("/api/estadistica")
def obtener_analisis(depto: str):
    # 1. Filtrar reactivamente el dataset según el departamento solicitado por el usuario
    df_filtrado = df_global[df_global['Departamento'].str.upper() == depto.upper()]

    if df_filtrado.empty:
        return {"error": f"No se encontraron datos para el departamento: {depto}"}

    # 2. Ejecutar las funciones estadísticas
    resumen_descriptivo = calcular_estadistica_descriptiva(df_filtrado, depto)
    probabilidades_tipo = calcular_probabilidad_condicional(df_filtrado)

    # 3. Formatear los puntos para el mapa controlando la inversión de etiquetas
    puntos_mapeados = []
    for _, fila in df_filtrado.iterrows():
        # Corregimos las etiquetas de salida para que React reciba latitud y longitud correctas
        if depto.upper() in ["LA PAZ", "SANTA CRUZ"]:
            lat_real = fila["Longitud"]
            lon_real = fila["Latitud"]
        else:
            lat_real = fila["Latitud"]
            lon_real = fila["Longitud"]

        puntos_mapeados.append({
            "Nombre": fila["Nombre"],
            "Tipo": fila["Tipo"],
            "Latitud": float(lat_real),
            "Longitud": float(lon_real)
        })

    # 4. Enviar el JSON estructurado a React
    return {
        "resumen": resumen_descriptivo,
        "probabilidades": probabilidades_tipo,
        "puntos": puntos_mapeados
    }