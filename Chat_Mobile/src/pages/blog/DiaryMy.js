import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "react-native";

import { SafeAreaView, StatusBar, StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,TouchableWithoutFeedback } from "react-native";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import {getPostsMyByUserId, getFriendsByUserId, getAllPosts, getUserById, getUsersWithPosts, deletePost, saveComment} from '../../api/postApi';
import { useFonts } from 'expo-font';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  AntDesign,
  FontAwesome
} from '@expo/vector-icons';

import { Alert } from 'react-native';




const DiaryMy = () => {
// Khởi tạo state cho modal và bài viết đã chọn
const [modalVisible, setModalVisible] = useState(false);
const [selectedPost, setSelectedPost] = useState(null);
const navigation = useNavigation();

const [modalFunctionVisible, setModalFunctionVisible] = useState(false);

// lấy user hiện tại từ Redux store
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.user);
  const user = useMemo(() => {
          return userProfile || null;
  }, [userProfile]);
  console.log("Nhật ký: USER hiện tại--------------------" , userProfile);
/*
 (NOBRIDGE) LOG  Nhật ký: USER hiện tại-------------------- {"avatar": "https://res.cloudinary.com/dovnjo6ij/image/upload/v1744734307/yviw4m4qp63sx1xmj6mb.jpg", "display_name": "Tran Minh Tiến", "dob": "2003-02-06", "enabled": true, "gender": "MALE", "id": "67fb51ce6993e15db49bf32f", "password": "$2a$10$BBWzlF0pJxQq9sriX40YQOUQ40BaBJXpUFUMFGjLW/c88AlBr3Ng.", "phone": "+84869188704", "roles": ["ROLE_USER"]}
*/
  // Lấy bài viết của người dùng hiện tại
  const [userPosts, setUserPosts] = useState([]);

  // Lấy bài viết của người dùng hiện tại
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPostsMyByUserId(user?.id);
        setUserPosts(postsData);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    if (user?.id) {
      fetchPosts();
    }
  }, [user?.id]);

  console.log("**************************************Bài viết của người dùng hiện tại:---------------------", userPosts);

  // Lấy danh sách bạn bè của người dùng hiện tại
  const [friends, setFriends] = useState([]);
  React.useEffect(() => {
    const fetchFriends = async () => {
      try {
        const result = await getFriendsByUserId(user?.id);
        setFriends(result.response || []);     // nếu dùng như bên dưới sẽ không lấy được do postmain khi test {               ...............} KHÔNG Phải là [..............]
        /*
        const friendsData = await getFriendsByUserId(user?.id);
        setFriends(friendsData); //
        */
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
      }
    };
    if (user?.id) {
      fetchFriends();
    }
  }, [user?.id]);
  console.log("............................danh sách bạn bè:...................................", friends);



  // Lấy tất cả bài viết
  const [allPosts, setAllPosts] = useState([]);
  React.useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const allPostsData = await getAllPosts();
        setAllPosts(allPostsData);
      } catch (error) {
        console.error("Lỗi khi lấy tất cả bài viết:", error);
      }
    };
    fetchAllPosts();
  }, []);
  console.log("**************************************Tất cả bài viết:", allPosts);
// chỉ lấy bài viết của bạn bè dựa vào friends và allPosts 

  
// Lọc bài viết của bạn bè
// const [friendPosts, setFriendPosts] = useState([]);

// useEffect(() => {
//   if (friends.length > 0 && allPosts.length > 0) {
//     const friendIds = friends.map(friend => friend.userId);
//     const postsFromFriends = allPosts.filter(post => friendIds.includes(post.userId));
//     setFriendPosts(postsFromFriends);
//   }
// }, [friends, allPosts]);

// console.log("**************************************Bài viết của bạn bè:", friendPosts);
 



//getUserById

const [friendUsers, setFriendUsers] = useState({});
const fetchFriendUsers = async () => {
  try {
    const users = await Promise.all(
      friends.map(friend => getUserById(friend.userId))
    );
    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    setFriendUsers(usersMap);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
};

useEffect(() => {
  if (friends.length > 0) {
    fetchFriendUsers();
  }
}, [friends]);




// lây danh sách người dùng có thông tin user có bài viếết và chỉ lọc theo danh sách bạn bè
const [usersWithPosts, setUsersWithPosts] = useState([]); // New state for getUsersWithPosts
useEffect(() => {
    const fetchUsersWithPosts = async () => {
      try {
        const usersData = await getUsersWithPosts();
        // Filter to only include users who are friends and have posts
        const friendIds = friends.map(friend => friend.userId);
        const filteredUsers = usersData.filter(item => 
          friendIds.includes(item.user.id) && item.posts.length > 0
        );
        setUsersWithPosts(filteredUsers);
      } catch (error) {
        console.error("Lỗi khi lấy người dùng có bài viết:", error);
      }
    };
    if (friends.length > 0) {
      fetchUsersWithPosts();
    }
  }, [friends]);
console.log("**************************************Danh sách người dùng có bài viết:", usersWithPosts);


// XÓA POST
const confirmDeletePost = (postId) => {
  Alert.alert(
    "Xác nhận xoá",
    "Bạn có chắc muốn xoá bài viết này không?",
    [
      {
        text: "Huỷ",
        style: "cancel"
      },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => handleDeletePost(postId)
      }
    ]
  );
};

