
// import { useUserStore } from "@/store/userStore";
// import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

// export default function TabsLayout() {
//   const isAdmin = useUserStore((state) => state.isAdmin);

//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <Icon sf="house.fill" />
//         <Label>Home</Label>
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="search">
//         <Icon sf="magnifyingglass" />
//         <Label>Search</Label>
//       </NativeTabs.Trigger>

//       {isAdmin && (
//         <NativeTabs.Trigger name="create">
//           <Icon sf="plus.circle.fill" />
//           <Label>Add Property</Label>
//         </NativeTabs.Trigger>
//       )}

//       <NativeTabs.Trigger name="saved">
//         <Icon sf="heart.fill" />
//         <Label>Saved</Label>
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="profile">
//         <Icon sf="person.fill" />
//         <Label>Profile</Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }














// import React from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
//   Platform,
// } from "react-native";

// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { useUserStore } from "@/store/userStore";

// type IconName = keyof typeof Ionicons.glyphMap;

// const ACTIVE_COLOR = "#2563EB";
// const INACTIVE_COLOR = "#64748B";
// const ADD_COLOR = "#2563EB";
// const TAB_BACKGROUND = "#FFFFFF";

// function CustomTabBar({ state, descriptors, navigation }: any) {
//   const insets = useSafeAreaInsets();

//   const routes = state.routes.filter((route: any) => {
//     const options = descriptors[route.key]?.options;

//     return options?.href !== null;
//   });

//   return (
//     <View
//       pointerEvents="box-none"
//       style={[
//         styles.container,
//         {
//           paddingBottom: Math.max(insets.bottom, 8),
//         },
//       ]}
//     >
//       <View style={styles.tabBar}>
//         {routes.map((route: any) => {
//           const options = descriptors[route.key]?.options;

//           const isFocused =
//             state.index === state.routes.findIndex(
//               (r: any) => r.key === route.key
//             );

//           const isCreate = route.name === "create";

//           let iconName: IconName = "home-outline";
//           let activeIconName: IconName = "home";

//           if (route.name === "index") {
//             iconName = "home-outline";
//             activeIconName = "home";
//           }

//           if (route.name === "search") {
//             iconName = "search-outline";
//             activeIconName = "search";
//           }

//           if (route.name === "create") {
//             iconName = "add";
//             activeIconName = "add";
//           }

//           if (route.name === "saved") {
//             iconName = "heart-outline";
//             activeIconName = "heart";
//           }

//           if (route.name === "profile") {
//             iconName = "person-outline";
//             activeIconName = "person";
//           }

//           const color = isFocused
//             ? ACTIVE_COLOR
//             : INACTIVE_COLOR;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: "tabPress",
//               target: route.key,
//               canPreventDefault: true,
//             });

//             if (!isFocused && !event.defaultPrevented) {
//               navigation.navigate(route.name);
//             }
//           };

//           return (
//             <Pressable
//               key={route.key}
//               onPress={onPress}
//               style={[
//                 styles.tabItem,
//                 isCreate && styles.createItem,
//               ]}
//               android_ripple={{
//                 color: "#DBEAFE",
//                 borderless: true,
//               }}
//             >
//               {isCreate ? (
//                 <View
//                   style={[
//                     styles.addButton,
//                     isFocused && styles.addButtonActive,
//                   ]}
//                 >
//                   <Ionicons
//                     name="add"
//                     size={27}
//                     color="#FFFFFF"
//                   />
//                 </View>
//               ) : (
//                 <Ionicons
//                   name={
//                     isFocused
//                       ? activeIconName
//                       : iconName
//                   }
//                   size={22}
//                   color={color}
//                 />
//               )}

//               <Text
//                 style={[
//                   styles.label,
//                   {
//                     color: isCreate
//                       ? isFocused
//                         ? ADD_COLOR
//                         : INACTIVE_COLOR
//                       : color,
//                   },
//                   isFocused && styles.activeLabel,
//                 ]}
//                 numberOfLines={1}
//               >
//                 {options?.title ??
//                   getTabTitle(route.name)}
//               </Text>
//             </Pressable>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// function getTabTitle(routeName: string) {
//   switch (routeName) {
//     case "index":
//       return "Home";

