import { StyleSheet, Text, View } from "react-native";

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ocean Crest</Text>
        <Text style={styles.cardText}>Saved today</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Maple House</Text>
        <Text style={styles.cardText}>Saved last week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
  cardText: {
    color: "#6B7280",
  },
});
