import React, { useState, useRef, useMemo, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "react-native-image-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { useSelector, useDispatch } from "react-redux";
import { getAllMessagesByConversationId, sendMessageToUser } from "../store/slice/messageSlice";
import { convertHours } from "../utils/convertHours";

const { width, height } = Dimensions.get("window");
const audioRecorderPlayer = new AudioRecorderPlayer();

const SingleChatScreen = ({ navigation, route }) => {
    const { conversationId, userReceived } = route.params; // Nhận userId từ params
    console.log("conversationId", conversationId);

    const dispatch = useDispatch();
    const { messages } = useSelector((state) => state.message);
    const { user } = useSelector((state) => state.user);
    
    const messageMemo = useMemo(() => {
        if(!messages) return [];
        return messages;
    }, [messages]);
    console.log("messages", messageMemo);

    // Nhận navigation từ props
    const [messagesLocal, setMessages] = useState(messageMemo);
    console.log("messagesLocal", messagesLocal);
    const [inputText, setInputText] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [recording, setRecording] = useState(false);
    const audioPath = useRef(null);
    

    // Gọi hàm lấy tin nhắn từ slice khi component được mount
    useEffect(() => {
        setMessages(messageMemo); // Cập nhật lại messagesLocal khi messages thay đổi
    }, [messageMemo]);


    useEffect(() => {
        dispatch(getAllMessagesByConversationId(conversationId)); // Gọi hàm lấy tin nhắn từ slice
    }, [conversationId, dispatch]);

    const sendMessage = () => {
        if (inputText.trim() || imageUri) {
            const messageData = {
                senderId: user?.id,
                conversationId: conversationId,
                messageType: imageUri ? "FILE" : "TEXT",
                content: inputText,
                fileUrl: null,
                replyToMessageId: null,
            };
            dispatch(sendMessageToUser(messageData)); // Gọi hàm gửi tin nhắn từ slice
            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    senderId: user?.id,
                    conversationId: conversationId,
                    content: inputText,
                    messageType: imageUri ? "FILE" : "TEXT",
                    fileUrl: null,
                    replyToMessageId: null,
                    // audio: null,
                },
            ]);
            setInputText("");
            setImageUri(null);
        }
    };

    const pickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
            if (!response.didCancel && response.assets) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const startRecording = async () => {
        try {
            setRecording(true);
            const path =
                Platform.OS === "android" ? `${Date.now()}.mp3` : "sound.m4a";
            audioPath.current = path;
            await audioRecorderPlayer.startRecorder(path);
        } catch (error) {
            console.error("Lỗi khi ghi âm: ", error);
        }
    };

    const stopRecording = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setRecording(false);

            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    text: "",
                    image: null,
                    audio: result,
                },
            ]);
        } catch (error) {
            console.error("Lỗi khi dừng ghi âm: ", error);
        }
    };

    const playAudio = async (audioUri) => {
        try {
            await audioRecorderPlayer.startPlayer(audioUri);
        } catch (error) {
            console.error("Lỗi khi phát audio: ", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#D3CFCF", marginTop: StatusBar.currentHeight }}>
            {/* Header */}
            <View
                style={{
                    width: width,
                    height: height * 0.08,
                    backgroundColor: "#2196F3",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: width * 0.04,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={width * 0.07} color="white" />
                </TouchableOpacity>
                <Text
                    style={{
                        color: "white",
                        fontSize: width * 0.05,
                        fontWeight: "bold",
                    }}
                >
                   {userReceived?.display_name}
                </Text>
                <View style={{ flexDirection: "row", gap: width * 0.04 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("CallScreen")}>
                        <Icon name="call" size={width * 0.07} color="white"/>
                    </TouchableOpacity>
                    <Icon name="videocam" size={width * 0.07} color="white" />
                </View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("DetailSingleChatScreen")
                    }
                >
                    <Icon name="menu" size={width * 0.07} color="white" />
                </TouchableOpacity>
            </View>

            {/* Hiển thị tin nhắn */}
            <FlatList
                data={messagesLocal}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 10,
                            alignSelf: item.senderId === user.id ? "flex-end" : "flex-start",
                            backgroundColor: "#4CAF50",
                            borderRadius: 10,
                            margin: 5,
                        }}
                    >
                        
                        {item.messageType === "TEXT" ? (
                            <View>

                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: width * 0.04,
                                    }}
                                >
                                    {item.content}
                                    {/* thoi gian */}
                                    
                                </Text>
                            
                            </View>
                        ) : null}
                        {item.messageType === "FILE" ? (
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 10,
                                    marginTop: 5,
                                }}
                            />
                        ) : null}
                        {item.messageType === "AUDIO" ? (
                            <TouchableOpacity
                                onPress={() => playAudio(item.audio)}
                            >
                                <Icon
                                    name="play-circle"
                                    size={40}
                                    color="white"
                                />
                            </TouchableOpacity>
                        ) : null}
                        <Text style={{ fontSize: width * 0.03, color: "gray" }}>
                            {convertHours(item.timestamp)}    
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 10 }}
            />

            {/* Nhập tin nhắn */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "white",
                        paddingHorizontal: width * 0.04,
                        paddingVertical: 10,
                    }}
                >
                    <TouchableOpacity onPress={pickImage}>
                        <Icon
                            name="image"
                            size={width * 0.07}
                            color="gold"
                            style={{ marginRight: width * 0.02 }}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Tin nhắn..."
                        value={inputText}
                        onChangeText={setInputText}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: width * 0.05,
                            paddingHorizontal: width * 0.04,
                            fontSize: width * 0.04,
                        }}
                    />
                    {recording ? (
                        <TouchableOpacity onPress={stopRecording}>
                            <Icon
                                name="stop"
                                size={width * 0.07}
                                color="red"
                                style={{ marginLeft: width * 0.02 }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={startRecording}>
                            <Icon
                                name="mic"
                                size={width * 0.07}
                                color="black"
                                style={{ marginLeft: width * 0.02 }}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={sendMessage}>
                        <Icon
                            name="send"
                            size={width * 0.07}
                            color="blue"
                            style={{ marginLeft: width * 0.02 }}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SingleChatScreen;