//     case "search":
//       return "Search";

//     case "create":
//       return "Add Property";

//     case "saved":
//       return "Saved";

//     case "profile":
//       return "Profile";

//     default:
//       return "";
//   }
// }

// export default function TabsLayout() {
//   // const isAdmin = useUserStore(
//   //   (state) => state.isAdmin
//   // );
//   const isAdmin = useUserStore((state) => state.isAdmin);

// console.log("🔥 TAB isAdmin =", isAdmin);

//   return (
//     <Tabs
//       tabBar={(props) => (
//         <CustomTabBar {...props} />
//       )}
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       {/* ============================
//           HOME
//       ============================= */}

//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//         }}
//       />

//       {/* ============================
//           SEARCH
//       ============================= */}

//       <Tabs.Screen
//         name="search"
//         options={{
//           title: "Search",
//         }}
//       />

//       {/* ============================
//           ADD PROPERTY
//           ADMIN ONLY
//       ============================= */}

//       <Tabs.Screen
//         name="create"
//         options={{
//           title: "Add Property",
//           href: isAdmin ? "/create" : null,
//         }}
//       />

//       {/* ============================
//           SAVED
//       ============================= */}

//       <Tabs.Screen
//         name="saved"
//         options={{
//           title: "Saved",
//         }}
//       />

//       {/* ============================
//           PROFILE
//       ============================= */}

//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,

//     alignItems: "center",

//     paddingHorizontal: 14,
//     paddingTop: 8,

//     backgroundColor: "transparent",
//   },

//   tabBar: {
//     width: "100%",

//     maxWidth: 500,

//     minHeight: 68,

//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",

//     backgroundColor: TAB_BACKGROUND,

//     borderRadius: 28,

//     paddingHorizontal: 8,
//     paddingTop: 5,
//     paddingBottom: 4,

//     borderWidth: 1,
//     borderColor: "#E8EEF7",

//     shadowColor: "#0F172A",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.12,
//     shadowRadius: 18,

//     elevation: 10,

//     ...Platform.select({
//       android: {
//         elevation: 12,
//       },
//     }),
//   },

//   tabItem: {
//     flex: 1,

//     minHeight: 58,

//     alignItems: "center",
//     justifyContent: "center",

//     borderRadius: 22,

//     paddingHorizontal: 2,
//   },

//   createItem: {
//     justifyContent: "center",
//   },

//   addButton: {
//     width: 46,
//     height: 46,

//     borderRadius: 23,

//     alignItems: "center",
//     justifyContent: "center",

//     backgroundColor: ADD_COLOR,

//     marginTop: -15,

//     borderWidth: 4,
//     borderColor: "#FFFFFF",

//     shadowColor: "#2563EB",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,

//     elevation: 8,
//   },

//   addButtonActive: {
//     transform: [
//       {
//         scale: 1.04,
//       },
//     ],
//   },

//   label: {
//     fontSize: 10,

//     fontWeight: "500",

//     marginTop: 3,

//     textAlign: "center",
//   },

//   activeLabel: {
//     fontWeight: "700",
//   },
// });





















import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useUserStore } from "@/store/userStore";

type IconName = keyof typeof Ionicons.glyphMap;

