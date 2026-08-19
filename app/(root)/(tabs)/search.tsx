// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Property } from "@/types";
// import { useFilterStore } from "@/store/filterStore";
// import { formatPrice } from "@/lib/utils";
// import PropertyCard from "@/components/PropertyCard";
// import FilterModal from "@/components/FilterModal";
// import { useLocalSearchParams } from "expo-router";

// export default function SearchScreen() {
//   const [results, setResults] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);

//   const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

//   useEffect(() => {
//     if (openFilters === "true") {
//       setShowFilters(true);
//     }
//   }, [openFilters]);

//   const {
//     search,
//     type,
//     bedrooms,
//     minPrice,
//     maxPrice,
//     setSearch,
//     setType,
//     setBedrooms,
//     setMinPrice,
//     setMaxPrice,
//   } = useFilterStore();

//   const activeFilterCount = [
//     type !== null,
//     bedrooms !== null,
//     minPrice !== null,
//     maxPrice !== null,
//   ].filter(Boolean).length;

//   useEffect(() => {
//     fetchResults();
//   }, [search, type, bedrooms, minPrice, maxPrice]);

//   const fetchResults = async () => {
//     setLoading(true);

//     let query = supabase.from("properties").select("*");

//     if (search) {
//       query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
//     }

//     if (type) {
//       query = query.eq("type", type);
//     }

//     if (bedrooms) {
//       query = query.eq("bedrooms", bedrooms);
//     }

//     if (minPrice) {
//       query = query.gte("price", minPrice);
//     }

//     if (maxPrice) {
//       query = query.lte("price", maxPrice);
//     }

//     const { data } = await query.order("created_at", { ascending: false });

//     setResults(data ?? []);
//     setLoading(false);
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="px-5 pt-4 pb-3">
//         <Text className="text-2xl font-bold text-gray-900 mb-4">
//           Find Property
//         </Text>

//         {/* Search Bar + Filter Button */}
//         <View className="flex-row items-center gap-3">
//           <View
//             className="flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3"
//             style={{
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.06,
//               shadowRadius: 6,
//               elevation: 2,
//             }}
//           >
//             <Ionicons name="search-outline" size={18} color="#9CA3AF" />
//             <TextInput
//               className="flex-1 py-3 text-gray-800"
//               placeholder="Search by title or city..."
//               placeholderTextColor="#9CA3AF"
//               value={search}
//               onChangeText={setSearch}
//               autoCapitalize="none"
//             />
//             {search.length > 0 && (
//               <TouchableOpacity onPress={() => setSearch("")}>
//                 <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Filter Button */}
//           <TouchableOpacity
//             onPress={() => setShowFilters(true)}
//             className={`w-12 h-12 rounded-2xl items-center justify-center ${
//               activeFilterCount > 0 ? "bg-blue-600" : "bg-white"
//             }`}
//             style={{
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.06,
//               shadowRadius: 6,
//               elevation: 2,
//             }}
//           >
//             <Ionicons
//               name="options-outline"
//               size={20}
//               color={activeFilterCount > 0 ? "#fff" : "#374151"}
//             />
//             {activeFilterCount > 0 && (
//               <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
//                 <Text className="text-white text-[9px] font-bold">
//                   {activeFilterCount}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Active Filter Chips */}
//         {activeFilterCount > 0 && (
//           <View className="flex-row flex-wrap gap-2 mt-3">
//             {type && (
//               <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
//                 <Text className="text-blue-700 text-xs font-semibold capitalize">
//                   {type}
//                 </Text>
//                 <TouchableOpacity onPress={() => setType(null)}>
//                   <Ionicons name="close" size={12} color="#1D4ED8" />
//                 </TouchableOpacity>
//               </View>
//             )}
//             {bedrooms !== null && (
//               <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
//                 <Ionicons name="bed-outline" size={11} color="#1D4ED8" />
//                 <Text className="text-blue-700 text-xs font-semibold">
//                   {bedrooms === 4
//                     ? "4+ beds"
//                     : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
//                 </Text>
//                 <TouchableOpacity onPress={() => setBedrooms(null)}>
//                   <Ionicons name="close" size={12} color="#1D4ED8" />
//                 </TouchableOpacity>
//               </View>
//             )}
//             {(minPrice !== null || maxPrice !== null) && (
//               <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
//                 <Text className="text-blue-700 text-xs font-semibold">
//                   {minPrice && maxPrice
//                     ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
//                     : minPrice
//                     ? `From ${formatPrice(minPrice)}`
//                     : `Up to ${formatPrice(maxPrice!)}`}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMinPrice(null);
//                     setMaxPrice(null);
//                   }}
//                 >
//                   <Ionicons name="close" size={12} color="#1D4ED8" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}
//       </View>

