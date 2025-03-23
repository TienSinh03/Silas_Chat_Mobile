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


const dataRecent = [
    { id: "1", name: "Ngô Văn Toàn", lastSeen: "4 giờ trước", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "2", name: "Trần Minh Tiến", lastSeen: "9 giờ trước", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: "3", name: "Nguyễn Tấn Thái Dương", lastSeen: "1 ngày trước", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: "4", name: "Trần Hiển Vinh", lastSeen: "1 ngày trước", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: "5", name: "Đỗ Mạnh Hùng", lastSeen: "4 ngày trước", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: "6", name: "Tài", lastSeen: "5 ngày trước", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
];

const { width, height } = Dimensions.get("window");

const CreateGroupScreen = () => {
  const [phone, setPhone] = useState("");
  const [nameGroup, setNameGroup] = useState("");
  const [search, setSearch] = useState("");
    const [selectedContacts, setSelectedContacts] = useState([]);
  
  const isButtonEnabled = phone.trim() !== "";
  

  const toggleSelect = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredContacts = dataRecent.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <SafeAreaView style={styles.container}>


      <View style={{ backgroundColor: "white"}}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: 15, gap: 10}}>

            <TouchableOpacity style={{paddingHorizontal: 10}}>
                <IconA name="camera" size={30} color="black" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", gap:15}}>
                <TextInput
                    style={styles.nameGrInput}
                    placeholder="Đặt tên nhóm"
                    value={nameGroup}
                    onChange={(e) => setNameGroup(e.target.value)}

                />
                <TouchableOpacity>
                    <IconA name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={{ padding: 15}}>
            <View style={{ backgroundColor:'#E9EBED',flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10, padding:3, borderRadius:8}}>
                <IconA name="search1" size={24} color="#767A7F"  style={{paddingHorizontal: 10}}/>
                    <TextInput
                        placeholder="Tìm tên hoặc số điện thoại"
                        placeholderTextColor={"#767A7F"}
                        style={styles.search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
            </View>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: "white"}}>
        <Text style={{padding: 15, color: "gray"}}>Gần đây</Text>
        <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem} onPress={() => toggleSelect(item.id)}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.lastSeen}>{item.lastSeen}</Text>
                </View>
                <View style={selectedContacts.includes(item.id) ? styles.selectedCircle : styles.unselectedCircle} />
            </TouchableOpacity>
            )}
        />
        </View>

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
  nameGrInput: { fontSize:15,borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#D6D9DC", width: width * 0.7},
  search: {
    color: "#B8D9FF",
    paddingBottom: 5,
    fontSize: 16,
    height: width * 0.08,
    width: width * 0.5,
    borderRadius: 8,
    
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E9EBED",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  contactInfo: { flex: 1 },
  contactName: { color: "black", fontSize: 16 },
  lastSeen: { color: "gray", fontSize: 12 },
  selectedCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#006AF5" },
  unselectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
});
export default CreateGroupScreen;
