import React, { useRef, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  { name: "Salario", amount: 2500, color: NEW_COLORS.primaryGreen, legendFontColor: NEW_COLORS.darkText, legendFontSize: 16 },
  { name: "Ventas", amount: 850, color: NEW_COLORS.secondaryGreen, legendFontColor: NEW_COLORS.darkText, legendFontSize: 16 },
  { name: "Ingresos Extra", amount: 300, color: "#90EE90", legendFontColor: NEW_COLORS.darkText, legendFontSize: 16 },
];

const egresosPorCategoria = [
  { name: "Alimentación", amount: 1200, color: NEW_COLORS.primaryRed, legendFontColor: NEW_COLORS.darkText, legendFontSize: 16 },
  { name: "Transporte", amount: 600, color: NEW_COLORS.secondaryRed, legendFontColor: NEW_COLORS.darkText, legendFontSize: 16 },
  { name: "Entretenimiento", amount: 400, color: "#F08080", legendFontColor: NEW_COLORS.darkText, legendFontSize: 16 },
];

const dataMensual = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      data: [2500, 2300, 2800, 2600, 3000, 2900],
      color: () => NEW_COLORS.primaryGreen,
      strokeWidth: 3,
    },
    {
      data: [1800, 1900, 2100, 2000, 2200, 2400],
      color: () => NEW_COLORS.primaryRed,
      strokeWidth: 3,
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
    const snapPoints = useMemo(() => ['1%', screenHeight * 0.85], []);
    
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
            index={0}
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

                <View style={sheetStyles.infoCard}>
                    <Text style={sheetStyles.infoTitle}>Análisis de Distribución</Text>
                    <Text style={sheetStyles.description}>
                        Esta gráfica muestra la distribución porcentual de tus fondos en las distintas categorías. El tamaño de cada sección representa su peso relativo en el total.
                    </Text>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}

const LineChartSheet = ({ sheetRef, title, data, customConfig = {} }) => {
    const snapPoints = useMemo(() => ['1%', screenHeight * 0.8], []);
    
    const currentChartConfig = {
        ...chartConfig,
        ...customConfig,
        fillShadowGradient: data.datasets && data.datasets.length === 1 ? data.datasets[0].color()() : "rgba(0,0,0,0)",
        fillShadowGradientOpacity: data.datasets && data.datasets.length === 1 ? 0.1 : 0,
    };

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose={true}
            backgroundStyle={sheetStyles.background}
            handleIndicatorStyle={sheetStyles.handleIndicator}
        >
            <BottomSheetScrollView contentContainerStyle={sheetStyles.content}>
                <Text style={sheetStyles.title}>{title}</Text>
                
                <View style={styles.chartWrapper}>
                    <LineChart
                        data={data}
                        width={screenWidth * 0.9 - 20}
                        height={300}
                        chartConfig={currentChartConfig}
                        bezier
                        style={sheetStyles.chartStyle}
                        segments={data.labels.length > 4 ? 4 : data.labels.length}
                    />
                </View>
                
                <View style={sheetStyles.infoCard}>
                    <Text style={sheetStyles.infoTitle}>Análisis de Tendencia</Text>
                    <Text style={sheetStyles.description}>
                        Esta gráfica detalla la tendencia de tus movimientos a través de los meses, ayudando a identificar estacionalidad y variaciones históricas.
                    </Text>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default function GraficaScreen() {
    const sheetIngresosRef = useRef(null);
    const sheetEgresosRef = useRef(null);
    const sheetTendenciaRef = useRef(null);

    const allRefs = useMemo(() => [
        sheetIngresosRef,
        sheetEgresosRef,
        sheetTendenciaRef,
    ], []);

    const openSheet = useCallback((refToOpen) => {
        allRefs.forEach(ref => {
            if (ref.current && ref.current !== refToOpen.current) {
                ref.current.close();
            }
        });

        refToOpen.current?.snapToIndex(1);
    }, [allRefs]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>Resumen Financiero</Text>

                    <TouchableOpacity
                        style={[styles.chartContainer, styles.button]}
                        onPress={() => openSheet(sheetIngresosRef)}
                    >
                        <Text style={styles.subtitle}>Ingresos por Categoría</Text>
                        <Text style={styles.buttonText}>VER GRÁFICA DETALLADA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chartContainer, styles.button]}
                        onPress={() => openSheet(sheetEgresosRef)}
                    >
                        <Text style={styles.subtitle}>Egresos por Categoría</Text>
                        <Text style={styles.buttonText}>VER GRÁFICA DETALLADA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chartContainer, styles.button]}
                        onPress={() => openSheet(sheetTendenciaRef)}
                    >
                        <Text style={styles.subtitle}>Tendencia Mensual de Ingresos y Egresos</Text>
                        <Text style={styles.buttonText}>VER GRÁFICA DETALLADA</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <PieChartSheet
                sheetRef={sheetIngresosRef}
                title="Ingresos por Categoría"
                data={ingresosPorCategoria}
            />

            <PieChartSheet
                sheetRef={sheetEgresosRef}
                title="Egresos por Categoría"
                data={egresosPorCategoria}
            />

            <LineChartSheet
                sheetRef={sheetTendenciaRef}
                title="Tendencia Mensual de Ingresos y Egresos"
                data={dataMensual}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NEW_COLORS.backgroundLight,
        padding: 10,
    },
    content: {
        alignItems: "center",
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginVertical: 20,
        color: NEW_COLORS.darkText,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "700",
        color: NEW_COLORS.darkText,
        textAlign: "center",
        marginBottom: 5,
    },
    chartContainer: {
        backgroundColor: NEW_COLORS.cardBackground,
        borderRadius: 16,
        padding: 18,
        width: "90%",
        alignItems: "center",
        marginVertical: 12,
        shadowColor: NEW_COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10,
    },
    chartWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 10,
        backgroundColor: NEW_COLORS.cardBackground,
    },
    centerChart: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        height: 120,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 8,
        color: NEW_COLORS.buttonPrimary,
        borderTopWidth: 1,
        borderTopColor: NEW_COLORS.borderLight,
        paddingTop: 10,
    }
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
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 20,
        color: NEW_COLORS.darkText,
        textAlign: 'center',
        paddingTop: 10,
    },
    chartAndInfoRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartColumn: {
        width: '50%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoColumn: {
        width: '50%',
        paddingLeft: 10,
        justifyContent: 'center',
    },
    manualLegendContainer: {
        padding: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: NEW_COLORS.darkText,
        fontWeight: '600',
    },
    infoCard: {
        width: '100%',
        backgroundColor: NEW_COLORS.backgroundLight,
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        borderLeftWidth: 5,
        borderLeftColor: NEW_COLORS.primaryGreen,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: NEW_COLORS.darkText,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: NEW_COLORS.lightText,
        lineHeight: 20,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '100%',
        height: 240, 
    },
    legendSection: {
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: NEW_COLORS.lightText,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: NEW_COLORS.borderLight,
        paddingBottom: 5,
    },
    manualLegendContainer: {
        flexDirection: 'column', 
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#f8f9fa', 
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    legendCategory: {
        fontSize: 16,
        color: NEW_COLORS.darkText,
        fontWeight: '600',
    },
    legendPercentage: {
        fontSize: 16,
        color: NEW_COLORS.lightText,
        fontWeight: '500',
    },
    infoCard: {
        width: '100%',
        backgroundColor: NEW_COLORS.backgroundLight,
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        borderLeftWidth: 5,
        borderLeftColor: NEW_COLORS.primaryGreen,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: NEW_COLORS.darkText,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: NEW_COLORS.lightText,
        lineHeight: 20,
    }
});