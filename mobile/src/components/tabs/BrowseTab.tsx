import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSearchFoods } from "../../hooks/useSearchFoods";
import { BrowseResultCard } from "../cards/BrowseResultCard";
import { useCreateUnsafeFood } from "../../hooks/useCreateUnsafeFood";

export function BrowseTab({
  theme,
  isDark,
  onFoodAdded,
}: {
  theme: any;
  isDark: boolean;
  onFoodAdded: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addUnsafeFood, saving } = useCreateUnsafeFood();
  const {
    ingredients,
    brandedFoods,
    loading,
    hasMoreIngredients,
    hasMoreBranded,
    loadMoreIngredients,
    loadMoreBranded,
    ingredientsTotal,
    brandedTotal,
  } = useSearchFoods(searchQuery);

  const handleAddFood = async (
    item: any,
    type: "ingredient" | "branded",
    isSafe: boolean,
  ) => {
    try {
     await addUnsafeFood(item._id, isSafe);
        Alert.alert(
          "Added!",
          `${item.name} has been marked as ${isSafe ? "safe" : "unsafe"}.`,
          [{ text: "OK", onPress: onFoodAdded }],
        );
      
    } catch (err: any) {
      console.error("Error adding food:", err);
      Alert.alert("Error", "Failed to add food. Please try again.");
    } 
  };

  return (
    <>
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search ingredients or products..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.length < 2 ? (
          <View style={styles.browseEmpty}>
            <Ionicons
              name="search-outline"
              size={48}
              color={theme.textTertiary}
            />
            <Text
              style={[styles.browseEmptyTitle, { color: theme.textSecondary }]}
            >
              Search our database
            </Text>
            <Text
              style={[
                styles.browseEmptySubtitle,
                { color: theme.textTertiary },
              ]}
            >
              Find ingredients or branded products to mark as safe or unsafe
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.browseLoading}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>
              Searching...
            </Text>
          </View>
        ) : (
          <>
            {ingredients.length > 0 && (
              <View style={styles.browseSection}>
                <Text
                  style={[
                    styles.browseSectionTitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  INGREDIENTS ({ingredients.length}
                  {ingredientsTotal > ingredients.length
                    ? ` of ${ingredientsTotal}`
                    : ""}
                  )
                </Text>
                {ingredients.map((item: any) => (
                  <BrowseResultCard
                    key={`ing-${item._id}`}
                    item={item}
                    type="ingredient"
                    theme={theme}
                    isDark={isDark}
                    onAdd={handleAddFood}
                    disabled={saving}
                  />
                ))}
                {hasMoreIngredients && (
                  <TouchableOpacity
                    style={[
                      styles.loadMoreButton,
                      { backgroundColor: theme.card },
                    ]}
                    onPress={loadMoreIngredients}
                  >
                    <Text
                      style={[styles.loadMoreText, { color: theme.primary }]}
                    >
                      Show more ingredients
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {brandedFoods.length > 0 && (
              <View style={styles.browseSection}>
                <Text
                  style={[
                    styles.browseSectionTitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  BRANDED PRODUCTS ({brandedFoods.length}
                  {brandedTotal > brandedFoods.length
                    ? ` of ${brandedTotal}`
                    : ""}
                  )
                </Text>
                {brandedFoods.map((item: any) => (
                  <BrowseResultCard
                    key={`brand-${item._id}`}
                    item={item}
                    type="branded"
                    theme={theme}
                    isDark={isDark}
                    onAdd={handleAddFood}
                    disabled={saving}
                  />
                ))}
                {hasMoreBranded && (
                  <TouchableOpacity
                    style={[
                      styles.loadMoreButton,
                      { backgroundColor: theme.card },
                    ]}
                    onPress={loadMoreBranded}
                  >
                    <Text
                      style={[styles.loadMoreText, { color: theme.primary }]}
                    >
                      Show more products
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {ingredients.length === 0 && brandedFoods.length === 0 && (
              <View style={styles.browseEmpty}>
                <Text
                  style={[
                    styles.browseEmptyTitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  No results found
                </Text>
                <Text
                  style={[
                    styles.browseEmptySubtitle,
                    { color: theme.textTertiary },
                  ]}
                >
                  Try a different search term
                </Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  browseEmpty: { alignItems: "center", paddingVertical: 60, gap: 8 },
  browseEmptyTitle: { fontSize: 16, fontWeight: "600" },
  browseEmptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  browseLoading: { alignItems: "center", paddingVertical: 40 },
  browseSection: { marginBottom: 20 },
  browseSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  loadMoreButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  loadMoreText: { fontSize: 13, fontWeight: "600" },
  searchSection: { paddingHorizontal: 24, marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
});
