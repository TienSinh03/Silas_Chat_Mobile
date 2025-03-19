import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const dummyContacts = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    id: "2",
    name: "Trần Thị B",
    phone: "0987654321",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "23",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "73",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },  {
    id: "32",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },  {
    id: "63",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },  {
    id: "5",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },  {
    id: "43",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },  {
    id: "9",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },  {
    id: "13",
    name: "Lê Văn C",
    phone: "0345678901",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const PhoneBookFriend = () => {
  const [searchText, setSearchText] = useState("");

  const filteredContacts = dummyContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>


      {/* Danh mục */}
      <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="user-plus" size={20} color="#007AFF" style={styles.icons}/>
        </View>
        <Text style={styles.menuText}>Lời mời kết bạn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="address-book" size={20} color="#34C759" style={styles.icons}/>
        </View>
        <View>
          <Text style={styles.menuText}>Danh bạ máy</Text>
          <Text style={styles.subText}>Các liên hệ có dùng Zalo</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Icon name="gift" size={20} color="#FF9500" style={styles.icons}/>
        </View>
        <Text style={styles.menuText}>Sinh nhật</Text>
      </TouchableOpacity>
    </View>
      {/* Thanh phân cách */}
      <View style={styles.separator} />

      {/* Danh sách bạn bè */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Image source={{uri:item.avatar}} style={styles.avatar} />
            <Text style={styles.contactName}>{item.name}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <Icon name="phone" size={20} color="#34C759" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="video-camera" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  menuContainer: {
    // padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    padding:10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    // marginRight: 220,
    // marginRight: 22,
    // padding: 5,
    gap: 5,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  subText: {
    fontSize: 12,
    color: "#aaa",
    marginLeft: 10,

  },
  icons: {
    borderColor: "#000",  // Màu viền
    borderRadius:  0.3,     // Bo góc
    backgroundColor: "#006AF5", // Màu nền
    color: "#FFFFFF",     // Màu chữ (chỉ áp dụng nếu icon là một Text)
    padding: 5,          // Thêm padding để có khoảng cách xung quanh
    gap:5,
    width: 30,            // Chiều rộng của icon
    height: 30,           // Chiều cao của icon
    alignItems: "center", // Căn giữa icon theo chiều ngang
    justifyContent: "center", // Căn giữa icon theo chiều dọc
    size: 20,
},
separator: {
  height: 3,
  backgroundColor: "#ddd",
  marginVertical: 10,
},
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
});

export default PhoneBookFriend;
