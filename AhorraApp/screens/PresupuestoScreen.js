import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
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
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';


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

const initialBudget = 10000.0;
const initialCategories = [
  {
    id: 1,
    name: "Comida/Supermercado",
    limit: 3000,
    spent: 1500,
    icon: "basket",
  },
  { id: 2, name: "Transporte", limit: 1500, spent: 1550, icon: "car" },
  {
    id: 3,
    name: "Entretenimiento",
    limit: 1000,
    spent: 500,
    icon: "game-controller",
  },
];

const CategoryFormSheet = ({
  bottomSheetRef,
  onSave,
  isEditing,
  categoryToEdit,
  snapPoints,
}) => {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    if (isEditing && categoryToEdit) {
      setName(categoryToEdit.name);
      setLimit(categoryToEdit.limit.toString());
    } else {
      setName("");
      setLimit("");
    }
  }, [isEditing, categoryToEdit]);

  const handleSave = () => {
    const limitNum = parseFloat(limit);
    if (!name || isNaN(limitNum) || limitNum < 0) {
      Alert.alert("Error", "Por favor, ingresa un nombre y un límite válido.");
      return;
    }

    onSave({
      id: isEditing ? categoryToEdit.id : Date.now(),
      name,
      limit: limitNum,
      spent: isEditing ? categoryToEdit.spent : 0,
    });

    setName("");
    setLimit("");
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      backgroundStyle={sheetStyles.bSheet}
    >
      <BottomSheetScrollView contentContainerStyle={sheetStyles.bView}>
        <Text style={sheetStyles.sheetTitulo}>
          {isEditing ? "Editar Categoría" : "Añadir Nueva Categoría"}
        </Text>

        <TextInput
          style={sheetStyles.input}
          placeholder="Nombre de la Categoría (ej. Comida)"
          placeholderTextColor={"#9CA3AF"}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={sheetStyles.input}
          placeholder="Límite Presupuestario ($)"
          placeholderTextColor={"#9CA3AF"}
          value={limit}
          onChangeText={(text) => setLimit(text.replace(/[^0-9.]/g, ""))}
          keyboardType="numeric"
        />

        <TouchableOpacity style={sheetStyles.THBtn} onPress={handleSave}>
          <Text style={sheetStyles.BtnTxt}>
            {isEditing ? "Guardar Cambios" : "Crear Categoría"}
          </Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default function PresupuestosScreen() {
  const [presupuestoMensual, setPresupuestoMensual] = useState(
    initialBudget.toString()
  );
  const [categories, setCategories] = useState(initialCategories);

  const [isEditing, setIsEditing] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const bottomSheetRef = useRef(null);
  const bottomSheetCategoryRef = useRef(null);

  const snapPoints = useMemo(() => [0.1, "50%"], []);
  const snapPointsForm = useMemo(() => [0.1, "60%"], []);

  const currentBudget = parseFloat(presupuestoMensual.replace("$", "")) || 0;
  const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
  const remainingBudget = currentBudget - totalSpent;

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

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

  const handleDeleteCategory = useCallback((id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            Alert.alert("Éxito", "Categoría eliminada.");
          },
        },
      ]
    );
  }, []);

  const handleSaveCategory = useCallback(
    (newCategoryData) => {
      if (isEditing) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === newCategoryData.id
              ? {
                  ...cat,
                  name: newCategoryData.name,
                  limit: newCategoryData.limit,
                }
              : cat
          )
        );
      } else {
        const newCat = {
          ...newCategoryData,
          spent: 0,
          icon: "default",
        };
        setCategories((prev) => [...prev, newCat]);
      }
      setIsEditing(false);
      setCategoryToEdit(null);
    },
    [isEditing]
  );

  return (
    <MenuProvider> 
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.header}>💰 Mi Presupuesto Mensual</Text>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.budgetCard}>
              <Text style={styles.cardTitle}>Presupuesto Total Definido:</Text>
              <TextInput
                style={styles.budgetInput}
                onChangeText={(text) =>
                  setPresupuestoMensual(text.replace(/[^0-9.]/g, ""))
                }
                value={presupuestoMensual ? `$${presupuestoMensual}` : ""}
                keyboardType="numeric"
              />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Disponible restante:</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        remainingBudget >= 0 ? COLORS.success : COLORS.danger,
                    },
                  ]}
                >
                  ${remainingBudget.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.infoText}>
                Este es tu límite para gastos variables del mes.
              </Text>
            </View>

            <Text style={styles.sectionHeader}>Límites por Categoría</Text>
            {categories.map((item) => {
              const percentSpent = (item.spent / item.limit) * 100;
              const isOverBudget = item.spent > item.limit;

              return (
                <View 
                  key={item.id} 
                  style={styles.categoryItem}
                >
                  <View style={styles.categoryTitleRow}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.iconPlaceholder}>ICON</Text>
                      <Text style={styles.categoryName}>{item.name}</Text>
                    </View>
                    
                    <Menu>
                      <MenuTrigger customStyles={{ triggerWrapper: styles.optionsButton }}>
                        <MaterialIcons name="more-vert" size={24} color={COLORS.textDark} />
                      </MenuTrigger>
                      <MenuOptions customStyles={{ optionsContainer: styles.menuOptionsContainer }}>
                        
                        <MenuOption 
                            onSelect={() => handleOpenEditSheet(item)} 
                            customStyles={{ optionWrapper: styles.menuOptionWrapper }}
                        >
                            <Text style={styles.menuOptionText}>Modificar</Text>
                        </MenuOption>
                        
                        <MenuOption 
                            onSelect={() => handleDeleteCategory(item.id)}
                            customStyles={{ optionWrapper: styles.menuOptionWrapper }}
                        >
                            <Text style={[styles.menuOptionText, styles.deleteOptionText]}>Eliminar</Text>
                        </MenuOption>
                        
                      </MenuOptions>
                    </Menu>

                  </View>

                  <View style={styles.limitDetails}>
                    <Text style={styles.limitText}>
                      Límite: ${item.limit.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.spentText,
                        { color: isOverBudget ? COLORS.danger : COLORS.textDark },
                      ]}
                    >
                      Gastado: ${item.spent.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(percentSpent, 100)}%`,
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

          <TouchableOpacity style={styles.fab} onPress={handleOpenSheet}>
            <Text style={styles.fabTexto}>+</Text>
          </TouchableOpacity>

          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose={true}
            backgroundStyle={sheetStyles.bSheet}
          >
            <BottomSheetScrollView contentContainerStyle={sheetStyles.bView}>
              <Text style={sheetStyles.titulo}>Opciones de Presupuesto</Text>

              <TouchableHighlight
                style={sheetStyles.THBtn}
                underlayColor={"#ECFDF5"}
                onPress={handleOpenAddSheet}
              >
                <Text style={sheetStyles.BtnTxt}>Añadir Nueva Categoría</Text>
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
      </GestureHandlerRootView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
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
  cardTitle: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 5,
  },
  budgetInput: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 5,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
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
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    marginRight: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  optionsButton: {
    padding: 5,
  },
  limitDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  limitText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  spentText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#EEEEEE",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabTexto: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 32,
  },
  menuOptionsContainer: {
    borderRadius: 10,
    padding: 0,
    width: 150,
  },
  menuOptionWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  menuOptionText: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  deleteOptionText: {
    color: COLORS.danger,
    borderBottomWidth: 0,
  }
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
  bView: {
    padding: 20,
    alignItems: "center",
  },
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
  BtnTxt: {
    fontSize: 18,
    padding: 10,
    color: "#fff",
    fontWeight: "600",
  },
});