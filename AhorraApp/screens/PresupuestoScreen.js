import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: '#009688', 
  success: '#76C75F', 
  danger: '#FF6B6B', 
  textDark: '#333333',
  background: '#FFFFFF',
  cardBackground: '#F8F8F8', 
};

const initialBudget = 10000.00; 
const categories = [
  { id: 1, name: 'Comida/Supermercado', limit: 3000, spent: 1500, icon: 'basket' },
  { id: 2, name: 'Transporte', limit: 1500, spent: 1550, icon: 'car' },
  { id: 3, name: 'Entretenimiento', limit: 1000, spent: 500, icon: 'game-controller' },
];

export default function PresupuestosScreen() {
  const [presupuestoMensual, setPresupuestoMensual] = useState(initialBudget.toString());

  const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
  const remainingBudget = initialBudget - totalSpent;

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Mi Presupuesto Mensual</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.budgetCard}>
          <Text style={styles.cardTitle}>Presupuesto Total Definido:</Text>
          <TextInput
            style={styles.budgetInput}
            onChangeText={setPresupuestoMensual}
            value={`$${presupuestoMensual}`}
            keyboardType="numeric"
          />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Disponible restante:</Text>
            <Text 
                style={[
                    styles.summaryValue, 
                    { color: remainingBudget >= 0 ? COLORS.success : COLORS.danger }
                ]}
            >
                {remainingBudget.toFixed(2)}
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
            <View key={item.id} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.iconPlaceholder}>ICON</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
              
              <View style={styles.limitDetails}>
                <Text style={styles.limitText}>Límite: ${item.limit.toFixed(2)}</Text>
                <Text style={[styles.spentText, { color: isOverBudget ? COLORS.danger : COLORS.textDark }]}>
                  Gastado: ${item.spent.toFixed(2)}
                </Text>
              </View>

              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${Math.min(percentSpent, 100)}%`, 
                      backgroundColor: isOverBudget ? COLORS.danger : COLORS.primary,
                    }
                  ]} 
                />
              </View>

            </View>
          );
        })}

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Añadir Nueva Categoría</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 5,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textDark,
    opacity: 0.6,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconPlaceholder: {
    marginRight: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  limitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  limitText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  spentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});