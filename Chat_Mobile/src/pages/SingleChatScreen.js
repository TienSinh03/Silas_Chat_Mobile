import React, { useState, useRef } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "react-native-image-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

const { width, height } = Dimensions.get("window");
const audioRecorderPlayer = new AudioRecorderPlayer();

const SingleChatScreen = ({ navigation }) => {
    // Nhận navigation từ props
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [recording, setRecording] = useState(false);
    const audioPath = useRef(null);

    const sendMessage = () => {
        if (inputText.trim() || imageUri) {
            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    text: inputText,
                    image: imageUri,
                    audio: null,
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
        <View style={{ flex: 1, backgroundColor: "#D3CFCF" }}>
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
                    Thái Dương
                </Text>
                <View style={{ flexDirection: "row", gap: width * 0.04 }}>
                    <Icon name="call" size={width * 0.07} color="white" />
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
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 10,
                            alignSelf: "flex-end",
                            backgroundColor: "#4CAF50",
                            borderRadius: 10,
                            margin: 5,
                        }}
                    >
                        {item.text ? (
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: width * 0.04,
                                }}
                            >
                                {item.text}
                            </Text>
                        ) : null}
                        {item.image ? (
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
                        {item.audio ? (
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
                    </View>
                )}
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