const ACTIVE_COLOR = "#2563EB";
const INACTIVE_COLOR = "#64748B";
const ADD_COLOR = "#2563EB";
const TAB_BACKGROUND = "#FFFFFF";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  // 🔥 Same admin logic as your working NativeTabs code
  const isAdmin = useUserStore((state) => state.isAdmin);

  console.log("🔥 CUSTOM TAB isAdmin =", isAdmin);

  // 🔥 Add Property is shown ONLY for admin
  const routes = state.routes.filter((route: any) => {
    if (route.name === "create") {
      return isAdmin === true;
    }

    return true;
  });

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.tabBar}>
        {routes.map((route: any) => {
          const options = descriptors[route.key]?.options;

          const isFocused =
            state.index ===
            state.routes.findIndex(
              (r: any) => r.key === route.key
            );

          const isCreate = route.name === "create";

          let iconName: IconName = "home-outline";
          let activeIconName: IconName = "home";

          if (route.name === "index") {
            iconName = "home-outline";
            activeIconName = "home";
          }

          if (route.name === "search") {
            iconName = "search-outline";
            activeIconName = "search";
          }

          if (route.name === "create") {
            iconName = "add";
            activeIconName = "add";
          }

          if (route.name === "saved") {
            iconName = "heart-outline";
            activeIconName = "heart";
          }

          if (route.name === "profile") {
            iconName = "person-outline";
            activeIconName = "person";
          }

          const color = isFocused
            ? ACTIVE_COLOR
            : INACTIVE_COLOR;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isCreate && styles.createItem,
              ]}
              android_ripple={{
                color: "#DBEAFE",
                borderless: true,
              }}
            >
              {isCreate ? (
                <View
                  style={[
                    styles.addButton,
                    isFocused && styles.addButtonActive,
                  ]}
                >
                  <Ionicons
                    name="add"
                    size={27}
                    color="#FFFFFF"
                  />
                </View>
              ) : (
                <Ionicons
                  name={
                    isFocused
                      ? activeIconName
                      : iconName
                  }
                  size={22}
                  color={color}
                />
              )}

              <Text
                style={[
                  styles.label,
                  {
                    color: isCreate
                      ? isFocused
                        ? ADD_COLOR
                        : INACTIVE_COLOR
                      : color,
                  },
                  isFocused && styles.activeLabel,
                ]}
                numberOfLines={1}
              >
                {options?.title ??
                  getTabTitle(route.name)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function getTabTitle(routeName: string) {
  switch (routeName) {
    case "index":
      return "Home";

    case "search":
      return "Search";

    case "create":
      return "Add Property";

    case "saved":
      return "Saved";

    case "profile":
      return "Profile";

    default:
      return "";
  }
}

export default function TabsLayout() {
  const isAdmin = useUserStore(
    (state) => state.isAdmin
  );

  console.log("🔥 TAB isAdmin =", isAdmin);

  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* ============================
          HOME
      ============================= */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      {/* ============================
          SEARCH
      ============================= */}

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />

      {/* ============================
          ADD PROPERTY
          ADMIN ONLY
      ============================= */}

      <Tabs.Screen
        name="create"
        options={{
          title: "Add Property",
        }}
      />

      {/* ============================
          SAVED
      ============================= */}

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
        }}
      />

      {/* ============================
          PROFILE
      ============================= */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: "center",

    paddingHorizontal: 14,
    paddingTop: 8,

    backgroundColor: "transparent",
  },

  tabBar: {
    width: "100%",

    maxWidth: 500,

    minHeight: 68,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    backgroundColor: TAB_BACKGROUND,

    borderRadius: 28,

    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 4,

    borderWidth: 1,
    borderColor: "#E8EEF7",

    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,

    elevation: 10,

    ...Platform.select({
      android: {
        elevation: 12,
      },
    }),
  },

  tabItem: {
    flex: 1,

    minHeight: 58,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 22,

    paddingHorizontal: 2,
  },

  createItem: {
    justifyContent: "center",
  },

  addButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: ADD_COLOR,

    marginTop: -15,

    borderWidth: 4,
    borderColor: "#FFFFFF",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 8,
  },

  addButtonActive: {
    transform: [
      {
        scale: 1.04,
      },
    ],
  },

  label: {
    fontSize: 10,

    fontWeight: "500",

    marginTop: 3,

    textAlign: "center",
  },

  activeLabel: {
    fontWeight: "700",
  },
});