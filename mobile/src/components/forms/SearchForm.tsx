import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Animated,
  Modal,
} from "react-native";

import { FlatList } from "react-native";

export function SearchForm({theme, text, setInput, input, setShowDropdown, addInput, showDropdown, results}: any){
    return(
      <>
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={[
                        styles.searchInput,
                        {
                          backgroundColor: theme.card,
                          color: theme.textPrimary,
                          borderColor: theme.border,
                        },
                      ]}
                      placeholder={`Search for ${text}`}
                      placeholderTextColor={theme.textTertiary}
                      value={input}
                      onChangeText={(text) => {
                        setInput(text);
                        setShowDropdown(true);
                      }}
                      returnKeyType="done"
                    />
                  </View>
                  {showDropdown && input.length > 0 &&(
                    <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                      {results.length > 0  ? (
                        <FlatList
                          keyboardShouldPersistTaps="handled"
                          scrollEnabled={false}
                          nestedScrollEnabled={true}
                          data={results}
                          keyExtractor={(item) => item._id}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.dropdownItem}
                              onPress={() => {
                                setShowDropdown(false);
                                addInput(item.name, item._id);
                              }}
                            >
                              <Text style={{ color: theme.textPrimary }}>
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      ) : (
                        <View style={styles.dropdownItem}>
                          <Text style={{ color: theme.textSecondary }}>
                            No {text} found
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
      </>       
    )
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 16,
  },

  miniLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  dropdown: {
    width: "100%",
    maxHeight: 200,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
  },
  searchInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
});
