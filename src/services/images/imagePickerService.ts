import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

export async function pickPlantImageAsync(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Permission required",
      "Photo library permission is required to attach a plant photo.",
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0]?.uri ?? null;
}
