import { StyleSheet } from "react-native";

import { enatega } from "./theme";

/**
 * Layout/spacing values match Enatega's actual Login/Register/Main/Checkout
 * styles.js (rounded text fields, pill-shaped 28px-radius primary button,
 * light "Pink" theme) — see theme.ts for the color source.
 */
export const clientStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: enatega.themeBackground },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, gap: 10 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: enatega.borderColor,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: enatega.newFontcolor },
  headerLink: { color: enatega.linkColor, fontWeight: "600" },
  backLink: { color: enatega.linkColor, fontWeight: "600" },

  icon: { fontSize: 48, textAlign: "center", marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "700", color: enatega.newFontcolor, textAlign: "center" },
  subtitle: { fontSize: 14, color: enatega.fontSecondColor, textAlign: "center" },
  status: { fontSize: 16, fontWeight: "700", color: enatega.linkColor, textAlign: "center" },

  input: {
    borderWidth: 1,
    borderColor: enatega.borderColor,
    borderRadius: 6,
    backgroundColor: enatega.themeBackground,
    padding: 12,
    color: enatega.newFontcolor,
    marginBottom: 6,
  },
  inputError: {
    backgroundColor: enatega.errorInputBack,
    borderColor: enatega.errorInputBorder,
  },
  error: { color: enatega.textErrorColor, fontSize: 13, textAlign: "center" },

  button: {
    backgroundColor: enatega.main,
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: enatega.black, fontWeight: "700", fontSize: 16 },
  link: { color: enatega.linkColor, textAlign: "center", marginTop: 12, fontWeight: "600" },

  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  card: {
    backgroundColor: enatega.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: enatega.cardBorder,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: { color: enatega.newFontcolor, fontWeight: "700", fontSize: 16 },
  cardSubtitle: { color: enatega.fontSecondColor, fontSize: 13, marginTop: 2 },
  cardPrice: { color: enatega.linkColor, fontWeight: "700", marginTop: 4 },
  emptyText: { color: enatega.fontSecondColor, textAlign: "center", marginTop: 40 },

  sectionLabel: { color: enatega.newFontcolor, fontWeight: "700", fontSize: 15, marginTop: 10, marginBottom: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  summaryText: { color: enatega.newFontcolor, fontSize: 14 },
  summaryTotalText: { color: enatega.newFontcolor, fontSize: 16, fontWeight: "700" },

  paymentRow: { flexDirection: "row", gap: 10 },
  paymentOption: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: enatega.borderColor,
    paddingVertical: 12,
    alignItems: "center",
  },
  paymentOptionSelected: { borderColor: enatega.main, backgroundColor: "#F3FFEE" },
  paymentOptionText: { color: enatega.newFontcolor, fontWeight: "600", fontSize: 13, textAlign: "center" },

  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: enatega.main,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonText: { color: enatega.black, fontWeight: "700", fontSize: 16, lineHeight: 18 },
  stepperValue: { color: enatega.newFontcolor, fontWeight: "700", minWidth: 16, textAlign: "center" },

  addButton: {
    backgroundColor: enatega.main,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: { color: enatega.black, fontWeight: "600", fontSize: 13 },

  cartBar: {
    backgroundColor: enatega.main,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: "center",
  },
  cartBarText: { color: enatega.black, fontWeight: "700" },
});
