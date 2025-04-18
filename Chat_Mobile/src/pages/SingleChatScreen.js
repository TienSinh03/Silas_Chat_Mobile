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
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import IconF from "react-native-vector-icons/Feather";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "react-native-image-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllMessagesByConversationId,
  sendMessageToUser,
  setMessagesUpdate,
  addMessage,
  deleteMessage,
  loadDeletedMessageIdsAsync,
  deleteMessageForUserThunk,
} from "../store/slice/messageSlice";
import { convertHours } from "../utils/convertHours";
import ActionSheet from "react-native-actions-sheet";
import dayjs from "dayjs";

import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChat,
  sendMessageToWebSocket,
  recallMessageToWebSocket,
} from "../config/socket";

const { width, height } = Dimensions.get("window");
const audioRecorderPlayer = new AudioRecorderPlayer();

const SingleChatScreen = ({ navigation, route }) => {
  // tự động cuộn xuống cuối danh sách khi có tin nhắn mới
  const bottomRef = useRef(null);

  const actionSheetRef = useRef(null);

  const { conversationId, userReceived } = route.params; // Nhận userId từ params
  console.log("conversationId", conversationId);

  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.user);

  const messageMemo = useMemo(() => {
    if (!messages) return [];
    return messages;
  }, [messages]);
  console.log("messages", messageMemo.length);

  // Nhận navigation từ props
  const [messagesLocal, setMessages] = useState([]);
  // console.log("messagesLocal", messagesLocal);
  const [inputText, setInputText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [recording, setRecording] = useState(false);
  const audioPath = useRef(null);

  const [selectedMessage, setSelectedMessage] = useState(null);

  // Gọi hàm lấy tin nhắn từ slice khi component được mount
  useEffect(() => {
    setMessages(messageMemo); // Cập nhật lại messagesLocal khi messages thay đổi
  }, [messageMemo]);

  useEffect(() => {
    dispatch(loadDeletedMessageIdsAsync(conversationId)); // Gọi hàm lấy deletedMessageIds từ slice
    dispatch(getAllMessagesByConversationId(conversationId)); // Gọi hàm lấy tin nhắn từ slice
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollToEnd({ animated: true });
    }
  }, [messagesLocal]);

  const client = useRef(null);

  // Kết nối WebSocket
  useEffect(() => {
    connectWebSocket(() => {
      subscribeToChat(conversationId, (newMessage) => {
        console.log("Received message:", newMessage);
        dispatch(addMessage(newMessage));
      });
    });

    return () => {
      disconnectWebSocket(); // Ngắt kết nối khi component unmount
    };
  }, [conversationId]);

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

      sendMessageToWebSocket(messageData);

      // dispatch(sendMessageToUser(messageData)); // Gọi hàm gửi tin nhắn từ slice
      setMessages([...messages, messageData]);
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

  //Mở ActionSheet khi nhấn giữ tin nhắn
  const handleSelectMessage = (item) => {
    actionSheetRef.current?.show();
    setSelectedMessage(item);
    console.log("Selected message: ", item);
  };

  // xu ly set thời gian có thể xóa tin nhắn
  const canRecallMessage = (timestamp) => {
    const messageTime = dayjs(timestamp);
    const currentTime = dayjs();
    const diffInMinutes = currentTime.diff(messageTime, "minute");
    return diffInMinutes <= 5; // cho pheps thu hoi trong 5 phut
  };

  // xu ly thu hoi tin nhan
  const handleRecallMessage = () => {
    if (selectedMessage && canRecallMessage(selectedMessage.timestamp)) {
      const request = {
        messageId: selectedMessage.id,
        senderId: user?.id,
        conversationId: conversationId,
      };
      recallMessageToWebSocket(request);
      actionSheetRef.current?.hide();
    } else {
      alert("Không thể thu hồi tin nhắn này. Vui lòng thử lại sau 2 phút.");
      actionSheetRef.current?.hide();
    }
  };

  // xu ly xoa tin nhan ở phía mình
  const handleDeleteMessage = () => {
    if (selectedMessage) {
      dispatch(
        deleteMessageForUserThunk({
          messageId: selectedMessage.id,
          userId: user?.id,
        })
      );
      actionSheetRef.current?.hide();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#EBF4FF",
        marginTop: StatusBar.currentHeight,
      }}
    >
      {/* Header */}
      <View
        style={{
          width: width,
          height: height * 0.07,
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
            <Icon name="call" size={width * 0.07} color="white" />
          </TouchableOpacity>
          <Icon name="videocam" size={width * 0.07} color="white" />
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailSingleChatScreen", { userReceived })
          }
        >
          <Icon name="menu" size={width * 0.07} color="white" />
        </TouchableOpacity>
      </View>

      {/* Hiển thị tin nhắn */}
      <FlatList
        ref={bottomRef}
        data={messagesLocal}
        renderItem={({ item }) => (
          <View>
            {item?.senderId !== user?.id ? (
              <Image
                source={{ uri: userReceived?.avatar }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  marginTop: 5,
                }}
              />
            ) : null}

            <TouchableOpacity
              onLongPress={() => handleSelectMessage(item)}
              style={{
                padding: 10,
                alignSelf:
                  item?.senderId === user?.id ? "flex-end" : "flex-start",
                backgroundColor:
                  item?.senderId === user?.id ? "#8FC1FF" : "white",
                borderRadius: 10,
                margin: 5,
                borderWidth: 1,
                borderColor: "#52A0FF",
                marginLeft: item?.senderId !== user?.id ? 25 : 0,
              }}
            >
              {item?.messageType === "TEXT" ? (
                <View>
                  <Text
                    style={{
                      color: "black",
                      fontSize: width * 0.04,
                    }}
                  >
                    {item?.content}
                    {/* thoi gian */}
                  </Text>
                </View>
              ) : null}
              {item?.messageType === "FILE" ? (
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
              {item?.messageType === "AUDIO" ? (
                <TouchableOpacity onPress={() => playAudio(item.audio)}>
                  <Icon name="play-circle" size={40} color="white" />
                </TouchableOpacity>
              ) : null}
              <Text style={{ fontSize: width * 0.03, color: "gray" }}>
                {convertHours(item?.timestamp)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item?.id}
        initialNumToRender={20} // Số lượng tin nhắn ban đầu được render
        maxToRenderPerBatch={10} // Số lượng tin nhắn được render mỗi lần
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() =>
          bottomRef.current?.scrollToEnd({ animated: true })
        }
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

      {/* Action sheet */}
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 16 }}>Tùy chọn</Text>

          {/* Trả lời tin nhắn */}
          <TouchableOpacity
            onPress={() => {}}
            style={{
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <IconM
              name="message-reply-text-outline"
              size={20}
              color="#7C00FE"
            />

            <Text style={{ fontSize: 16, color: "#000" }}>Trả lời</Text>
          </TouchableOpacity>

          {/* Chuyển tiếp tin nhắn */}
          <TouchableOpacity
            onPress={() => {}}
            style={{
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <IconM name="reply-outline" size={20} color="#2196F3" />

            <Text style={{ fontSize: 16, color: "#000" }}>Chuyển tiếp</Text>
          </TouchableOpacity>

          {/* Thu hồi tin nhắn */}
          {selectedMessage?.senderId === user?.id &&
            !selectedMessage?.recalled && (
              <TouchableOpacity
                onPress={handleRecallMessage}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <IconM name="message-reply-text" size={20} color="#E85C0D" />

                <Text style={{ fontSize: 16, color: "#E85C0D" }}>Thu hồi</Text>
              </TouchableOpacity>
            )}

          {/* Xóa tin nhắn phía mình*/}
          <TouchableOpacity
            onPress={handleDeleteMessage}
            style={{
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Icon name="trash-outline" size={20} color="red" />
            <Text style={{ fontSize: 16, color: "red" }}>Xóa phía mình</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => actionSheetRef.current?.hide()}
            style={{ padding: 10 }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default SingleChatScreen;
