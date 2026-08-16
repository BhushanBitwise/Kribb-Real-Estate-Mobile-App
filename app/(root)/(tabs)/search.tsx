import { StyleSheet, Text, TextInput, View } from "react-native";

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput placeholder="Search city or property" style={styles.input} />

      <View style={styles.box}>
        <Text style={styles.boxTitle}>City View Homes</Text>
        <Text style={styles.boxText}>2 bed • 1 bath • $1,200</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Green Park Villa</Text>
        <Text style={styles.boxText}>4 bed • 3 bath • $2,900</Text>
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
    marginBottom: 12,
    color: "#111827",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  boxText: {
    color: "#6B7280",
  },
});
