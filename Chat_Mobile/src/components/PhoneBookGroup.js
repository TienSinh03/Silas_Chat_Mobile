import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const messagesData = [
  {
    id: "5",
    name: "Nhóm CNM",
    message: "Làm tới đâu rồi",
    time: "09:22",
    avatar: "https://i.pravatar.cc/300?img=3",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
      { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
    ],
  },
  {
    id: "4",
    name: "Nhóm đẹp trai",
    message: "Nào đẹp trai vào đây",
    time: "14:15",
    avatar: "https://i.pravatar.cc/300?img=4",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
    ],
  },
  {
    id: "3",
    name: "Nhóm đẹp trai",
    message: "Nào đẹp trai vào đây",
    time: "14:15",
    avatar: "https://i.pravatar.cc/300?img=4",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
    ],
  },
  {
    id: "2",
    name: "Nhóm đẹp trai",
    message: "Nào đẹp trai vào đây",
    time: "14:15",
    avatar: "https://i.pravatar.cc/300?img=4",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
    ],
  },
  {
    id: "16",
    name: "Nhóm đẹp trai",
    message: "Nào đẹp trai vào đây",
    time: "14:15",
    avatar: "https://i.pravatar.cc/300?img=4",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
    ],
  },
];

const GroupItem = ({ item }) => (
  <TouchableOpacity style={styles.groupItem}>
    <View style={styles.groupAvatars}>
      {item.members.slice(0, 4).map((member, index) => (
        <Image key={index} source={{ uri: member.avatar }} style={styles.groupAvatar} />
      ))}
    </View>

    <View style={styles.groupContent}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupMessage}>{item.message}</Text>
    </View>

    <Text style={styles.groupTime}>{item.time}</Text>
  </TouchableOpacity>
);

const GroupList = () => {
  return (
    <View style={styles.container}>
      {/* Nút tạo nhóm mới */}
      <TouchableOpacity style={styles.createGroupButton}>
        <Ionicons name="person-add-outline" size={24} color="blue" style={styles.personadd}/>
        <Text style={styles.createGroupText}>Tạo nhóm mới</Text>
      </TouchableOpacity>

      {/* Thanh phân cách */}
      <View style={styles.separator} />

      {/* Header danh sách nhóm */}
      <View style={styles.groupListHeader}>
        <Text style={styles.groupListTitle}>Nhóm đang tham gia ({messagesData.length})</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color="gray" />
          <Text style={styles.sortText}>Sắp xếp</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách nhóm */}
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroupItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  createGroupButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    // backgroundColor: "#f0f0f0",

  },
  personadd: {
    borderColor: "#000",  // Màu viền
    borderRadius: 50,     // Bo góc
    backgroundColor: "#77e1ff", // Màu nền
    color: "#FFFFFF",     // Màu chữ (chỉ áp dụng nếu icon là một Text)
    gap:15,
    padding: 15,
    alignItems: "center", // Căn giữa icon theo chiều ngang
    justifyContent: "center", // Căn giữa icon theo chiều dọc
    size: 20,

  },
  createGroupText: {
    marginLeft: 10,
    color: "#000000",
    fontSize: 16,
  },
  separator: {
    height: 3,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  groupListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  groupListTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    marginLeft: 5,
    color: "gray",
  },
  groupItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  groupAvatars: {
    width: 53,
    height: 53,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  groupAvatar: {
    width: 21,
    height: 21,
    borderRadius: 12,
    margin: 1,
  },
  groupContent: {
    flex: 1,
    marginLeft: 13,
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 17,
  },
  groupMessage: {
    color: "gray",
    fontSize: 15,
  },
  groupTime: {
    color: "gray",
    fontSize: 13,
  },
});

export default GroupList;
