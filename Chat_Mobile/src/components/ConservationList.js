import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getAllConversationsByUserId } from "../store/slice/conversationSlice";
import { getProfile } from "../store/slice/userSlice";
import { updateUserProfileSuccess } from '../store/slice/userSlice';

import { connectWebSocket, disconnectWebSocket } from "../config/socket";
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

const ConservationItem = ({ item , user}) => {
    const navigation = useNavigation();
    
    console.log("Item: ", item);
    console.log("User con: ", user);
   
    const handleChooseChat = (item) => {
        if (item.is_group) {
        
            navigation.navigate("GroupChatScreen", { conversationId: item?.id });
        } else {
            const userReceived = item.members.find((member) => member.id !== user?.id);
            navigation.navigate("SingleChatScreen", { conversationId: item.id, userReceived: userReceived });
        }
    };
    return (

        <TouchableOpacity key={item.id} style={styles.conservationItem} onPress={() => handleChooseChat(item)}>
            {/* Avata group và cá nhân */}
            {item.is_group ? (
                <View style={styles.groupAvatars}>
                    {item.members.slice(0, 4).map((member, index) => (
                        <Image
                            key={index}
                            source={{ uri: member.avatar || "https://i.pravatar.cc/300?img=4"}}
                            style={styles.groupAvatar}
                        />
                    ))}
                </View>
            ) : (
                <Image source={{ uri: item.members.find((member) => member.id !== user?.id)?.avatar || "https://i.pravatar.cc/300?img=4"}} style={styles.avatar} />
            )}
    
            {/* Nội dung */}
            <View style={styles.conservationContent}>
                <Text style={styles.name}>{!item.is_group ? item.members.find((member) => member.id !== user.id)?.display_name  : item.name}</Text>
                <Text style={styles.message}>{item.message}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    )
};
    
    

const ConservationList = ({ category}) => {

    const dispatch = useDispatch();
    const { conversations } = useSelector((state) => state.conversation);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        dispatch(getProfile());
    },[dispatch]);

    const userProfile = useSelector(state => state.user.user);
    
        const user = useMemo(() => {
            if(userProfile === null) return null;
                return userProfile || null;
        }, [userProfile]);

    // console.log("User Profile: ", userProfile);
    // console.log("User: ", user);


    const conversationsMemo = useMemo(() => {
        if(!conversations) return [];
        return conversations;
    }, [conversations]);

    // console.log("Conversations Memo: ", conversationsMemo);

    React.useEffect(() => {
        const fetchConversations = async () => {
            try {
                await dispatch(getAllConversationsByUserId()).unwrap();
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch conversations: ", error);
            }
        };
        fetchConversations();
    }, [dispatch]);


     React.useEffect(() => {
                if(!user?.id) return;
                console.log("user", user.id);
                
                // function để xử lý khi nhận được tin nhắn từ WebSocket
                const handleMessageReceived = (updatedProfile) => {
                    console.log("Message received:", updatedProfile);
                    
                    // Xử lý thông điệp nhận được từ WebSocket
                    dispatch(updateUserProfileSuccess(updatedProfile));
                };
        
                const client = connectWebSocket(user?.id, handleMessageReceived);
        
                    
                return () => {
                    disconnectWebSocket(client); // Ngắt kết nối khi component unmount
                }
        },[user?.id, dispatch]);

   

    const filteredMessages = conversationsMemo.filter(
        (item) => item.category === category
    );
    
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={conversationsMemo}
                renderItem={({ item }) => <ConservationItem item={item} user={user} />} 
                keyExtractor={(item) => item.id}
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
