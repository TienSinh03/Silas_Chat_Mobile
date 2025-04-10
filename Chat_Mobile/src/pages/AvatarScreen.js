import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { signUp } from "../api/authApi";
import { storeToken, storeRefreshToken } from "../utils/authHelper";

const { width, height } = Dimensions.get("window");

const AvatarScreen = ({ navigation, route }) => {
  const { phone, name, gender, birthDate, password  } = route.params;

  const [avatar, setAvatar] = useState(null); // Avatar mặc định là null
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

  // Hàm đăng ký tài khoản
  const handleSignUp = async () => {
    console.log("Đang đăng ký với số điện thoại:");
    console.log(phone);
    console.log("Đang đăng ký với tên:");
    console.log(name);
    console.log("Đang đăng ký với ngày sinh:");
    console.log(birthDate);
    console.log("Đang đăng ký với giới tính:");
    
    console.log(gender);

    console.log("Đang đăng ký với mật khẩu:");
    console.log(password);


    const params = { 
        phone, 
        display_name: name, 
        gender, 
        dob: birthDate, 
        password,
        ...(avatar ? { avatar } : {}), // Chỉ thêm avatar nếu có

    };
    console.log("Đang đăng ký với thông tin:", params);
    try {
      const response = await signUp(params);

      if (response) {

        navigation.navigate("LoginScreen", { phoneLogin: phone, passwordLogin: password });
        Alert.alert("Đăng ký thành công", "Vui lòng đăng nhập để tiếp tục.");
      }
    } catch (error) {
      console.log("Sign up error:", error);
      Alert.alert("Đăng ký thất bại", "Vui lòng thử lại sau.");
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
        onPress={() => {}}
      >
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>

      {/* Nút bỏ qua */}
      <TouchableOpacity onPress={() => { console.log("Đang cập nhật"); handleSignUp()}}>
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
