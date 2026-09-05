import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0F172A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: "#2563EB",
    fontSize: 15,
  },
});
