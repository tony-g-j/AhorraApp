// Importación de librerías necesarias
import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
// Se importan los componentes PieChart y LineChart desde la librería react-native-chart-kit
// PieChart: muestra gráficos de pastel (porciones por categoría)
// LineChart: muestra gráficos de líneas (tendencias en el tiempo)
import { PieChart, LineChart } from "react-native-chart-kit";

// Se obtiene el ancho de la pantalla del dispositivo para ajustar el tamaño de las gráficas
const screenWidth = Dimensions.get("window").width;

// Componente principal que muestra las gráficas
export default function GraficaScreen() {
  // Datos de ejemplo para ingresos por categoría
  const ingresosPorCategoria = [
    { name: "Trabajo", amount: 2500, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Ventas", amount: 800, color: "#81C784", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Regalos", amount: 300, color: "#A5D6A7", legendFontColor: "#333", legendFontSize: 13 },
  ];

  // Datos de ejemplo para egresos por categoría
  const egresosPorCategoria = [
    { name: "Comida", amount: 1200, color: "#E53935", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Transporte", amount: 600, color: "#EF5350", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Ocio", amount: 400, color: "#FF8A80", legendFontColor: "#333", legendFontSize: 13 },
  ];

  // Datos para la gráfica de líneas (evolución mensual de ingresos y egresos)
  const dataMensual = {
    // Etiquetas de los meses
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        // Datos de ingresos por mes
        data: [2500, 2300, 2800, 2600, 3000, 2900],
        color: () => "#4CAF50", // Color verde
        strokeWidth: 2, // Grosor de la línea
      },
      {
        // Datos de egresos por mes
        data: [1800, 1900, 2100, 2000, 2200, 2400],
        color: () => "#E53935", // Color rojo
        strokeWidth: 2,
      },
    ],
    legend: ["Ingresos", "Egresos"], // Etiquetas que se muestran en la leyenda
  };

  // Configuración general de las gráficas
  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#f8f9fa",
    backgroundGradientTo: "#f8f9fa",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color del texto y líneas
  };

  // Interfaz principal del componente
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}> Gráficas Financieras</Text>

      {/* Gráfica de pastel: ingresos por categoría */}
      <Text style={styles.subtitle}>Ingresos por Categoría</Text>
      <PieChart
        data={ingresosPorCategoria}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConfig}
        accessor="amount" // Campo que se toma como valor numérico
        backgroundColor="transparent"
      />

      {/* Gráfica de pastel: egresos por categoría */}
      <Text style={styles.subtitle}>Egresos por Categoría</Text>
      <PieChart
        data={egresosPorCategoria}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
      />

      {/* Gráfica de líneas: ingresos vs egresos mensuales */}
      <Text style={styles.subtitle}>Ingresos vs Egresos por Mes</Text>
      <LineChart
        data={dataMensual}
        width={screenWidth - 20}
        height={250}
        chartConfig={chartConfig}
        bezier // Aplica un estilo curvo a las líneas para suavizar la forma
      />
    </ScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
});
