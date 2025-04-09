import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";


const messagesData = [
    {
        id: "1",
        name: "Nguyễn Văn A",
        message: "Bạn có khỏe không?",
        time: "10:30",
        avatar: "https://i.pravatar.cc/300?img=1",
        category: "priority",
        isGroup: false,
    },
    {
        id: "2",
        name: "Trần Văn B",
        message: "Đi nhậu không?",
        time: "08:15",
        avatar: "https://i.pravatar.cc/300?img=2",
        category: "other",
        isGroup: false,
    },
    {
        id: "3",
        name: "Đinh Văn C",
        message: "Làm gì đấy",
        time: "21:30",
        avatar: "https://i.pravatar.cc/300?img=1",
        category: "priority",
        isGroup: false,
    },
    {
        id: "4",
        name: "Phan Văn Teo",
        message: "Hello",
        time: "07:15",
        avatar: "https://i.pravatar.cc/300?img=2",
        category: "priority",
        isGroup: false,
    },

    {
        id: "5",
        name: "Nhóm CNM",
        message: "Làm tới đâu rồi",
        time: "09:22",
        avatar: "https://i.pravatar.cc/300?img=3",
        category: "other",
        isGroup: true,
        members: [
            { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
            { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
            { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
        ],
    },
    {
        id: "6",
        name: "Nhom dep traiz",
        message: "Nào đẹp trai vào đây",
        time: "14:15",
        avatar: "https://i.pravatar.cc/300?img=4",
        category: "priority",
        isGroup: true,
        members: [
            { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
            { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
            { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
        ],
    },
];

const ConservationItem = ({ item}) => {
    const navigation = useNavigation();

    const handleChooseChat = (item) => {
        if (item.isGroup) {
            navigation.navigate("GroupChatScreen", { item });
        } else {
            navigation.navigate("SingleChatScreen", { item });
        }
    };
    return (

        <TouchableOpacity key={item.id} style={styles.conservationItem} onPress={() => handleChooseChat(item)}>
            {/* Avata group và cá nhân */}
            {item.isGroup ? (
                <View style={styles.groupAvatars}>
                    {item.members.slice(0, 4).map((member, index) => (
                        <Image
                            key={index}
                            source={{ uri: member.avatar }}
                            style={styles.groupAvatar}
                        />
                    ))}
                </View>
            ) : (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            )}
    
            {/* Nội dung */}
            <View style={styles.conservationContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message}>{item.message}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    )
};
    
    

const ConservationList = ({ category}) => {
    const filteredMessages = messagesData.filter(
        (item) => item.category === category
    );
    
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={filteredMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ConservationItem item={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    conservationItem: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        alignItems: "center",
    },
    avatar: {
        width: 53,
        height: 53,
        borderRadius: 25,
    },
    conservationContent: {
        flex: 1,
        marginLeft: 13,
    },
    name: {
        fontWeight: "bold",
        fontSize: 17,
    },
    message: {
        color: "gray",
        fontSize: 15,
    },
    time: {
        color: "gray",
        fontSize: 13,
    },
    members: {
        fontSize: 12,
        color: "gray",
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
});

export default ConservationList;
