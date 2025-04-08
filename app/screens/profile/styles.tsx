import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  // profile
  profileImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileInfo: {
    fontSize: 12,
    color: "gray",
  },
  profileInfoCount: {
    fontSize: 14,
    color: "black",
  },

  // bar tabs
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#006A71",
  },
  tabText: {
    color: "#333",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "white",
    fontWeight: "bold",
  },

  // bottom sheet
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetContentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  drawerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // dashboard buttons
  dashboardContainer: {
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dashboardButton: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#48A6A7",
    borderRadius: 12,
  },
  dashboardButtonActive: {
    backgroundColor: "#006A71",
  },
  dashboardButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default Styles;