const handleDeletePost = async (postId) => {
  try {
    await deletePost(postId);
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    setModalFunctionVisible(false);

    Alert.alert("Thành công", "Bài viết đã được xoá.");
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    Alert.alert("Lỗi", "Xảy ra lỗi khi xoá bài viết.");
  }
};





  // font
    const fonts = [
    { idFonts: 1, key: 'f1' },
    { idFonts: 2, key: 'f2' },
    { idFonts: 3, key: 'f3' },
    { idFonts: 4, key: 'f4' },
    { idFonts: 5, key: 'f5' },
    { idFonts: 6, key: 'f6' },
    { idFonts: 7, key: 'f7' },
    { idFonts: 8, key: 'f8' },
  ];
  const [loaded] = useFonts({
    f1: require('../../../assets/font/f1.ttf'),
    f2: require('../../../assets/font/f2.ttf'),
    f3: require('../../../assets/font/f3.ttf'),
    f4: require('../../../assets/font/f4.ttf'),
    f5: require('../../../assets/font/f5.ttf'),
    f6: require('../../../assets/font/f6.ttf'),
    f7: require('../../../assets/font/f7.ttf'),
    f8: require('../../../assets/font/f8.ttf'),
  });
  if (!loaded) return null;
  // console.log("fonts", fonts);
  console.log("fonts", fonts.map(f => f.key));

  const getFontKey = (fontId) => {
      const font = fonts.find(f => f.idFonts === fontId);
      return font ? font.key : 'f1'; // Default to 'f1' if fontId not found
    };


    
    // reload page when user change

    // khi nhấn vào bình luận lấy các thông tin
    /*
          console.log('Bình luận đã được gửi:', commentData);
      console.log('----------bài viết ID:', postId);
      console.log('----------------nguoi dang:', userIdPost);
      console.log('Nid-------------------------------- nguoi binh luan:', userIdActor);
    */
    
    

    // binh luan


  const [commentText, setCommentText] = useState('');
  const handleCommentSubmit = async (postId, userIdPost, userIdActor) => {
    if (!commentText.trim()) return;

    try {
      const commentData = {
        content: commentText,
        createdAt: new Date().toISOString(), // optional, only if backend needs it
      };

      await saveComment(postId, userIdPost, userIdActor, commentData);
      console.log('Bình luận đã được gửi:', commentData);
      console.log('----------bài viết ID:', postId);
      console.log('----------------nguoi dang:', userIdPost);
      console.log('Nid-------------------------------- nguoi binh luan:', userIdActor);

      // Clear input after successful comment
      setCommentText('');

      // Optional: reload comments or call a callback function
      // await fetchComments(postId); // if you have such a function
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error.message);
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
    }
  };



  



  return (

      <SafeAreaView style={styles.container}>
        <Header iconRight="user" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Post Box */}
          <View style={styles.postBox}>
            {/* lấy img từ useProfile */}
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity  style={styles.input} 
                    onPress={() => navigation.navigate('PostStatusScreen')}
            >
              <Text>
                Hôm nay bạn thế nào?
              </Text>
            </TouchableOpacity>

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
                source={{ uri: user?.avatar }}
                style={styles.avatarList}
              />
              <Text style={styles.storyTextList}>Tạo mới</Text>
            </TouchableOpacity>

            {/* Các story từ mảng posts */}
            {friends.map((friend) => (
              <TouchableOpacity key={friend.userId} style={styles.storyList}>
                <Image source={{ uri: friend.avatar }} style={styles.avatarList} />
                <Text style={styles.storyTextList}>{friend.displayName}</Text>
              </TouchableOpacity>
            ))}
      </ScrollView>

          {/* Posts from my */}
          {userPosts.map((post) => (
            <View key={post.idPost} style={styles.post}>
              {/* <Text>{post.public ? "Công khai" : "Chỉ mình tôi"}</Text> */}
              <View style={styles.postHeader}>
                <Image 
                
                  source={{ uri: user.avatar }}
                  style={styles.avatarSmall}
                />

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    {/* <Text style={styles.postName}>{post.fonts}</Text> */}
                    <Text style={styles.postName}>{user.display_name}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingLeft: 5 }}>
                        <FontAwesome5
                          name={post.public ? "user-friends" : "lock"}
                          size={15}
                          color="#9699aa"
                          style={{ marginRight: 6 }}
                        />
                        <Text>{post.public ? "" : ""}</Text>
                      </View>
                    </Text>
                    <Text style={styles.postTime}>{post.createdAt}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setSelectedPost(post);
                    setModalFunctionVisible(true); // mở modal sửa/xoá
                  }}>
                    <Entypo name="dots-three-vertical" size={15} color="black" />
                  </TouchableOpacity>
    
                </View>
              </View>
              
              <Text style={[styles.postContent, { fontFamily: getFontKey(post.fonts) }]}>
                  {post.content}
              </Text>              

              {/* Example of accessing idPost and idUser */}
              <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                Post ID: {post.id} | User ID: {post.userId}
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

          {/* Posts FRIEND*/}
        
