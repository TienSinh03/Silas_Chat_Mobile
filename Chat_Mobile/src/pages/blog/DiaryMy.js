import React from "react";
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

const DiaryMy = () => {
  const posts = [
    {
      idPost: 1,
      idUser: 101,
      name: "Trần Lê Minh Thư",
      content:
        "[Quận 2] - Trung tâm Hội nghị & Tiệc cưới quy mô lớn cần tuyển các vị trí:\n1️⃣ Marketing Manager (F&B)\n2️⃣ Kế toán (ưu tiên TSCD)",
      time: "6 phút trước",
      avatar: "https://placekitten.com/200/200",
    },
    {
      idPost: 2,
      idUser: 102,
      name: "Linh Nguyễn",
      content: "Hôm nay trời đẹp quá 🌤️",
      time: "12 phút trước",
      avatar: "https://placekitten.com/201/201",
    },
    {
      idPost: 3,
      idUser: 103,
      name: "Nguyễn Văn Tiến",
      content: "Chúc mọi người một ngày tốt lành! ☀️",
      time: "20 phút trước",
      avatar: "https://placekitten.com/202/202",
    },
    {
      idPost: 4,
      idUser: 104,
      name: "Nguyễn Thị Mai",
      content: "Mới mua được chiếc xe mới 🚗",
      time: "30 phút trước",
      avatar: "https://placekitten.com/203/203",
    },
    {
      idPost: 5,
      idUser: 105,
      name: "Trần Văn An",
      content: "Đi du lịch Đà Nẵng thật tuyệt vời! 🏖️",
      time: "1 giờ trước",
      avatar: "https://placekitten.com/204/204",
    },
  ];

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
              source={{ uri: 'https://placekitten.com/100/100' }}
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
            <View style={styles.story}><Text style={styles.storyText}>Tạo mới</Text></View>
            <View style={styles.story}><Text style={styles.storyText}>Linh</Text></View>
            <View style={styles.story}><Text style={styles.storyText}>Tiến</Text></View>
          </ScrollView>

          {/* Posts from array */}
          {posts.map((post) => (
            <View key={post.idPost} style={styles.post}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.avatar }}
                  style={styles.avatarSmall}
                />
                <View>
                  <Text style={styles.postName}>{post.name}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Example of accessing idPost and idUser */}
              <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                Post ID: {post.idPost} | User ID: {post.idUser}
              </Text>
            </View>
          ))}
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
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
});

export default DiaryMy;
