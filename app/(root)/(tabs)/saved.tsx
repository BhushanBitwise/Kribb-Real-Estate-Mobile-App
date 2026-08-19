// import { useSupabase } from "@/hooks/useSupabase";
// import { Property } from "@/types";
// import { useAuth } from "@clerk/expo";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useFocusEffect } from "@react-navigation/native";
// import PropertyCard from "@/components/PropertyCard";

// interface SavedProperty {
//   id: string;
//   property_id: string;
//   properties: Property;
// }

// export default function SavedScreen() {
//   const { userId } = useAuth();
//   const authSupabase = useSupabase();
//   const router = useRouter();

//   const [saved, setSaved] = useState<SavedProperty[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchSaved = useCallback(async () => {
//     if (!userId) return;
//     setLoading(true);
//     const { data } = await authSupabase
//       .from("saved_properties")
//       .select("id, property_id, properties(*)")
//       .eq("user_clerk_id", userId)
//       .order("id", { ascending: false });

//     setSaved((data as unknown as SavedProperty[]) ?? []);
//     setLoading(false);
//   }, [userId]);

//   // Refresh every time the tab comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchSaved();
//     }, [fetchSaved])
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="px-5 pt-4 pb-3">
//         <Text className="text-2xl font-bold text-gray-900">Saved</Text>
//         {!loading && (
//           <Text className="text-sm text-gray-400 mt-1">
//             {saved.length} {saved.length === 1 ? "property" : "properties"}{" "}
//             saved
//           </Text>
//         )}
//       </View>

//       {loading ? (
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color="#2563EB" />
//         </View>
//       ) : (
//         <FlatList
//           data={saved}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <PropertyCard
//               property={item.properties}
//               onUnsave={() =>
//                 setSaved((prev) => prev.filter((s) => s.id !== item.id))
//               }
//               showSave
//             />
//           )}
//           ListEmptyComponent={
//             <View className="flex-1 items-center justify-center py-24">
//               <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
//                 <Ionicons name="heart-outline" size={36} color="#EF4444" />
//               </View>
//               <Text className="text-gray-700 text-lg font-bold mb-1">
//                 No saved properties
//               </Text>
//               <Text className="text-gray-400 text-sm text-center px-8">
//                 Tap the heart icon on any property to save it here
//               </Text>
//               <TouchableOpacity
//                 onPress={() => router.push("/(root)/(tabs)/search")}
//                 className="mt-6 bg-blue-600 px-6 py-3 rounded-2xl"
//               >
//                 <Text className="text-white font-semibold">
//                   Browse Properties
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// }









import { useSupabase } from "@/hooks/useSupabase";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import PropertyCard from "@/components/PropertyCard";

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

const BLUE = "#007AFF";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const BACKGROUND = "#F5F5F7";
const BORDER = "#E5E7EB";

export default function SavedScreen() {
  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    const { data } = await authSupabase
      .from("saved_properties")
      .select("id, property_id, properties(*)")
      .eq("user_clerk_id", userId)
      .order("id", { ascending: false });

    setSaved(
      (data as unknown as SavedProperty[]) ?? []
    );

    setLoading(false);
  }, [userId]);

  // Refresh every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{
        backgroundColor: BACKGROUND,
      }}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <View className="px-5 pt-4 pb-4">
        <Text
          style={{
            color: TEXT_PRIMARY,
            fontSize: 34,
            fontWeight: "700",
            letterSpacing: -1,
          }}
        >
          Saved
        </Text>

        {!loading && (
          <View className="flex-row items-center mt-1">
            <Ionicons
              name="heart"
              size={13}
              color={BLUE}
            />

            <Text
              className="ml-1.5"
              style={{
                color: TEXT_SECONDARY,
                fontSize: 14,
              }}
            >
              {saved.length}{" "}
              {saved.length === 1
                ? "property"
                : "properties"}{" "}
              saved
            </Text>
          </View>
        )}
      </View>

      {/* =====================================
          LOADING
      ====================================== */}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={BLUE}
          />

          <Text
            className="mt-3"
            style={{
              color: TEXT_SECONDARY,
              fontSize: 14,
            }}
          >
            Loading saved properties...
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: 120,
            flexGrow: saved.length === 0 ? 1 : 0,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 16,
              }}
            >
              <PropertyCard
                property={item.properties}
                onUnsave={() =>
                  setSaved((prev) =>
                    prev.filter(
                      (s) => s.id !== item.id
                    )
                  )
                }
                showSave
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-6">
              {/* =================================
                  EMPTY STATE ICON
              ================================== */}

              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 88,
                  height: 88,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: BORDER,
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={38}
                  color={BLUE}
                />
              </View>

              {/* =================================
                  EMPTY STATE TEXT
              ================================== */}

              <Text
                className="mt-5 text-center"
                style={{
                  color: TEXT_PRIMARY,
                  fontSize: 20,
                  fontWeight: "700",
                  letterSpacing: -0.3,
                }}
              >
                No Saved Properties
              </Text>

              <Text
                className="mt-2 text-center"
                style={{
                  color: TEXT_SECONDARY,
                  fontSize: 14,
                  lineHeight: 21,
                  maxWidth: 300,
                }}
              >
                Properties you save will appear
                here for quick access.
              </Text>

              {/* =================================
                  BROWSE BUTTON
              ================================== */}

              <TouchableOpacity
                onPress={() =>
                  router.push(
                    "/(root)/(tabs)/search"
                  )
                }
                activeOpacity={0.8}
                className="flex-row items-center justify-center mt-7"
                style={{
                  height: 48,
                  paddingHorizontal: 22,
                  borderRadius: 14,
                  backgroundColor: BLUE,
                  shadowColor: BLUE,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text
                  className="ml-2"
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  Browse Properties
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}