{/*
{friendPosts.map((post) => (
  <View key={post.idPost} style={styles.post}>
    <View style={styles.postHeader}>
      <Image
        source={{ uri: user.avatar }}
        style={styles.avatarSmall}
      />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={styles.postName}>{post.userId}</Text>
          <Text style={styles.postTime}>{post.createdAt}</Text>
        </View>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={15} color="black" />
        </TouchableOpacity>          
      </View>
    </View>
    <Text style={styles.postContent}>{post.content}</Text>
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
*/}





          {/* <Text>-----------------TEST LẤY LUÔN INFO4------------------</Text> */}
        {usersWithPosts.map((item) => (
          item.posts.map((post) => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postHeader}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatarSmall} />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={styles.postName}>{item.user.displayName}</Text>
                    <Text style={styles.postTime}>{post.createdAt}</Text>
                  </View>
                  <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={15} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
                <Text style={[styles.postContent, { fontFamily: getFontKey(post.fonts) }]}>
                    {post.content}
                </Text>

              <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                Post ID: {post.id} | User ID: {post.userId}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity style={styles.likeContainer}>
                  <Ionicons name="heart-outline" size={20} color="#000" />
                  <Text style={styles.likeText}>Thích</Text>
                  <View style={styles.divider} />
                  <Ionicons name="heart" size={20} color="red" />
                  <Text style={styles.likeCount}>{post.likeCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.commentContainer}
                  onPress={() => {
                    setSelectedPost({ ...post, name: item.user.displayName });
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="chatbox-ellipses-outline" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ))}
          
          {/* Modal hiển thị bình luận */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}

        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              {/* Ngăn chặn việc đóng modal khi bấm vào nội dung */}
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <TouchableOpacity>
                    <FontAwesome name="smile-o" size={20} color="#000" />
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Nhập bình luận..."
                    style={styles.commentInput}
                    multiline
                    value={commentText}
                    onChangeText={setCommentText}
                  />

                  <TouchableOpacity>
                    <FontAwesome5 name="camera" size={20} color="#000" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleCommentSubmit(selectedPost.id, userPosts.id, userProfile.id, commentText)}>

                    <FontAwesome5 name="paper-plane" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

          {/* Modal hiển thị xóa/sửa */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalFunctionVisible}
          onRequestClose={() => setModalFunctionVisible(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPressOut={() => setModalFunctionVisible(false)}
          >
            <View style={styles.modalContainer}>
              {/* <TouchableOpacity style={styles.modalOption}>
                <AntDesign name="edit" size={16} color="black" style={{marginRight: 5}} />
                  <Text style={styles.editText}>Sửa bài viết</Text> 
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setModalFunctionVisible(false); // Đóng modal chức năng
                  navigation.navigate('PostStatusScreen', {
                    postToEdit: selectedPost, // Gửi dữ liệu bài viết sang để sửa
                  });
                }}
              >
                <AntDesign name="edit" size={16} color="black" style={{marginRight: 5}} />
                <Text style={styles.editText}>Sửa bài viết</Text> 
              </TouchableOpacity>


              <TouchableOpacity style={styles.modalOption} onPress={() => confirmDeletePost(selectedPost.id)}>
                <AntDesign name="delete" size={16} color="black" style={{marginRight: 5}} />
                <Text style={styles.deleteText}>Xoá bài viết</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        </ScrollView>
      </SafeAreaView>  
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    // margin: 10,
    // borderRadius: 25,
    elevation: 5,
    // height: 260,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#000',
    maxHeight: 100,
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editText: {
    fontSize: 16,
  },
  deleteText: {
    fontSize: 16,
    color: 'red',
  },  
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },


});

export default DiaryMy;
