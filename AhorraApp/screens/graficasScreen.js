import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function GraficaScreen() {
  const ingresosPorCategoria = [
    { name: "Trabajo", amount: 2500, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Ventas", amount: 800, color: "#81C784", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Regalos", amount: 300, color: "#A5D6A7", legendFontColor: "#333", legendFontSize: 13 },
  ];

  const egresosPorCategoria = [
    { name: "Comida", amount: 1200, color: "#E53935", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Transporte", amount: 600, color: "#EF5350", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Ocio", amount: 400, color: "#FF8A80", legendFontColor: "#333", legendFontSize: 13 },
  ];

  const dataMensual = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [2500, 2300, 2800, 2600, 3000, 2900],
        color: () => "#4CAF50",
        strokeWidth: 2,
      },
      {
        data: [1800, 1900, 2100, 2000, 2200, 2400],
        color: () => "#E53935",
        strokeWidth: 2,
      },
    ],
    legend: ["Ingresos", "Egresos"],
  };

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#f8f9fa",
    backgroundGradientTo: "#f8f9fa",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gráficas Financieras</Text>

      <Text style={styles.subtitle}>Ingresos por Categoría</Text>
      <PieChart
        data={ingresosPorCategoria}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
      />

      <Text style={styles.subtitle}>Egresos por Categoría</Text>
      <PieChart
        data={egresosPorCategoria}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
      />

      <Text style={styles.subtitle}>Ingresos vs Egresos por Mes</Text>
      <LineChart
        data={dataMensual}
        width={screenWidth - 20}
        height={250}
        chartConfig={chartConfig}
        bezier
      />
    </ScrollView>
  );
}

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