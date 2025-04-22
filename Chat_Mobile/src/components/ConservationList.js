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
import { setSelectedConversationId } from "../store/slice/conversationSlice";

import { connectWebSocket, disconnectWebSocket } from "../config/socket";


const ConservationItem = ({ item , user, dispatch}) => {
    const navigation = useNavigation();
    
    // console.log("Item: ", item);
    // console.log("User con: ", user);
    // dispatch(setSelectedConversationId(item.id));
   
    const handleChooseChat = (item) => {
        if (item?.is_group) {
        
            navigation.navigate("GroupChatScreen", { conversation: item});
        } else {
            const userReceived = item?.members.find((member) => member?.id !== user?.id);
            navigation.navigate("SingleChatScreen", { conversationId: item?.id, userReceived: userReceived });
        }
    };
    return (

        <TouchableOpacity key={item?.id} style={styles.conservationItem} onPress={() => handleChooseChat(item)}>
            {/* Avata group và cá nhân */}
            {item?.is_group ? (
                <View style={styles.groupAvatars}>
                    {item?.members.slice(0, 4).map((member, index) => (
                        <Image
                            key={index}
                            source={{ uri: member?.avatar || "https://i.pravatar.cc/300?img=4"}}
                            style={styles.groupAvatar}
                        />
                    ))}
                </View>
            ) : (
                <Image source={{ uri: item?.members.find((member) => member?.id !== user?.id)?.avatar || "https://i.pravatar.cc/300?img=4"}} style={styles.avatar} />
            )}
    
            {/* Nội dung */}
            <View style={styles.conservationContent}>
                <Text style={styles.name}>{!item?.is_group ? item?.members.find((member) => member?.id !== user?.id)?.display_name  : item?.name}</Text>
                <Text style={styles.message}>{item?.message}</Text>
            </View>
            <Text style={styles.time}>{item?.time}</Text>
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

    const userProfile = useSelector(state => state.user?.user);
    
        const user = useMemo(() => {
            if(!userProfile) return null;
            return userProfile;
        }, [userProfile]);

    // console.log("User Profile: ", userProfile);
    // console.log("User: ", user);


    const conversationsMemo = useMemo(() => {
        if(!conversations) return [];
        return conversations;
    }, [conversations]);


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


    //  React.useEffect(() => {
    //     if(!user?.id) return;
    //     console.log("user", user.id);
                
    //     // function để xử lý khi nhận được tin nhắn từ WebSocket
    //     const handleMessageReceived = (updatedProfile) => {
    //         console.log("Message received:", updatedProfile);
                    
    //         // Xử lý thông điệp nhận được từ WebSocket
    //          dispatch(updateUserProfileSuccess(updatedProfile));
    //     };
        
    //     const client = connectWebSocket(user?.id, handleMessageReceived);
        
                    
    //     return () => {
    //         disconnectWebSocket(client); // Ngắt kết nối khi component unmount
    //     }
    // },[user?.id, dispatch]);

   

    // const filteredMessages = conversationsMemo.filter(
    //     (item) => item.category === category
    // );
    
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={conversationsMemo}
                renderItem={({ item }) => <ConservationItem item={item} user={user} dispatch={dispatch}/>} 
                keyExtractor={(item) => item?.id}
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
