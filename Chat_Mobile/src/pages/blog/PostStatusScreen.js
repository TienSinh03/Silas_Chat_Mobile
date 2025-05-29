import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert, Modal, Pressable, Image
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useDispatch, useSelector } from 'react-redux';
import {savePost, updatePost} from '../../api/postApi'; 
import * as ImagePicker from "expo-image-picker";

const PostStatusScreen = ({route}) => {
  const fonts = [
    { idFonts: 0, name: 'Fountain', key: 'f1' },
    { idFonts: 1, name: 'Pixel', key: 'f2' },
    { idFonts: 2, name: 'Vintage', key: 'f3' },
    { idFonts: 3, name: 'Terminal', key: 'f4' },
    { idFonts: 4, name: 'Florence', key: 'f5' },
    { idFonts: 5, name: 'Retro', key: 'f6' },
    { idFonts: 6, name: 'Graffiti', key: 'f7' },
    { idFonts: 7, name: 'Signature', key: 'f8' },
  ];

  const fontColors = {
    Fountain: ['#FF6347', '#FFA07A'],     
    Pixel: ['#1E90FF', '#87CEFA'],        
    Vintage: ['#8B4513', '#D2B48C'],      
    Terminal: ['#32CD32', '#7CFC00'],     
    Florence: ['#BA55D3', '#DDA0DD'],     
    Retro: ['#FFD700', '#FFA500'],       
    Graffiti: ['#DC143C', '#FF69B4'],     
    Signature: ['#000000', '#696969'],    
  };

  const { postToEdit } = route.params || {};
  console.log("Nhật ký: postToEdit", postToEdit);

  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Fountain');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const fontMap = Object.fromEntries(fonts.map(f => [f.name, f.key]));

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

  useEffect(() => {
    if (postToEdit) {
      setText(postToEdit.content);
      const font = fonts.find(f => f.idFonts === postToEdit.fonts);
      if (font) {
        setSelectedFont(font.name);
      }
    }
  }, [postToEdit]);

  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if(!result.canceled) {
            const image = result.assets[0];
            setImage({
                uri: image.uri,
                name: image.fileName || "avatar.jpg",
                type: "image/jpeg",
            });

        }
  };

  // SAVE
const handlePost = async () => {
  if (!text.trim()) {
    Alert.alert('Thông báo', 'Vui lòng nhập nội dung trước khi đăng.');
    return;
  }
console.log('isPublic value:', isPublic);

  const selectedFontObj = fonts.find(f => f.name === selectedFont);
  const postData = {
    userId: userProfile.id,
    content: text,
    fonts: selectedFontObj.idFonts, // Save as integer (e.g., 2 for Vintage)
    public: isPublic, // true: công khai, false: chỉ mình tôi
  };
  
  const formData = new FormData();
  formData.append("request", JSON.stringify(postData), "application/json");



  try {
    if(postToEdit) {
      postData.id = postToEdit.id;
      await updatePost({postId:postToEdit?.id, postData}); // Gọi API để cập nhật bài viết
    } else {
      if (image) {
        formData.append("image", image);
      }

      await savePost(formData); // Gọi API để lưu bài viết

    }
    Alert.alert('Đã đăng', 'Nội dung của bạn đã được đăng!');
    navigation.goBack({ reload: true });
  } catch (error) {
    console.error('Lỗi khi đăng bài:', error);
    Alert.alert('Lỗi', 'Không thể đăng bài viết. Vui lòng thử lại.');
  }
};

  // quyền xem
  const [privacy, setPrivacy] = useState('Quyền xem');
  const [isPublic, setIsPublic] = useState(true); // true: công khai, false: chỉ mình tôi
  const [modalVisible, setModalVisible] = useState(false);

const handleSelect = (value) => {
  setPrivacy(value); // Thêm dòng này để cập nhật giao diện
  // setPrivacyLabel(value); // Removed as it was undefined
  setIsPublic(value === 'Công khai'); // true nếu công khai, ngược lại là false
  setModalVisible(false);
};

  // lấy user hiện tại từ Redux store
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.user);
  const user = useMemo(() => {
          return userProfile || null;
  }, [userProfile]);
  console.log("Nhật ký: USER hiện tại--------------------" , userProfile);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        {/* <Text>{userProfile.id}</Text> */}

        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.headerText}>{privacy}</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => handleSelect('Công khai')}>
                  <Text style={styles.optionText}>
                    <FontAwesome5 name="user-friends" size={16} color="#007AFF" />
                    Công khai
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSelect('Chỉ mình tôi')}>
                  <Text style={styles.optionText}>
                    <FontAwesome5 name="lock" size={16} color="#007AFF"  />
                    Chỉ mình tôi
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>

        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButton}>{postToEdit ? 'Cập nhật' : 'Đăng'}</Text>
        </TouchableOpacity>
      </View>

      {/* Input */}
      <TouchableOpacity
        style={{
          backgroundColor: '#f0f8ff',  
          padding: 15,
          borderRadius: 10,
          marginVertical: 10,
          flexDirection: 'row',       
          alignItems: 'center',       
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,                
        }}
      >
        <Entypo name="yelp" size={24} color="#1e90ff" style={{ marginRight: 10 }} />
        <Text
          style={{
            flex: 1,
            color: '#1e90ff',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Gợi ý: Bạn có thể đăng ảnh, video, hoặc chia sẻ cảm xúc của mình theo cách sáng tạo nhất!
        </Text>
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          {
            fontFamily: fontMap[selectedFont],
            color: fontColors[selectedFont][0],
            height: image ? "40%" : "65%",
          },
        ]}
        placeholder="Bạn đang nghĩ gì?"
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
        multiline
      />

      {/* Image Preview */}
      {image && (
        <View style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: image.uri }}
            style={{ width: '100%', height: 200, borderRadius: 12 }}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Font Selection */}
      <ScrollView horizontal style={styles.fontRow} showsHorizontalScrollIndicator={false}>
        {fonts.map((font) => (
          <TouchableOpacity
            key={font.name}
            style={[
              styles.fontButton,
              selectedFont === font.name && styles.selectedFont,
            ]}
            onPress={() => setSelectedFont(font.name)}
          >
            <Text style={{
              fontFamily: font.key,
              fontSize: 16,
              color: fontColors[font.name][0],
            }}>
              {font.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

   

      {/* Options */}
      {/* <View style={styles.options}>
        <TouchableOpacity style={styles.option}>
          <Entypo name="music" size={20} color="#918b8b" />
          <Text> Nhạc</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
        >
          <MaterialIcons name="photo-album" size={20} color="#918b8b" />
          <Text> Album</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Entypo name="tag" size={20} color="#918b8b" />
          <Text> Với bạn bè</Text>
        </TouchableOpacity>
      </View> */}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <FontAwesome5 name="smile" size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={pickImage}
        >
          <MaterialIcons name="image" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="link" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="location-pin" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // justifyContent: 'center',
    marginBottom: 'auto',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 200,
    borderRadius: 8,
    padding: 15,
    elevation: 5,
    marginTop: 50,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#007AFF',
  },
  postButton: {
    color: '#1e90ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    textAlignVertical: 'top',
    fontSize: 16,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fontRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  fontButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    height: 40,
    justifyContent: 'center',
  },
  selectedFont: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
    borderWidth: 1,
  },
  options: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  option: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#918b8b',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#ccc',
    marginTop: 'auto',
  },
});

export default PostStatusScreen;