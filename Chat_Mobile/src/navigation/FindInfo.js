import React, { useState, useCallback } from "react";
import { 
  View, Text, TextInput, FlatList, Image, TouchableOpacity, 
  StyleSheet, Dimensions 
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import IconA from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window"); // Lấy kích thước màn hình

const FindInfo = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  // Danh sách liên hệ gần đây
  const recentContacts = [
    { id: "1", name: "Chim rừng kêu trong m...", image: "https://i.pravatar.cc/300?img=3" },
    { id: "2", name: "Mc", image: "https://i.pravatar.cc/300?img=4" },
    { id: "3", name: "Đào Văn Thái Kiệt", image: "https://i.pravatar.cc/300?img=5" },
    { id: "4", name: "MỆIU", image: "https://i.pravatar.cc/300?img=6" },
  ];

  // Các mục truy cập nhanh
  const quickAccess = [
    { id: "1", name: "Ví QR", icon: "qr-code" },
    { id: "2", name: "Zalo Video", icon: "videocam" },
    { id: "3", name: "Thêm", icon: "add-circle" },
  ];

  // Lịch sử tìm kiếm
  const searchHistory = ["ch", "0869188794", "thái", "mẹ", "sinh"];

  // Render Item cho danh sách liên hệ
  const renderContact = useCallback(({ item }) => (
    <View style={styles.contactItem}>
      <Image source={{ uri: item.image }} style={styles.contactImage} />
      <Text style={styles.contactName}>{item.name}</Text>
    </View>
  ), []);

  // Render Item cho lịch sử tìm kiếm
  const renderHistory = useCallback(({ item }) => (
    <View style={styles.historyItem}>
      <Icon name="search-outline" size={20} color="#999" />
      <Text style={styles.historyText}>{item}</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#006AF5", "#5FCBF2"]}
        locations={[0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBox}>
          <IconA name="search1" size={24} color="#fff" />
          <TextInput
            placeholder="Tìm kiếm"
            placeholderTextColor={"#B8D9FF"}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Danh sách liên hệ gần đây */}
      <Text style={styles.sectionTitle}>Liên hệ đã tìm</Text>
      <FlatList
        horizontal
        data={recentContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
      />

      {/* Truy cập nhanh */}
      <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
      <View style={styles.quickAccessContainer}>
        {quickAccess.map((item) => (
          <TouchableOpacity key={item.id} style={styles.quickAccessItem}>
            <Icon name={item.icon} size={40} color="#007AFF" />
            <Text style={styles.quickAccessText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lịch sử tìm kiếm */}
      <Text style={styles.sectionTitle}>Từ khóa đã tìm</Text>
      <FlatList
        data={searchHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHistory}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={<View style={{ height: 80 }} />} // Chừa vùng trống
      />

      {/* Nút chỉnh sửa lịch sử tìm kiếm */}
      <TouchableOpacity>
        <Text style={styles.editHistoryText}>Chỉnh sửa lịch sử tìm kiếm &gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🎨 **StyleSheet**
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
    paddingBottom: 20, // Chừa khoảng trống phía dưới
  },

  // Header Gradient
  headerContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 10, 
    paddingHorizontal: 10 
  },

  // Thanh tìm kiếm
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 40,
    width: width * 0.9,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },

  // Tiêu đề từng phần
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginVertical: 10,
    padding: 10,
  },

  // Liên hệ đã tìm
  contactItem: { 
    alignItems: "center", 
    marginRight: 15,
    padding: 10,
  },
  contactImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
  contactName: { 
    fontSize: 12, 
    textAlign: "center", 
    marginTop: 5 
  },

  // Truy cập nhanh
  quickAccessContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginVertical: 10 
  },

  // Lịch sử tìm kiếm
  historyItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 8,
    padding: 10,
  },
  historyText: { 
    fontSize: 14, 
    marginLeft: 10,
  },

  // Nút chỉnh sửa lịch sử tìm kiếm
  editHistoryText: { 
    color: "#007AFF", 
    padding: 10,
  },
});

export default FindInfo;
