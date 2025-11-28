// Importación de librerías necesarias
import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const NEW_COLORS = {
  primaryGreen: "#28a745",
  secondaryGreen: "#218838",
  primaryRed: "#dc3545",
  secondaryRed: "#c82333",
  darkText: "#2c3e50",
  lightText: "#6c757d",
  backgroundLight: "#bff0ea",
  cardBackground: "#ffffff",
  shadow: "rgba(0, 0, 0, 0.2)",
  buttonPrimary: "#007bff",
  buttonText: "#ffffff",
  borderLight: "#e0e0e0",
};

const ingresosPorCategoria = [
  { name: "Salario", amount: 2500, color: NEW_COLORS.primaryGreen },
  { name: "Ventas", amount: 850, color: NEW_COLORS.secondaryGreen},
  { name: "Ingresos Extra", amount: 300, color: "#90EE90"},
];

const egresosPorCategoria = [
  { name: "Alimentación", amount: 1200, color: NEW_COLORS.primaryRed},
  { name: "Transporte", amount: 600, color: NEW_COLORS.secondaryRed},
  { name: "Entretenimiento", amount: 400, color: "#F08080" },
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
  backgroundColor: NEW_COLORS.cardBackground,
  backgroundGradientFrom: NEW_COLORS.cardBackground,
  backgroundGradientTo: NEW_COLORS.cardBackground,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`,
  decimalPlaces: 0,
  strokeWidth: 3,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: NEW_COLORS.darkText,
  },
};

const PieChartSheet = ({ sheetRef, title, data }) => {
    const snapPoints = useMemo(() => ['1%', screenHeight * 0.90], []);
    
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

    const renderManualLegend = () => (
        <View style={sheetStyles.manualLegendContainer}>
            {data.map((item, index) => {
                const percentage = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;
                return (
                    <View key={index} style={sheetStyles.legendItem}>
                        <View style={[sheetStyles.legendDot, { backgroundColor: item.color }]} />
                        <View style={sheetStyles.legendTextContainer}>
                            <Text style={sheetStyles.legendCategory}>{item.name}</Text>
                            <Text style={sheetStyles.legendPercentage}>{percentage}% ({item.amount})</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            index={-1}
            enablePanDownToClose={true}
            backgroundStyle={sheetStyles.background}
            handleIndicatorStyle={sheetStyles.handleIndicator}
        >
            <BottomSheetScrollView contentContainerStyle={sheetStyles.content}>
                <Text style={sheetStyles.title}>{title}</Text>
                
                <View style={sheetStyles.chartContainer}>
                    <PieChart
                        data={data}
                        width={screenWidth} 
                        height={240}
                        chartConfig={chartConfig}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft={screenWidth / 4}
                        hasLegend={false} 
                        center={[0, 0]}
                        absolute={false}
                    />
                </View>

                <View style={sheetStyles.legendSection}>
                    <Text style={sheetStyles.sectionHeader}>Detalle por Categoría:</Text>
                    {renderManualLegend()}
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