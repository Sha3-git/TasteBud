import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function TimingInfoModal({ showTimingInfo, setShowTimingInfo, theme, isDark }: any) {
  return (
    <Modal
      visible={showTimingInfo}
      transparent
      animationType="fade"
      onRequestClose={() => setShowTimingInfo(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowTimingInfo(false)}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? "#1c1c1e" : "#fff" },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Why timing matters
            </Text>
            <TouchableOpacity onPress={() => setShowTimingInfo(false)}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalText, { color: theme.textSecondary }]}>
            Different reactions happen at different speeds. This helps us
            understand what type of sensitivity you might have.
          </Text>

          <View style={styles.timeline}>
            <View style={styles.timelineTrack}>
              <LinearGradient
                colors={["#EF4444", "#F97316", "#FBBF24", "#34D399"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timelineGradient}
              />
            </View>

            <View style={styles.timelineLabels}>
              <View style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, { backgroundColor: "#EF4444" }]}
                />
                <Text
                  style={[styles.timelineTime, { color: theme.textPrimary }]}
                >
                  0-2h
                </Text>
                <Text
                  style={[styles.timelineType, { color: theme.textSecondary }]}
                >
                  Allergy
                </Text>
              </View>

              <View style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, { backgroundColor: "#F97316" }]}
                />
                <Text
                  style={[styles.timelineTime, { color: theme.textPrimary }]}
                >
                  2-6h
                </Text>
                <Text
                  style={[styles.timelineType, { color: theme.textSecondary }]}
                >
                  FODMAP
                </Text>
              </View>

              <View style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, { backgroundColor: "#34D399" }]}
                />
                <Text
                  style={[styles.timelineTime, { color: theme.textPrimary }]}
                >
                  6-24h
                </Text>
                <Text
                  style={[styles.timelineType, { color: theme.textSecondary }]}
                >
                  Intolerance
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.infoBox,
              { backgroundColor: isDark ? "#2c2c2e" : "#f5f5f5" },
            ]}
          >
            <Ionicons name="bulb-outline" size={18} color="#FBBF24" />
            <Text style={[styles.infoBoxText, { color: theme.textSecondary }]}>
              Don't worry about being exact. An estimate is fine!
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: { width: "100%", maxWidth: 340, borderRadius: 20, padding: 24 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  timeline: { marginBottom: 20 },
  timelineTrack: { height: 6, borderRadius: 3, marginBottom: 16 },
  timelineGradient: { flex: 1, height: "100%", borderRadius: 3 },
  timelineLabels: { flexDirection: "row", justifyContent: "space-between" },
  timelineItem: { alignItems: "center" },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  timelineTime: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  timelineType: { fontSize: 11 },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  infoBoxText: { flex: 1, fontSize: 13 },
});