//       {/* Results */}
//       <FlatList
//         data={results}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => <PropertyCard property={item} />}
//         ListHeaderComponent={
//           <Text className="text-sm text-gray-400 mb-4">
//             {loading ? "Searching..." : `${results.length} properties found`}
//           </Text>
//         }
//         ListEmptyComponent={
//           !loading ? (
//             <View className="items-center py-20">
//               <Ionicons name="search-outline" size={48} color="#D1D5DB" />
//               <Text className="text-gray-400 mt-4 text-base">
//                 No properties found
//               </Text>
//               <Text className="text-gray-300 text-sm mt-1">
//                 Try a different search or adjust filters
//               </Text>
//             </View>
//           ) : (
//             <ActivityIndicator size="large" color="#2563EB" className="py-20" />
//           )
//         }
//       />

//       {/* Filter Modal */}
//       <FilterModal
//         visible={showFilters}
//         onClose={() => setShowFilters(false)}
//       />
//     </SafeAreaView>
//   );
// }







import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useFilterStore } from "@/store/filterStore";
import { formatPrice } from "@/lib/utils";
import PropertyCard from "@/components/PropertyCard";
import FilterModal from "@/components/FilterModal";
import { useLocalSearchParams } from "expo-router";

const BLUE = "#007AFF";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const BACKGROUND = "#F5F5F7";
const BORDER = "#E5E7EB";

