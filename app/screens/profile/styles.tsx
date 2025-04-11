import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  // profile
  profileImage: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileInfo: {
    fontSize: 12,
    color: "gray",
  },
  profileInfoCount: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },

  // bar tabs
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginHorizontal: 20,

    gap: 10,
    justifyContent: "space-between",
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 6,
    width: "30%",
    alignItems: "center",
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

  // drawer or bottom sheet
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
    gap: 6,
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  dashboardButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },
  dashboardButtonActive: {
    backgroundColor: "#006A71",
  },
  dashboardButtonText: {
    color: "#323232",
    fontWeight: "500",
  },

  // statistics
});

export default Styles;
