import React, { useRef, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { TransaccionController } from "../controllers/transaccionController";
const transaccionController = new TransaccionController();

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

const CHART_COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF",
  "#FFCD56",
  "#4D5360",
];

const chartConfig = {
  backgroundColor: NEW_COLORS.cardBackground,
  backgroundGradientFrom: NEW_COLORS.cardBackground,
  backgroundGradientTo: NEW_COLORS.cardBackground,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`,
  decimalPlaces: 0,
  propsForLabels:{
    fontFamily:'System',
    fontWeight:'bold',
    fontSize: 12,
  },
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
    const snapPoints = useMemo(() => ['1%', screenHeight * 0.8], []);
    
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const renderManualLegend = () => (
    <View style={sheetStyles.manualLegendContainer}>
      {data.map((item, index) => {
        const percentage =
          totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;
        return (
          <View key={index} style={sheetStyles.legendItem}>
            <View
              style={[sheetStyles.legendDot, { backgroundColor: item.color }]}
            />
            <View style={sheetStyles.legendTextContainer}>
              <Text style={sheetStyles.legendCategory}>{item.name}</Text>
              <Text style={sheetStyles.legendPercentage}>
                {percentage}% (${item.amount.toFixed(2)})
              </Text>
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

        {data.length > 0 ? (
          <>
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
              <Text style={sheetStyles.sectionHeader}>
                Detalle por Categoría:
              </Text>
              {renderManualLegend()}
            </View>
          </>
        ) : (
          <Text style={{ marginVertical: 20, color: "#999" }}>
            No hay datos registrados para esta gráfica.
          </Text>
        )}

        <View style={sheetStyles.infoCard}>
          <Text style={sheetStyles.infoTitle}>Análisis de Distribución</Text>
          <Text style={sheetStyles.description}>
            Esta gráfica muestra la distribución de tus fondos en las distintas
            categorías.
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const LineChartSheet = ({ sheetRef, title, data, customConfig = {} }) => {
  const snapPoints = useMemo(() => ["1%", screenHeight * 0.8], []);

  const hasData =
    data?.datasets?.length > 0 &&
    (data.datasets[0]?.data?.some((v) => v > 0) ||
     data.datasets[1]?.data?.some((v) => v > 0));

  const currentChartConfig = {
    ...chartConfig,
    ...customConfig,
    fillShadowGradient: "rgba(0,0,0,0)",
    fillShadowGradientOpacity: 0,
  };

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

        {hasData ? (
          <View style={styles.chartWrapper}>
            <LineChart
              data={data}
              width={screenWidth * 0.9 - 20}
              height={300}
              chartConfig={currentChartConfig}
              bezier
              style={sheetStyles.chartStyle}
            />
          </View>
        ) : (
            <Text style={{ marginVertical: 20, color: "#999" }}>
            No hay suficientes datos históricos.
          </Text>
        )}

        <View style={sheetStyles.infoCard}>
          <Text style={sheetStyles.infoTitle}>Análisis de Tendencia</Text>
          <Text style={sheetStyles.description}>
            Comparativa de tus Ingresos (Verde) vs Egresos (Rojo) en los últimos
            6 meses.
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default function GraficaScreen({ usuarioId }) {
  const [loading, setLoading] = useState(true);
  const [ingresosData, setIngresosData] = useState([]);
  const [egresosData, setEgresosData] = useState([]);
  const [tendenciaData, setTendenciaData] = useState({
    labels: [],
    datasets: [],
    legend: ["Ingresos", "Egresos"],
  });

  const sheetIngresosRef = useRef(null);
  const sheetEgresosRef = useRef(null);
  const sheetTendenciaRef = useRef(null);

    const allRefs = useMemo(() => [
        sheetIngresosRef,
        sheetEgresosRef,
        sheetTendenciaRef,
    ], []);

  const openSheet = useCallback(
    (refToOpen) => {
      allRefs.forEach((ref) => {
        if (ref.current && ref.current !== refToOpen.current) {
          ref.current.close();
        }
      });
      refToOpen.current?.snapToIndex(1);
    },
    [allRefs]
  );

  const procesarDatos = async () => {
    if (!usuarioId) return;
    setLoading(true);
    try {
      const transacciones = await transaccionController.obtenerTransacciones(
        usuarioId
      );

      const mapIngresos = {};
      const mapGastos = {};

      const hoy = new Date();
      const ultimos6Meses = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        ultimos6Meses.push({
          mesIndex: d.getMonth(),
          anio: d.getFullYear(),
          label: d.toLocaleString("es-ES", { month: "short" }),
          ingresos: 0,
          gastos: 0,
        });
      }

      transacciones.forEach((t) => {
        const monto = parseFloat(t.monto);
        const fechaT = new Date(t.fecha);

        const nombreCat = t.nombreCategoria || "Otros";
        if (t.tipoCategoria === "Ingreso") {
          mapIngresos[nombreCat] = (mapIngresos[nombreCat] || 0) + monto;
        } else {
          mapGastos[nombreCat] = (mapGastos[nombreCat] || 0) + monto;
        }

        const mesBin = ultimos6Meses.find(
          (m) =>
            m.mesIndex === fechaT.getMonth() && m.anio === fechaT.getFullYear()
        );
        if (mesBin) {
          if (t.tipoCategoria === "Ingreso") mesBin.ingresos += monto;
          else mesBin.gastos += monto;
        }
      });

      const formatPieData = (map) =>
        Object.keys(map).map((key, index) => ({
          name: key,
          amount: map[key],
          color: CHART_COLORS[index % CHART_COLORS.length],
          legendFontColor: NEW_COLORS.darkText,
          legendFontSize: 15,
        }));

      setIngresosData(formatPieData(mapIngresos));
      setEgresosData(formatPieData(mapGastos));

      setTendenciaData({
        labels: ultimos6Meses.map((m) => m.label),
        datasets: [
          {
            data: ultimos6Meses.map((m) => m.ingresos),
            color: (opacity = 1) => NEW_COLORS.primaryGreen,
            strokeWidth: 3,
          },
          {
            data: ultimos6Meses.map((m) => m.gastos),
            color: (opacity = 1) => NEW_COLORS.primaryRed,
            strokeWidth: 3,
          },
        ],
        legend: ["Ingresos", "Egresos"],
      });
    } catch (error) {
      console.error("Error procesando gráficas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      procesarDatos();
    }, [usuarioId])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#bff0ea" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Estadísticas</Text>

          {loading ? (
            <ActivityIndicator size="large" color={NEW_COLORS.darkText} />
          ) : (
            <View style={styles.graphButtonsContainer}>
              <TouchableOpacity
                style={[styles.graphButton, styles.greenButton]}
                onPress={() => openSheet(sheetIngresosRef)}
              >
                <MaterialIcons name="pie-chart" size={26} color="#1A7F4B" />
                <Text style={[styles.graphButtonText, { color: "#1A7F4B" }]}>
                  Ver Ingresos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.graphButton, styles.redButton]}
                onPress={() => openSheet(sheetEgresosRef)}
              >
                <MaterialIcons
                  name="stacked-bar-chart"
                  size={26}
                  color="#C0392B"
                />
                <Text style={[styles.graphButtonText, { color: "#C0392B" }]}>
                  Ver Egresos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.graphButton, styles.purpleButton]}
                onPress={() => openSheet(sheetTendenciaRef)}
              >
                <MaterialIcons name="show-chart" size={26} color="#6C3BCE" />
                <Text style={[styles.graphButtonText, { color: "#6C3BCE" }]}>
                  Ver Tendencia
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <PieChartSheet
          sheetRef={sheetIngresosRef}
          title="Ingresos por Categoría"
          data={ingresosData}
        />

        <PieChartSheet
          sheetRef={sheetEgresosRef}
          title="Egresos por Categoría"
          data={egresosData}
        />

        <LineChartSheet
          sheetRef={sheetTendenciaRef}
          title="Tendencia Mensual"
          data={tendenciaData}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEW_COLORS.backgroundLight,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 20,
    color: NEW_COLORS.darkText,
  },
  chartWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    backgroundColor: NEW_COLORS.cardBackground,
    padding: 10,
    alignItems: "center"
  },
  greenButton: {
    borderLeftWidth: 6,
    borderLeftColor: "#1A7F4B",
  },
  redButton: {
    borderLeftWidth: 6,
    borderLeftColor: "#C0392B",
  },
  purpleButton: {
    borderLeftWidth: 6,
    borderLeftColor: "#6C3BCE",
  },
  graphButtonsContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 20,
    marginTop: 15,
    marginBottom: 25,
  },
  graphButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  graphButtonText: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
});

const sheetStyles = StyleSheet.create({
  background: {
    backgroundColor: NEW_COLORS.cardBackground,
    shadowColor: NEW_COLORS.shadow,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 20,
  },
  handleIndicator: {
    backgroundColor: NEW_COLORS.lightText,
    width: 40,
    height: 5,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
    color: NEW_COLORS.darkText,
    textAlign: "center",
    paddingTop: 10,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
    height: 240,
  },
  legendSection: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: NEW_COLORS.lightText,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: NEW_COLORS.borderLight,
    paddingBottom: 5,
  },
  manualLegendContainer: {
    flexDirection: "column",
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  legendCategory: {
    fontSize: 16,
    color: NEW_COLORS.darkText,
    fontWeight: "600",
  },
  legendPercentage: {
    fontSize: 16,
    color: NEW_COLORS.lightText,
    fontWeight: "500",
  },
  infoCard: {
    width: "100%",
    backgroundColor: NEW_COLORS.backgroundLight,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: NEW_COLORS.primaryGreen,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: NEW_COLORS.darkText,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: NEW_COLORS.lightText,
    lineHeight: 20,
  },
});