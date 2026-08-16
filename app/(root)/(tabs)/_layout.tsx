import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Colors
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",

        // Bottom Tab Bar
        tabBarStyle: {
          position: "absolute",

          // Proper spacing from screen edges
          left: 16,
          right: 16,

          // Automatically handles Android/iPhone bottom safe area
          bottom: Math.max(insets.bottom, 12),

          height: 70,

          backgroundColor: "#FFFFFF",

          borderRadius: 35,

          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "#E5E7EB",

          // Soft shadow
          shadowColor: "#000",
          shadowOpacity: 0.10,
          shadowRadius: 12,
          shadowOffset: {
            width: 0,
            height: 5,
          },

          elevation: 6,
        },

        // Proper spacing between tabs
        tabBarItemStyle: {
          borderRadius: 28,
          marginHorizontal: 4,
          marginVertical: 5,
        },

        // Labels
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 1,
        },

        // Icons
        tabBarIconStyle: {
          marginTop: 1,
        },

        // Keyboard ke time tab hide
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* SAVED */}
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}