export default function SearchScreen() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{
    openFilters?: string;
  }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResults = async () => {
    setLoading(true);

    let query = supabase
      .from("properties")
      .select("*");

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,city.ilike.%${search}%`
      );
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    const { data } = await query.order(
      "created_at",
      { ascending: false }
    );

    setResults(data ?? []);
    setLoading(false);
  };

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
          Find Property
        </Text>

        <Text
          className="mt-1"
          style={{
            color: TEXT_SECONDARY,
            fontSize: 14,
          }}
        >
          Discover your next place
        </Text>

        {/* =================================
            SEARCH + FILTER
        ================================== */}

        <View className="flex-row items-center mt-5">
          {/* Search */}

          <View
            className="flex-1 flex-row items-center"
            style={{
              height: 50,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: BORDER,
              paddingHorizontal: 14,
            }}
          >
            <Ionicons
              name="search-outline"
              size={19}
              color="#8E8E93"
            />

            <TextInput
              className="flex-1 ml-3"
              style={{
                color: TEXT_PRIMARY,
                fontSize: 15,
              }}
              placeholder="Search title or city"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch("")}
                hitSlop={10}
              >
                <Ionicons
                  name="close-circle"
                  size={19}
                  color="#C7C7CC"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter */}

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            activeOpacity={0.7}
            style={{
              width: 50,
              height: 50,
              marginLeft: 10,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                activeFilterCount > 0
                  ? BLUE
                  : "#FFFFFF",
              borderWidth:
                activeFilterCount > 0 ? 0 : 1,
              borderColor: BORDER,
            }}
          >
            <Ionicons
              name="options-outline"
              size={21}
              color={
                activeFilterCount > 0
                  ? "#FFFFFF"
                  : TEXT_PRIMARY
              }
            />

            {activeFilterCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: "#FF3B30",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: BACKGROUND,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 9,
                    fontWeight: "700",
                  }}
                >
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* =================================
            ACTIVE FILTERS
        ================================== */}

        {activeFilterCount > 0 && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              ...(type
                ? [
                    {
                      key: "type",
                      label: type,
                    },
                  ]
                : []),
              ...(bedrooms !== null
                ? [
                    {
                      key: "bedrooms",
                      label:
                        bedrooms === 4
                          ? "4+ beds"
                          : `${bedrooms} bed${
                              bedrooms > 1 ? "s" : ""
                            }`,
                    },
                  ]
                : []),
              ...(minPrice !== null ||
              maxPrice !== null
                ? [
                    {
                      key: "price",
                      label:
                        minPrice && maxPrice
                          ? `${formatPrice(
                              minPrice
                            )} – ${formatPrice(
                              maxPrice
                            )}`
                          : minPrice
                          ? `From ${formatPrice(
                              minPrice
                            )}`
                          : `Up to ${formatPrice(
                              maxPrice!
                            )}`,
                    },
                  ]
                : []),
            ]}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{
              paddingRight: 10,
            }}
            className="mt-3"
            renderItem={({ item }) => (
              <FilterChip
                label={item.label}
                onRemove={() => {
                  if (item.key === "type") {
                    setType(null);
                  }

                  if (item.key === "bedrooms") {
                    setBedrooms(null);
                  }

                  if (item.key === "price") {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }
                }}
              />
            )}
          />
        )}
      </View>

      {/* =====================================
          RESULTS
      ====================================== */}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 2,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <PropertyCard property={item} />
          </View>
        )}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-4">
            <Text
              style={{
                color: TEXT_SECONDARY,
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              {loading
                ? "Searching..."
                : `${results.length} ${
                    results.length === 1
                      ? "property"
                      : "properties"
                  } found`}
            </Text>

            {activeFilterCount > 0 && (
              <View className="flex-row items-center">
                <Ionicons
                  name="options-outline"
                  size={13}
                  color={BLUE}
                />

                <Text
                  className="ml-1"
                  style={{
                    color: BLUE,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {activeFilterCount} filter
                  {activeFilterCount > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-24 px-6">
              {/* Empty icon */}

              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 82,
                  height: 82,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: BORDER,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={34}
                  color="#A1A1AA"
                />
              </View>

              <Text
                className="mt-5"
                style={{
                  color: TEXT_PRIMARY,
                  fontSize: 19,
                  fontWeight: "700",
                }}
              >
                No Properties Found
              </Text>

              <Text
                className="text-center mt-2"
                style={{
                  color: TEXT_SECONDARY,
                  fontSize: 14,
                  lineHeight: 20,
                  maxWidth: 290,
                }}
              >
                Try searching for another city,
                property, or adjust your filters.
              </Text>

              {/* Clear filters */}

              {activeFilterCount > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setType(null);
                    setBedrooms(null);
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                  activeOpacity={0.7}
                  className="mt-5"
                >
                  <Text
                    style={{
                      color: BLUE,
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Clear Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="items-center py-24">
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
                Finding properties...
              </Text>
            </View>
          )
        }
      />

      {/* =====================================
          FILTER MODAL
      ====================================== */}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

/* ==========================================
   FILTER CHIP
========================================== */

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <View
      className="flex-row items-center"
      style={{
        height: 34,
        backgroundColor: "#FFFFFF",
        borderRadius: 17,
        paddingLeft: 12,
        paddingRight: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#BFDBFE",
      }}
    >
      <Text
        style={{
          color: BLUE,
          fontSize: 12,
          fontWeight: "600",
          textTransform: "capitalize",
        }}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={onRemove}
        hitSlop={8}
        className="ml-2"
      >
        <Ionicons
          name="close-circle"
          size={16}
          color={BLUE}
        />
      </TouchableOpacity>
    </View>
  );
}