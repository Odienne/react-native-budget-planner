import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import Colors from "../../utils/Colors";
import { router } from "expo-router";

function CategoryList(props) {
  const handleCategoryPress = (categoryId) => {
    router.push({
      pathname: "/category-detail",
      params: {
        categoryId,
      },
    });
  };

  const calculateTotalCost = (category) => {
    let totalCost = 0;

    category.items.forEach((i) => {
      totalCost += parseFloat(i.cost);
    });

    return totalCost;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>

      <View style={styles.categories}>
        {props?.categories &&
          props?.categories?.map((category) => (
            <TouchableOpacity
              onPress={() => handleCategoryPress(category.id)}
              style={{ ...styles.category }}
              key={category.id}
            >
              <Text
                style={{
                  ...styles.categoryIcon,
                  backgroundColor: category.color,
                }}
              >
                {category.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text>{category?.items?.length} items</Text>
              </View>
              <Text style={styles.amount}>
                {calculateTotalCost(category)}/{category.assignedBudget}€
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

export default CategoryList;

const styles = StyleSheet.create({
  categories: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: "Rubik-Bold",
  },
  amount: {
    fontSize: 14,
    fontFamily: "Rubik-Bold",
  },
  categoryIcon: {
    padding: 16,
    borderRadius: 8,
    fontSize: 24,
  },
  category: {
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
    backgroundColor: Colors.white,
    padding: 12,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 24,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 48,
  },
  welcome: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "Rubik-Regular",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Rubik-Bold",
    marginBottom: 16,
  },
});
