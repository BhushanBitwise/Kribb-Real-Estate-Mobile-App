// import { useAuth, useUser } from "@clerk/expo";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Linking,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function ProfileScreen() {
//   const { user, isLoaded } = useUser();
//   const { signOut } = useAuth();
//   const router = useRouter();
//   const [isUpdating, setIsUpdating] = useState(false);

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       router.replace("/sign-in");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   const handleUpdateProfileImage = async () => {
//     try {
//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission Required",
//           "Please allow access to your photo library to update your profile picture."
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: "images",
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//         base64: true,
//       });

//       if (result.canceled) return;

//       setIsUpdating(true);

//       const base64Image = result.assets[0].base64;
//       const uri = result.assets[0].uri;
//       const filename = uri.split("/").pop() || "profile.jpg";
//       const match = /\.(\w+)$/.exec(filename);
//       const mimeType = match ? `image/${match[1]}` : "image/jpeg";
//       const dataUrl = `data:${mimeType};base64,${base64Image}`;

//       await user?.setProfileImage({ file: dataUrl });

//       Alert.alert("Success", "Profile picture updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile image:", error);
//       Alert.alert(
//         "Error",
//         "Failed to update profile picture. Please try again."
//       );
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   if (!isLoaded || !user) {
//     return (
//       <SafeAreaView className="flex-1 bg-white items-center justify-center">
//         <ActivityIndicator size="large" color="#3B82F6" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white mb-10">
//       {/* Avatar + Name */}
//       <View className="items-center py-8">
//         <View className="relative">
//           <Image
//             source={{ uri: user.imageUrl }}
//             className="w-24 h-24 rounded-full mb-4"
//           />
//           <TouchableOpacity
//             onPress={handleUpdateProfileImage}
//             disabled={isUpdating}
//             className="absolute bottom-3 right-0 bg-blue-600 rounded-full p-2"
//           >
//             {isUpdating ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : (
//               <Ionicons name="camera" size={16} color="white" />
//             )}
//           </TouchableOpacity>
//         </View>
//         <Text className="text-xl font-bold text-gray-800">
//           {user.firstName} {user.lastName}
//         </Text>
//         <Text className="text-gray-500 mt-1">
//           {user.emailAddresses[0].emailAddress}
//         </Text>
//       </View>

//       {/* Menu Items */}
//       <View className="px-6 gap-2">
//         <MenuItem
//           icon="heart-outline"
//           label="Saved Properties"
//           onPress={() => router.push("/(root)/(tabs)/saved")}
//         />
//         <MenuItem
//           icon="notifications-outline"
//           label="Notifications"
//           onPress={() =>
//             Alert.alert("Coming Soon", "Notifications coming soon!")
//           }
//         />
//         <MenuItem
//           icon="settings-outline"
//           label="Settings"
//           onPress={() => Alert.alert("Coming Soon", "Settings coming soon!")}
//         />
//         <MenuItem
//           icon="help-circle-outline"
//           label="Help & Support"
//           onPress={() =>
//             Linking.openURL(
//               "mailto:thebhushan752@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App"
//             )
//           }
//         />
//       </View>

//       {/* Sign Out */}
//       <View className="px-6 mt-auto mb-8">
//         <TouchableOpacity
//           onPress={handleSignOut}
//           className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
//         >
//           <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//           <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// function MenuItem({
//   icon,
//   label,
//   onPress,
// }: {
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   onPress?: () => void;
// }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       className="flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl"
//     >
//       <Ionicons name={icon} size={22} color="#6B7280" />
//       <Text className="flex-1 text-gray-700 font-medium text-base">
//         {label}
//       </Text>
//       <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
//     </TouchableOpacity>
//   );
// }






















import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BLUE = "#007AFF";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const SEPARATOR = "#E5E7EB";
const BACKGROUND = "#F5F5F7";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;

      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";

      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({
        file: dataUrl,
      });

      Alert.alert(
        "Success",
        "Profile picture updated successfully!"
      );
    } catch (error) {
      console.error("Error updating profile image:", error);

      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: BACKGROUND }}
      >
        <ActivityIndicator
          size="large"
          color={BLUE}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: BACKGROUND }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* =====================================
            HEADER
        ====================================== */}

        <View className="px-5 pt-4 pb-3">
          <Text
            style={{
              color: TEXT_PRIMARY,
              fontSize: 34,
              fontWeight: "700",
              letterSpacing: -1,
            }}
          >
            Profile
          </Text>
        </View>

        {/* =====================================
            PROFILE HEADER
        ====================================== */}

        <View className="items-center px-5 pt-5 pb-7">
          <View className="relative">
            <Image
              source={{ uri: user.imageUrl }}
              style={{
                width: 108,
                height: 108,
                borderRadius: 54,
              }}
            />

            <TouchableOpacity
              onPress={handleUpdateProfileImage}
              disabled={isUpdating}
              activeOpacity={0.8}
              style={{
                position: "absolute",
                right: 0,
                bottom: 1,
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: BLUE,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: BACKGROUND,
              }}
            >
              {isUpdating ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="camera"
                  size={16}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          </View>

          <Text
            className="mt-4"
            style={{
              color: TEXT_PRIMARY,
              fontSize: 22,
              fontWeight: "700",
              letterSpacing: -0.3,
            }}
          >
            {user.firstName} {user.lastName}
          </Text>

          <Text
            className="mt-1"
            style={{
              color: TEXT_SECONDARY,
              fontSize: 14,
            }}
          >
            {user.emailAddresses[0].emailAddress}
          </Text>
        </View>

        {/* =====================================
            ACCOUNT SECTION
        ====================================== */}

        <View className="px-5">
          <Text
            className="mb-2 px-1"
            style={{
              color: TEXT_SECONDARY,
              fontSize: 13,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Account
          </Text>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <IOSMenuItem
              icon="heart-outline"
              iconColor="#FF375F"
              label="Saved Properties"
              onPress={() =>
                router.push("/(root)/(tabs)/saved")
              }
            />

            <IOSDivider />

            <IOSMenuItem
              icon="notifications-outline"
              iconColor={BLUE}
              label="Notifications"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Notifications coming soon!"
                )
              }
            />

            <IOSDivider />

            <IOSMenuItem
              icon="settings-outline"
              iconColor="#8E8E93"
              label="Settings"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Settings coming soon!"
                )
              }
            />

            <IOSDivider />

            <IOSMenuItem
              icon="help-circle-outline"
              iconColor="#5856D6"
              label="Help & Support"
              onPress={() =>
                Linking.openURL(
                  "mailto:thebhushan752@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App"
                )
              }
            />
          </View>
        </View>

        {/* =====================================
            SIGN OUT
        ====================================== */}

        <View className="px-5 mt-7">
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
            style={{
              height: 52,
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#FF3B30",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* =====================================
            APP INFO
        ====================================== */}

        <View className="items-center mt-7">
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 12,
            }}
          >
            Kribb
          </Text>

          <Text
            className="mt-1"
            style={{
              color: "#C4C4C7",
              fontSize: 11,
            }}
          >
            Your property companion
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ==========================================
   iOS STYLE MENU ITEM
========================================== */

function IOSMenuItem({
  icon,
  iconColor,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={iconColor}
      />

      <Text
        style={{
          flex: 1,
          marginLeft: 15,
          color: TEXT_PRIMARY,
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#C7C7CC"
      />
    </TouchableOpacity>
  );
}

/* ==========================================
   IOS SEPARATOR
========================================== */

function IOSDivider() {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: SEPARATOR,
        marginLeft: 53,
      }}
    />
  );
}