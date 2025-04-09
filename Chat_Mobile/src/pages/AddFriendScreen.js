import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import Header from "../components/Header";
import ConservationList from "../components/ConservationList";
import TabTopCategoryChat from "../navigation/TabTopCategoryChat";
import IconA from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import PhoneInput from "react-native-phone-input";

const { width, height } = Dimensions.get("window");

const AddFriendScreen = () => {
  const [phone, setPhone] = useState("");
  const isButtonEnabled = phone.trim() !== "";

  return (
    <SafeAreaView style={styles.container}>
      {/* Input Phone Number */}
      <View style={{ backgroundColor: "white", padding: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <PhoneInput
            style={styles.phoneInput}
            initialCountry="vn"
            autoFormat={true}
            autoValidation={true}
            textStyle={{ fontSize: 16, color: "#767A7F" }}
            onChangePhoneNumber={(phone) => setPhone(phone)}
            textProps={{
              placeholder: "Nhập số điện thoại",
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: isButtonEnabled ? "#006AF5" : "#B9BDC1",
              padding: 10,
              borderRadius: 22,
            }}
          >
            <IconA
              name="arrowright"
              size={24}
              color={isButtonEnabled ? "#B9BDC1" : "#767A7F"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="qr-code" size={24} color="#0250B6" />
          <Text style={styles.menuText}>Quét mã QR</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: "white", padding: 15, marginTop: 10 }}>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people" size={24} color="#0250B6" />
          <Text style={styles.menuText}>Danh bạ máy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-add" size={24} color="#0250B6" />
          <Text style={styles.menuText}>Bạn bè có thể quen</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: "#a0a0a0", marginTop: 20, textAlign: "center" }}>
        Xem lời mời kết bạn đã gửi tại trang Danh bạ 
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F6",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 10,
    gap: 10,
    borderRadius: 8,
  },
  menuText: {
    color: "black",
    fontSize: 16,
  },
  phoneInput: {
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#D6D9DC",
    width: width * 0.8,
  },
});
export default AddFriendScreen;
