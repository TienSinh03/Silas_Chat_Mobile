import React, { useState } from "react";
import { Modal } from "react-native";

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  
} from "react-native";
import Header from "../../components/Header";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DiaryMy = () => {
  const posts = [
    {
      idPost: 1,
      idUser: 101,
      name: "Trần Lê Minh Thư",
      content:
        "[Quận 2] - Trung tâm Hội nghị & Tiệc cưới quy mô lớn cần tuyển các vị trí:\n1️⃣ Marketing Manager (F&B)\n2️⃣ Kế toán (ưu tiên TSCD)",
      time: "6 phút trước",
      avatar: "https://i.imgur.com/o8bd7yT_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    },
    {
      idPost: 2,
      idUser: 102,
      name: "Linh Nguyễn",
      content: "Hôm nay trời đẹp quá 🌤️",
      time: "12 phút trước",
      avatar: "https://i.imgur.com/neU3XIs_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    },
    {
      idPost: 3,
      idUser: 103,
      name: "Nguyễn Văn Tiến",
      content: "Chúc mọi người một ngày tốt lành! ☀️",
      time: "20 phút trước",
      avatar: "https://i.imgur.com/avy5i4j_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    },
    {
      idPost: 4,
      idUser: 104,
      name: "Nguyễn Thị Mai",
      content: "Mới mua được chiếc xe mới 🚗",
      time: "30 phút trước",
      avatar: "https://i.imgur.com/QlkmTmA_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    },
    {
      idPost: 5,
      idUser: 105,
      name: "Trần Văn An",
      content: "Đi du lịch Đà Nẵng thật tuyệt vời! 🏖️",
      time: "1 giờ trước",
      avatar: "https://i.imgur.com/QlkmTmA_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    },
  ];
const [modalVisible, setModalVisible] = useState(false);
const [selectedPost, setSelectedPost] = useState(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <Header iconRight="user" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Post Box */}
          <View style={styles.postBox}>
            <Image
              source={require('../../../assets/image1.jpg')}
              style={styles.avatar}
            />
            <TextInput
              placeholder="Hôm nay bạn thế nào?"
              style={styles.input}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} >
              <Text style={styles.actionText}>📷 Ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} >
              <Text style={styles.actionText}>🎥 Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} >
              <Text style={styles.actionText}>📁 Album</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} >
              <Text style={styles.actionText}>🕓 Kỷ niệm</Text>
            </TouchableOpacity>
          </View>

          {/* Stories */}
          <ScrollView horizontal style={styles.stories} showsHorizontalScrollIndicator={false}>
            {/* Story đầu tiên: Tạo mới */}
            <TouchableOpacity style={styles.storyList}>
              <Image
                source={require('../../../assets/image1.jpg')}
                style={styles.avatarList}
              />
              <Text style={styles.storyTextList}>Tạo mới</Text>
            </TouchableOpacity>

            {/* Các story từ mảng posts */}
            {posts.map((item) => (
              <TouchableOpacity key={item.idPost} style={styles.storyList}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.avatarList}
                />
                <Text style={styles.storyTextList}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>


          {/* Posts from array */}
          {posts.map((post) => (
            <View key={post.idPost} style={styles.post}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.avatar }}
                  style={styles.avatarSmall}
                />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={styles.postName}>{post.name}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                  <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={15} color="black" />
                  </TouchableOpacity>          
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Example of accessing idPost and idUser */}
              <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                Post ID: {post.idPost} | User ID: {post.idUser}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity style={styles.likeContainer}>
                  <Ionicons name="heart-outline" size={20} color="#000" />
                  <Text style={styles.likeText}>Thích</Text>
                  <View style={styles.divider} />
                  <Ionicons name="heart" size={20} color="red" />
                  <Text style={styles.likeCount}>2</Text>
                </TouchableOpacity>

              <TouchableOpacity
                style={styles.commentContainer}
                onPress={() => {
                  setSelectedPost(post);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="chatbox-ellipses-outline" size={20} color="#000" />
              </TouchableOpacity>

              </View>

              
            </View>
          ))}
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Bình luận bài viết</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>
                  Bài viết từ: {selectedPost?.name}
                </Text>
                <TextInput
                  placeholder="Nhập bình luận..."
                  style={styles.commentInput}
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.sendButtonText}>Gửi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  postBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  actionBtn: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
  },
  stories: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  story: {
    width: 70,
    height: 100,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyText: {
    fontSize: 12,
    textAlign: 'center',
  },


  storyList: {
    width: 100,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end', 
    alignItems: 'center',
    position: 'relative',
    marginRight: 10,
  },
  avatarList: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,                     // độ mờ
    zIndex: 0,
  },

  storyTextList: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    zIndex: 1,
  },





  post: {
    backgroundColor: '#fff',
    // borderRadius: 10,
    padding: 10,
    // marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    // height: 300
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarSmall: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginRight: 10,
  },
  postName: {
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: 'gray',
  },
  postContent: {
    fontSize: 14,
    marginTop: 6,
  },

  // Like and Comment

    likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  likeText: {
    marginLeft: 5,
    marginRight: 10,
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
  },
  commentContainer: {
    borderRadius: 20,
    padding: 6,
    backgroundColor: '#f2f2f2',
  },


  // modal

modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-end',  // <-- sửa chỗ này
  alignItems: 'center',
},

modalContent: {
  width: '100%',
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  alignItems: 'stretch',
  
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
commentInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  minHeight: 80,
  marginBottom: 10,
  textAlignVertical: 'top',
},
sendButton: {
  backgroundColor: '#3b82f6',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
},
sendButtonText: {
  color: 'white',
  fontWeight: 'bold',
}

});

export default DiaryMy;
