import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

const AvatarScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState(null);
  const initials = "LT"; // Chữ viết tắt

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật ảnh đại diện</Text>
      <Text style={styles.subtitle}>
        Đặt ảnh đại diện để mọi người dễ nhận ra bạn
      </Text>

      {/* Avatar */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Nút cập nhật */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Conversation")}
      >
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>

      {/* Nút bỏ qua */}
      <TouchableOpacity onPress={() => navigation.navigate("Conversation")}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9FF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.1,
  },
  title: {
    fontSize: height * 0.025,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: height * 0.018,
    color: "gray",
    textAlign: "center",
    marginBottom: height * 0.05,
  },
  avatarContainer: {
    marginBottom: height * 0.05,
  },
  avatar: {
    width: height * 0.1,
    height: height * 0.1,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: height * 0.15,
    height: height * 0.15,
    borderRadius: height * 0.1,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: height * 0.04,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: height * 0.015,
    paddingHorizontal: height * 0.15,
    borderRadius: height * 0.1,
    alignItems: "center",
    marginTop: height * 0.4,
    marginBottom: height * 0.03,
  },
  buttonText: {
    color: "white",
    fontSize: height * 0.02,
    fontWeight: "bold",
  },
  skipText: {
    fontSize: height * 0.02,
    fontWeight: "bold",
  },
});

export default AvatarScreen;
