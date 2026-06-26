import pandas as pd
import numpy as np

def calcular_estadistica_descriptiva(df_filtrado, depto: str):
    """
    Recibe el DataFrame filtrado por departamento y calcula las 
    fórmulas descriptivas espaciales (Tendencia Central y Dispersión).
    """
    # CONTROL DE VARIABLES INVERTIDAS:
    # Como en La Paz y Santa Cruz las columnas están rotuladas al revés:
    # La columna 'Latitud' guarda la Longitud real (-68) y viceversa.
    if depto.upper() in ["LA PAZ", "SANTA CRUZ"]:
        col_lat = "Longitud"
        col_lon = "Latitud"
    else:
        # Beni tiene el orden geográfico estándar
        col_lat = "Latitud"
        col_lon = "Longitud"

    # 1. MEDIDAS DE TENDENCIA CENTRAL (Media)
    # Fórmula: x_barra = sum(x_i) / n
    media_lat = float(df_filtrado[col_lat].mean())
    media_lon = float(df_filtrado[col_lon].mean())

    # 2. MEDIDAS DE DISPERSIÓN (Desviación Estándar)
    # Fórmula: s = sqrt( sum(x_i - x_barra)^2 / (n - 1) )
    std_lat = float(df_filtrado[col_lat].std())
    std_lon = float(df_filtrado[col_lon].std())

    return {
        "total_registros": len(df_filtrado),
        "centro_urbano": {
            "lat": media_lat,
            "lon": media_lon
        },
        "dispersion": {
            "std_lat": std_lat,
            "std_lon": std_lon
        }
    }

def calcular_probabilidad_condicional(df_filtrado):
    """
    Calcula P(Tipo | Departamento) aplicando probabilidad clásica
    sobre la variable cualitativa nominal 'Tipo'.
    Fórmula: Casos favorables / Casos totales
    """
    total_casos_depto = len(df_filtrado)
    
    # Frecuencias absolutas por cada tipo (Mercado, CentroMedico, etc.)
    conteo_tipos = df_filtrado['Tipo'].value_counts().to_dict()

    # Frecuencia relativa convertida a porcentaje
    probabilidades = {}
    for tipo, cantidad in conteo_tipos.items():
        prob_clasica = (cantidad / total_casos_depto) * 100
        probabilidades[tipo] = round(prob_clasica, 2)

    return probabilidades