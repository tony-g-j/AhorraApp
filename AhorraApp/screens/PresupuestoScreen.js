import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { PresupuestoController } from "../controllers/presupuestoController";
import { CategoriaController } from "../controllers/categoriaController";

const presupuestoController = new PresupuestoController();
const categoriaController = new CategoriaController();

const COLORS = {
  primary: "#009688",
  success: "#76C75F",
  danger: "#FF6B6B",
  textDark: "#333333",
  background: "#bff0ea",
  cardBackground: "#F8F8F8",
  lightGrey: "#E0E0E0",
  primaryDark: "#0B3D3A",
  blue: "#3B82F6",
};

const CategoryFormSheet = ({
  bottomSheetRef,
  onSave,
  isEditing,
  categoryToEdit,
  snapPoints,
}) => {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [tipo, setTipo] = useState("Gasto");

  React.useEffect(() => {
    if (isEditing && categoryToEdit) {
      setName(categoryToEdit.nombreCategoria);
      setLimit(categoryToEdit.montoLimite.toString());
    } else {
      setName("");
      setLimit("");
      setTipo("Gasto");
    }
  }, [isEditing, categoryToEdit]);

  const handleSave = () => {
    const limitNum = parseFloat(limit);
    if (!name || isNaN(limitNum) || limitNum < 0) {
      Alert.alert("Error", "Por favor, ingresa un nombre y un monto válido.");
      return;
    }

    onSave({
      id: isEditing ? categoryToEdit.id : null,
      nombre: name,
      limit: limitNum,
      tipo: tipo,
    });

    setName("");
    setLimit("");
    setTipo("Gasto");
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      backgroundStyle={sheetStyles.bSheet}
    >
      <BottomSheetScrollView
        contentContainerStyle={sheetStyles.bView}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={sheetStyles.sheetTitulo}>
          {isEditing ? "Editar" : "Nueva Categoría"}
        </Text>

        {!isEditing && (
          <View style={sheetStyles.switchContainer}>
            <TouchableOpacity
              style={[
                sheetStyles.switchBtn,
                tipo === "Gasto" && sheetStyles.switchBtnActive,
              ]}
              onPress={() => setTipo("Gasto")}
            >
              <Text
                style={[
                  sheetStyles.switchText,
                  tipo === "Gasto" && sheetStyles.switchTextActive,
                ]}
              >
                Gasto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                sheetStyles.switchBtn,
                tipo === "Ingreso" && {
                  backgroundColor: "#10B981",
                  borderColor: "#10B981",
                },
              ]}
              onPress={() => setTipo("Ingreso")}
            >
              <Text
                style={[
                  sheetStyles.switchText,
                  tipo === "Ingreso" && sheetStyles.switchTextActive,
                ]}
              >
                Ingreso
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={sheetStyles.input}
          placeholder="Nombre Categoría (ej. Comida)"
          placeholderTextColor={"#9CA3AF"}
          value={name}
          onChangeText={setName}
          editable={!isEditing}
        />

        <TextInput
          style={sheetStyles.input}
          placeholder={
            tipo === "Ingreso" ? "Monto Estimado ($)" : "Límite Mensual ($)"
          }
          placeholderTextColor={"#9CA3AF"}
          value={limit}
          onChangeText={(text) => setLimit(text.replace(/[^0-9.]/g, ""))}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[
            sheetStyles.THBtn,
            !isEditing && tipo === "Ingreso" && { backgroundColor: "#10B981" },
          ]}
          onPress={handleSave}
        >
          <Text style={sheetStyles.BtnTxt}>
            {isEditing ? "Actualizar" : "Crear"}
          </Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default function PresupuestosScreen({ usuarioId }) {
  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [balanceReal, setBalanceReal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().getMonth() + 1
  );
  const [anioSeleccionado, setAnioSeleccionado] = useState(
    new Date().getFullYear()
  );

  const [isEditing, setIsEditing] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const bottomSheetRef = useRef(null);
  const bottomSheetCategoryRef = useRef(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const snapPointsForm = useMemo(() => ["65%"], []);

  const cargarDatos = useCallback(async () => {
    if (!usuarioId) return;
    setLoading(true);
    try {
      const data = await presupuestoController.obtenerPresupuestos(
        usuarioId,
        mesSeleccionado,
        anioSeleccionado
      );
      setPresupuestos(data);

      const totalPlaneado = data.reduce((acc, item) => {
        if (item.tipoCategoria === "Ingreso") {
          return acc + item.montoLimite;
        } else {
          return acc +  item.montoLimite;
        }
      }, 0);

      setPresupuestoTotal(totalPlaneado);

      const totalReal = data.reduce((acc, item) => {
        if (item.tipoCategoria === "Ingreso") {
          return acc + item.montoActual;
        } else {
          return acc - item.montoActual;
        }
      }, 0);

      setBalanceReal( totalReal );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [usuarioId, mesSeleccionado, anioSeleccionado]);

  const cargarDatos = useCallback(async () => {
    if (!usuarioId) return;
    setLoading(true);
    try {
      const data = await presupuestoController.obtenerPresupuestos(
        usuarioId,
        mesSeleccionado,
        anioSeleccionado
      );
      setPresupuestos(data);

      const totalPlaneado = data.reduce((acc, item) => {
        if (item.tipoCategoria === "Ingreso") {
          return acc + item.montoLimite;
        } else {
          return acc +  item.montoLimite;
        }
      }, 0);

      setPresupuestoTotal(totalPlaneado);

      const totalReal = data.reduce((acc, item) => {
        if (item.tipoCategoria === "Ingreso") {
          return acc + item.montoActual;
        } else {
          return acc - item.montoActual;
        }
      }, 0);

      setBalanceReal( totalReal );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [usuarioId, mesSeleccionado, anioSeleccionado]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const handleSaveCategory = async (data) => {
    try {
      const mes = mesSeleccionado;
      const anio = anioSeleccionado;
<<<<<<< Updated upstream

      if (isEditing) {
        await presupuestoController.actualizarPresupuesto(data.id, data.limit);
      } else {
        
        const nuevaCat = await categoriaController.crearCategoria(
          usuarioId,
          data.nombre,
          data.tipo
        );

        await presupuestoController.crearPresupuesto(
          usuarioId,
          nuevaCat.id,
          data.limit,
          mes,
          anio
        );
      }
      setIsEditing(false);
      setCategoryToEdit(null);
      cargarDatos();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      const hoy = new Date();
      const mes = hoy.getMonth() + 1;
      const anio = hoy.getFullYear();
=======
>>>>>>> Stashed changes

      if (isEditing) {
        await presupuestoController.actualizarPresupuesto(data.id, data.limit);
      } else {
        const nuevaCat = await categoriaController.crearCategoria(
          usuarioId,
          data.nombre,
          data.tipo
        );

        await presupuestoController.crearPresupuesto(
          usuarioId,
          nuevaCat.id,
          data.limit,
          mes,
          anio
        );
      }
      setIsEditing(false);
      setCategoryToEdit(null);
      cargarDatos();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeletePresupuesto = async (id) => {
    try {
      await presupuestoController.eliminarPresupuesto(id);
      await categoriaController.eliminarCategoria(id);
      cargarDatos();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar");
    }
  };

  const handleOpenAddSheet = useCallback(() => {
    setIsEditing(false);
    setCategoryToEdit(null);
    bottomSheetRef.current?.close();
    bottomSheetCategoryRef.current?.expand();
  }, []);

  const handleOpenEditSheet = useCallback((category) => {
    setIsEditing(true);
    setCategoryToEdit(category);
    bottomSheetRef.current?.close();
    bottomSheetCategoryRef.current?.expand();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      edges={["top", "left", "right"]}
    >
        <View style={styles.container}>
          <Text style={styles.header}>💰 Mi Presupuesto Mensual</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => setMesSeleccionado((m) => (m === 1 ? 12 : m - 1))}
            >
              <MaterialIcons
                name="chevron-left"
                size={30}
                color={COLORS.textDark}
              />
            </TouchableOpacity>

            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginHorizontal: 20 }}
            >
              {mesSeleccionado}/{anioSeleccionado}
            </Text>

            <TouchableOpacity
              onPress={() => setMesSeleccionado((m) => (m === 12 ? 1 : m + 1))}
            >
              <MaterialIcons
                name="chevron-right"
                size={30}
                color={COLORS.textDark}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.budgetCard}>
                <Text style={styles.cardTitle}>Presupuesto Total:</Text>
                <Text style={styles.budgetInput}>
                  ${presupuestoTotal.toFixed(2)}
                </Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Balance Real:</Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color:
                          balanceReal >= 0 ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    ${balanceReal.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.infoText}>
                  Incluye tus ingresos estimados y límites de gastos.
                </Text>
              </View>

              <Text style={styles.sectionHeader}>Detalle por Categoría</Text>

              {presupuestos.length === 0 && (
                <Text style={styles.emptyText}>
                  No hay categorías configuradas.
                </Text>
              )}

              {presupuestos.map((item) => {
                const percentSpent = item.getPorcentajeGastado();
                const isOverBudget = item.estaExcedido();
                const isIngreso = false;

                return (
                  <View key={item.id} style={styles.categoryItem}>
                    <View style={styles.categoryTitleRow}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryName}>
                          {item.nombreCategoria}
                        </Text>
                      </View>

                      <Menu>
                        <MenuTrigger
                          customStyles={{
                            triggerWrapper: styles.optionsButton,
                          }}
                        >
                          <MaterialIcons
                            name="more-vert"
                            size={24}
                            color={COLORS.textDark}
                          />
                        </MenuTrigger>
                        <MenuOptions
                          customStyles={{
                            optionsContainer: styles.menuOptionsContainer,
                          }}
                        >
                          <MenuOption
                            onSelect={() => handleOpenEditSheet(item)}
                            customStyles={{
                              optionWrapper: styles.menuOptionWrapper,
                            }}
                          >
                            <Text style={styles.menuOptionText}>
                              Editar Monto
                            </Text>
                          </MenuOption>
                          <MenuOption
                            onSelect={() => handleDeletePresupuesto(item.id)}
                            customStyles={{
                              optionWrapper: styles.menuOptionWrapper,
                            }}
                          >
                            <Text
                              style={[
                                styles.menuOptionText,
                                styles.deleteOptionText,
                              ]}
                            >
                              Eliminar
                            </Text>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </View>

                    <View style={styles.limitDetails}>
                      <Text style={styles.limitText}>
                        Planificado: ${item.montoLimite.toFixed(2)}
                      </Text>
                      <Text
                        style={[
                          styles.spentText,
                          {
                            color: isOverBudget
                              ? COLORS.danger
                              : COLORS.textDark,
                          },
                        ]}
                      >
                        Real: ${item.montoActual.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${percentSpent}%`,
                            backgroundColor: isOverBudget
                              ? COLORS.danger
                              : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.fab}
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Text style={styles.fabTexto}>+</Text>
          </TouchableOpacity>

          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={-1}
            enablePanDownToClose={true}
            backgroundStyle={sheetStyles.bSheet}
          >
            <BottomSheetScrollView contentContainerStyle={sheetStyles.bView}>
              <Text style={sheetStyles.titulo}>Opciones</Text>
              <TouchableHighlight
                style={sheetStyles.THBtn}
                underlayColor={"#ECFDF5"}
                onPress={handleOpenAddSheet}
              >
                <Text style={sheetStyles.BtnTxt}>
                  Agregar Categoría / Presupuesto
                </Text>
              </TouchableHighlight>
            </BottomSheetScrollView>
          </BottomSheet>

          <CategoryFormSheet
            bottomSheetRef={bottomSheetCategoryRef}
            onSave={handleSaveCategory}
            isEditing={isEditing}
            categoryToEdit={categoryToEdit}
            snapPoints={snapPointsForm}
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 15, paddingBottom: 100 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
    padding: 15,
    paddingBottom: 5,
  },
  budgetCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, color: COLORS.textDark, marginBottom: 5 },
  budgetInput: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryLabel: { fontSize: 16, color: COLORS.textDark },
  summaryValue: { fontSize: 18, fontWeight: "bold" },
  infoText: {
    fontSize: 12,
    color: COLORS.textDark,
    opacity: 0.6,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  categoryTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryHeader: { flexDirection: "row", alignItems: "center" },
  categoryName: { fontSize: 16, fontWeight: "600", color: COLORS.textDark },
  optionsButton: { padding: 5 },
  limitDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  limitText: { fontSize: 14, color: COLORS.textDark },
  spentText: { fontSize: 14, fontWeight: "bold" },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#EEEEEE",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 5 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  fabTexto: { color: "#FFFFFF", fontSize: 30, lineHeight: 32 },
  menuOptionsContainer: { borderRadius: 10, padding: 0, width: 150 },
  menuOptionWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  menuOptionText: { fontSize: 16, color: COLORS.textDark, textAlign: "center" },
  deleteOptionText: { color: COLORS.danger, borderBottomWidth: 0 },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 10,
  },
});

const sheetStyles = StyleSheet.create({
  bSheet: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 20,
  },
  bView: { padding: 20, alignItems: "center" },
  sheetTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#374151",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginTop: 5,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#374151",
  },
  THBtn: {
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.blue,
    paddingVertical: 12,
    margin: 10,
    borderRadius: 10,
  },
  BtnTxt: { fontSize: 18, padding: 10, color: "#fff", fontWeight: "600" },

  // Switch Styles
  switchContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  switchBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  switchBtnActive: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  switchText: { color: "#666", fontWeight: "bold" },
  switchTextActive: { color: "#fff" },
});
