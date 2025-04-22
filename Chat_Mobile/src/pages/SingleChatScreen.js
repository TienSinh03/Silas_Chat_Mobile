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
  Animated,
  TouchableNativeFeedback,
  Linking,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import IconF from "react-native-vector-icons/Feather";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import IconE from "react-native-vector-icons/Entypo";
import IconF5 from "react-native-vector-icons/FontAwesome5";
import IconA from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import * as  DocumentPicker from "expo-document-picker";
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
  deleteMessageToWebSocket,
  sendFileToWebSocket,
  pinMessageToWebSocket,
  unpinMessageToWebSocket,
} from "../config/socket";

import { sendReq, checkFriendStatus } from "../store/slice/friendSlice";

import { uploadFile } from "../api/chatApi";
import Loading from "../components/Loading";

const { width, height } = Dimensions.get("window");
const audioRecorderPlayer = new AudioRecorderPlayer();
import { getFileIcon } from "../utils/FormatIconFile"; // Import hàm getFileIcon từ file FormatIconFile.js

const SingleChatScreen = ({ navigation, route }) => {
  // tự động cuộn xuống cuối danh sách khi có tin nhắn mới
  const bottomRef = useRef(null);

  const actionSheetRef = useRef(null);

  const { conversationId, userReceived } = route.params; // Nhận userId từ params
  console.log("conversationId", conversationId);

  // state để điều khiển hiển thị thanh công cụ
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const sideAnimation = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.user);

  // check friend
  const [isFriend, setIsFriend] = useState(false); // Track friend status


  const messageMemo = useMemo(() => {
    if (!messages) return [];
    return messages;
  }, [messages]);
  console.log("messages", messageMemo.length);

  const [loading, setLoading] = useState(false);
  console.log("loading", loading);

  // Nhận navigation từ props
  const [messagesLocal, setMessages] = useState([]);
  // console.log("messagesLocal", messagesLocal);
  const [inputText, setInputText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [recording, setRecording] = useState(false);
  const audioPath = useRef(null);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);

  // Gọi hàm lấy tin nhắn từ slice khi component được mount
  useEffect(() => {
    setMessages(messageMemo); // Cập nhật lại messagesLocal khi messages thay đổi
  }, [messageMemo]);

  useEffect(() => {
    dispatch(getAllMessagesByConversationId(conversationId)); // Gọi hàm lấy tin nhắn từ slice
  }, [conversationId, dispatch]);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollToEnd({ animated: true });
    }
  }, [messagesLocal]);



  // Kết nối WebSocket
  useEffect(() => {
    connectWebSocket(() => {
      subscribeToChat(conversationId, (newMessage) => {
        console.log("Received message:", newMessage);
        dispatch(addMessage(newMessage));

        
        if (newMessage.pinned) {
          setPinnedMessages((prev) =>
            prev.find((msg) => msg.id === newMessage.id)
              ? prev
              : [...prev, newMessage]
          );
        } 
        else {
          setPinnedMessages((prev) =>
            prev.filter((msg) => msg.id !== newMessage.id)
          );
        }
      });
    });
    

    return () => {
      disconnectWebSocket(); // Ngắt kết nối khi component unmount
    };
  }, [conversationId], dispatch);

  // Lọc tin nhắn đã xóa của user hiện tại
  useEffect(() => {
    if (messageMemo) {

      // Lọc các tin nhắn để không hiển thị những tin nhắn đã bị xóa của user hiện tại
      const filteredMessages = messageMemo.filter((msg) =>
        // Nếu deletedByUserIds tồn tại và chứa ID của user hiện tại thì không hiển thị tin nhắn này
        !(msg.deletedByUserIds && msg.deletedByUserIds.includes(user?.id))
      );
      // console.log("filteredMessages: ", filteredMessages);
      setMessages(filteredMessages); // Cập nhật localMessages từ messagesMemo
      setPinnedMessages(filteredMessages.filter((msg) => msg.pinned));
      console.log("filteredMessages: ", filteredMessages);

    }
  }, [messageMemo, user?.id]);

  // Hien thi thanh toolbar
  const togleToolbar = () => {
    Animated.timing(sideAnimation, {
      toValue: toolbarVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false // Chuyển đổi giá trị animation
    }).start();
    setToolbarVisible(!toolbarVisible);
  }

  // height của thanh công cụ
  const toolbarHeight = sideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150] // Chiều cao của thanh công cụ
  })

  // Ẩn thanh toolbar nếu đang hiển thị
  const hideToolbar = () => {
    if (toolbarVisible) {
      Animated.timing(sideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
      setToolbarVisible(false);
    }
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const messageData = {
        senderId: user?.id,
        conversationId: conversationId,
        messageType: "TEXT",
        content: inputText,
        fileUrl: null,
        replyToMessageId: null,
      };
      console.log("messageData: ", messageData);

      sendMessageToWebSocket(messageData);

      // dispatch(sendMessageToUser(messageData)); // Gọi hàm gửi tin nhắn từ slice
      setMessages([...messages, messageData]);
      setInputText("");
      setImageUri(null);
    }
  };

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      const imageUri = {
        uri: img.uri,
        name: img.fileName || "image.jpg",
        type: "image/jpeg",
      };
      setImageUri(imageUri);

      handleSendImage(imageUri);
    }
  };


  //send image;
  const handleSendImage = async (imageUri) => {
    setLoading(true); // Bật loading
    try {
      const request = {
        senderId: user?.id,
        conversationId: conversationId,
        content: "",
        messageType: "IMAGE",
      };

      const formData = new FormData();
      formData.append("request", JSON.stringify(request), "application/json");

      if (imageUri) {
        formData.append("anh", imageUri);
        console.log("image :", imageUri);
      }

      const response = await uploadFile(formData);
      console.log("response uploadFile: ", response);

      request.fileUrl = response?.response?.fileUrl;
      sendMessageToWebSocket(request);
    } catch (error) {
      console.error("Lỗi khi gửi ảnh: ", error);
      // Có thể thêm thông báo lỗi cho người dùng
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // chon tài liệu từ thư viện
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const documentUri = {
        uri: asset.uri,
        name: asset.name || "document.pdf",
        type: asset.mimeType || "application/octet-stream",
      };
      console.log("documentUri: ", documentUri);
      setImageUri(documentUri);

      handleSendFile(documentUri);
    }
  }

  const handleSendFile = async (imageUri) => {
    setLoading(true); // Bật loading
    console.log("imageUri: ", imageUri?.name);
    try {
      const request = {
        senderId: user?.id,
        conversationId: conversationId,
        content: imageUri?.name || "Tài liệu",
        messageType: "FILE",
      };

      const formData = new FormData();
      formData.append("request", JSON.stringify(request), "application/json");

      if (imageUri) {
        formData.append("anh", imageUri);
        console.log("file :", imageUri);
      }

      const response = await uploadFile(formData);
      // console.log("response uploadFile: ", response);

      request.fileUrl = response?.response?.fileUrl;
      sendMessageToWebSocket(request);
    } catch (error) {
      console.error("Lỗi khi gửi file: ", error);
      // Có thể thêm thông báo lỗi cho người dùng
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // click vào tin nhắn để mở tài liệu
  const openFile = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Không thể mở file');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở file: ' + error.message);
    }
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
        fileUrl: null,
        messageType: "TEXT",
      };
      recallMessageToWebSocket(request);
      actionSheetRef.current?.hide();
    } else {
      alert("Không thể thu hồi tin nhắn này sau 2 phút.");
      actionSheetRef.current?.hide();
    }
  };

  // xu ly xoa tin nhan ở phía mình
  const handleDeleteMessage = () => {
    if (selectedMessage) {
      // dispatch(
      //   deleteMessageForUserThunk({
      //     messageId: selectedMessage?.id,
      //     userId: user?.id,
      //   })
      // );

      deleteMessageToWebSocket({
        messageId: selectedMessage?.id,
        userId: user?.id,
      });

      actionSheetRef.current?.hide();
    }
  };

  // Kiểm tra trạng thái bạn bè
  useEffect(() => {
    const checkIsFriend = async () => {
      try {
        const response = await dispatch(checkFriendStatus(userReceived?.id)).unwrap();
        setIsFriend(response); // Cập nhật trạng thái bạn bè
        console.log("Trạng thái bạn bè:", response);
      } catch (error) {
        console.log(`Lỗi khi kiểm tra trạng thái bạn bè cho:`, error);
        setIsFriend(false); // Nếu có lỗi, coi như không phải bạn bè
      }

    };

    if (userReceived?.id) {
      checkIsFriend();
    }
  }, [userReceived?.id, dispatch]);

  // Gửi lời mời kết bạn
  const handleSendRequest = async (friendId) => {

    try {
      const response = await dispatch(sendReq(friendId)).unwrap();
      console.log("response", response);
      if (response.status === "SUCCESS") {
        console.log("Lời mời kết bạn đã được gửi thành công.");

        Alert.alert(
          "Thông báo",
          "Lời mời kết bạn đã được gửi thành công.",
          [{ text: "OK" }],
          { cancelable: false }
        );

      } else {
        console.log("Không thể gửi lời mời kết bạn.");
      }
    } catch (error) {
      console.log("Lỗi khi gửi lời mời kết bạn:", error);
      Alert.alert(
        "Thông báo",
        error || "Không thể gửi lời mời kết bạn.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  }

  // xử lý pin tin nhắn
  const handlePinMessage = async () => {
    if (selectedMessage) {
      try {
        await pinMessageToWebSocket({
          messageId: selectedMessage?.id,
          userId: user?.id,
        });
        Alert.alert("Thành công", "Tin nhắn đã được ghim");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể ghim tin nhắn: " + error.message);
      }
      actionSheetRef.current?.hide();
    }
  };

  // xử lý unpin tin nhắn
  const handleUnpinMessage = async () => {
    if (selectedMessage) {
      try {
        await unpinMessageToWebSocket({
          messageId: selectedMessage?.id,
          userId: user?.id,
        });
        Alert.alert("Thành công", "Tin nhắn đã được bỏ ghim");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể bỏ ghim tin nhắn: " + error.message);
      }
      actionSheetRef.current?.hide();
    }
  };

  const handlePinButtonPress = () => {
    if (selectedMessage?.pinned) {
      handleUnpinMessage();
    } else {
      handlePinMessage();
    }
  };


  return (

    <View style={{ flex: 1 }}>
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: width * 0.04 }}>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={width * 0.07} color="white" />
            </TouchableOpacity>
            <View>

              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.05,
                  fontWeight: "bold",
                }}
              >
                {userReceived?.display_name}
              </Text>
              <Text style={{ color: "white", fontSize: width * 0.03 }}>
                {!isFriend ? "Người lạ" : "Bạn bè"}
              </Text>

            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: width * 0.04 }}>

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
        </View>

        {/* Check friend */}
        {conversationId && !isFriend ? (

          <TouchableOpacity style={{ fontSize: 12, backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10 }} onPress={() => { handleSendRequest(userReceived?.id) }}>
            <Text style={{ color: "#000", textAlign: 'center', fontSize: 18 }}> <IconA size={24} name="adduser" ></IconA> Kết bạn</Text>
          </TouchableOpacity>

        ) : (<View></View>)}

        {/* xử lý hiện ghim tin nhắn hiện tin nhắn và khi chọn nhảy đến tin nhắn và unpin */}
        {pinnedMessages.length > 0 && (
          <View style={{ padding: 10, backgroundColor: "#FFF3E0", borderRadius: 5, margin: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
              Tin nhắn đã ghim
            </Text>
            {pinnedMessages.map((msg) => (
              <TouchableOpacity
                key={msg.id}
                onPress={() => {
                  bottomRef.current.scrollToItem({ item: msg, animated: true });
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                }}
              >
                <Text style={{ flex: 1, fontSize: 14, color: "#000" }}>
                  {msg.messageType === "TEXT"
                    ? msg.content
                    : msg.messageType === "IMAGE"
                    ? "[Hình ảnh]"
                    : "[Tệp]"}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    unpinMessageToWebSocket({
                      messageId: msg.id,
                      userId: user?.id,
                    });
                  }}
                >
                  <IconM name="pin-off" size={20} color="#FF9800" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
                {item?.messageType === "IMAGE" || item?.messageType === "GIF" ? (
                  <Image
                    source={{ uri: item?.fileUrl }}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 10,
                      marginTop: 5,

                    }}
                    resizeMode="contain"
                  />
                ) : null}

                {item?.messageType === "FILE" ? (
                  <Text
                    style={{
                      color: "black",
                      fontSize: width * 0.04,
                    }}
                  >
                    {item?.fileUrl ? (
                      <TouchableOpacity onPress={() => openFile(item?.fileUrl)} style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconF5 name={getFileIcon(item?.content)} size={30} color="black" style={{ marginRight: 5, paddingVertical: 5, paddingHorizontal: 10 }} />
                        <View>

                          <Text style={{ color: "", fontSize: width * 0.04, paddingRight: 10 }}>{item?.content}</Text>
                          <Text style={{ fontSize: width * 0.03, color: "blue", paddingRight: 10, paddingTop: 2 }}>Tải về để xem lâu dài </Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </Text>
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
          getItemLayout={(data, index) => ({
            length: 100, // Giả sử chiều cao trung bình của item
            offset: 100 * index,
            index,
          })}
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
            <TouchableOpacity onPress={togleToolbar}>
              <IconE
                name="dots-three-horizontal"
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
              onPress={() => { }}
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
              onPress={() => {
                navigation.navigate("MessageForwarding", { forwardedMessage: selectedMessage });
                actionSheetRef.current?.hide();
              }}
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

            {/* Ghim tin nhắn */}

            {selectedMessage?.pinned ? (
              <TouchableOpacity
                onPress={handlePinButtonPress}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <IconM name="pin-off" size={20} color="#FF9800" />
                <Text style={{ fontSize: 16, color: "#000" }}>Bỏ ghim</Text>
              </TouchableOpacity>
            ) : null
            }
            <TouchableOpacity
              onPress={handlePinButtonPress}
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <IconM
                name={selectedMessage?.pinned ? "pin-off" : "pin"}
                size={20}
                color="#FF9800"
              />
              <Text style={{ fontSize: 16, color: "#000" }}>
                {selectedMessage?.pinned ? "Bỏ ghim" : "Ghim"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => actionSheetRef.current?.hide()}
              style={{ padding: 10 }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>

        {/* Thanh công cụ */}
        {/* <TouchableNativeFeedback onPress={hideToolbar}>
      </TouchableNativeFeedback>  */}
        <Animated.View style={{ height: toolbarHeight, backgroundColor: "#fff", overflow: 'hidden', borderTopWidth: 1, borderTopColor: "#ccc" }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingHorizontal: 20, paddingTop: 15, gap: 30 }}>
            <TouchableOpacity onPress={pickImage} style={{ alignItems: "center" }}>
              <Icon name="image" size={28} color="#f66" />
              <Text style={{ fontSize: 14, color: "#000", paddingTop: 5 }}>Hình ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickDocument} style={{ alignItems: "center" }}>
              <Icon name="document-text" size={28} color="#36f" />
              <Text style={{ fontSize: 14, color: "#000", paddingTop: 5 }}>Tài liệu</Text>
            </TouchableOpacity>

          </View>
        </Animated.View>

        {/* Hiển thị thanh trạng thái */}
      </View>
      <Loading isLoading={loading} />
    </View>
  );
};

export default SingleChatScreen;
