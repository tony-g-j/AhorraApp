// Importación de librerías necesarias
import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function graficaScreen() {
  const ingresosPorCategoria = [
    { name: "Salario", amount: 2500, color: "#4CAF50", legendFontColor: "#222", legendFontSize: 16 , legendFontFamily: 'System'},
    { name: "Ventas", amount: 800, color: "#81C784", legendFontColor: "#222", legendFontSize: 16, legendFontFamily: 'System' },
    { name: "Ingresos Extra", amount: 300, color: "#A5D6A7", legendFontColor: "#222", legendFontSize: 16, legendFontFamily: 'System' },
  ];

  const egresosPorCategoria = [
    { name: "Alimentación", amount: 1200, color: "#E53935", legendFontColor: "#222", legendFontSize: 16, legendFontFamily: 'System' },
    { name: "Transporte", amount: 600, color: "#EF5350", legendFontColor: "#222", legendFontSize: 16, legendFontFamily: 'System' },
    { name: "Entretenimiento", amount: 400, color: "#FF8A80", legendFontColor: "#222", legendFontSize: 16, legendFontFamily: 'System' },
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
    backgroundColor: "#f3fefdff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => 'rgba(0, 0, 0, ' + opacity + ')',
    decimalPlaces: 0,
    propsForLabels:{
      fontFamily:'System',
      fontWeight:'bold'
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Resumen Financiero</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Ingresos por Categoría</Text>
          <View style={styles.centerChart}>
            <PieChart
              data={ingresosPorCategoria}
              width={screenWidth * 0.85}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Egresos por Categoría</Text>
          <View style={styles.centerChart}>
            <PieChart
              data={egresosPorCategoria}
              width={screenWidth * 0.85}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Tendencia Mensual de Ingresos y Egresos</Text>
          <View style={styles.centerChart}>
            <LineChart
              data={dataMensual}
              width={screenWidth * 0.75}
              height={260}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 12,
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bff0ea",
    padding: 10,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    width: "85%",  
    alignItems: "center", 
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  centerChart: {
    alignItems: "center",
    justifyContent: "center",
  },
});