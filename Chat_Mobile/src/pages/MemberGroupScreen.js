import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import IconA from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { sendReq, checkFriendStatus } from "../store/slice/friendSlice";
import { Alert } from "react-native";

const { width } = Dimensions.get("window"); // Lấy kích thước màn hình

const ItemMember = ({item, isFriend, isSuccessSent, sendRequest, userId}) => {

  console.log("isFriend", isFriend);
  return (
      <TouchableOpacity key={item?.id} 
          style={{cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0'}}
          onPress={() => { console.log("item", item); }}
      >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image source={{ uri: item?.avatar }} style={styles.contactImage} />
              <Text style={{marginLeft: 8, fontSize: 16}}>{item?.display_name}</Text>
          </View>
          {/* Kiem tra xem co phai ban khong */}
          {!isFriend && userId !== item?.id ? (

                  <TouchableOpacity  style={{fontSize: '12px', padding: '4px 8px', backgroundColor: '#D6E9FF', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10}} onPress={() => {sendRequest(item?.id)}}>
                      <Text style={{color: "#006AF5"}}>Kết bạn</Text>
                  </TouchableOpacity>
              
          ): (<View></View>)}
          
      </TouchableOpacity>
  )
}

const MemberGroupScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { isSuccess, error } = useSelector((state) => state.friend);

  const { members } = route.params;
  console.log("members: ", members);

  console.log("isSuccess", isSuccess);
  console.log("error", error);
  // console.log("conversation", conversation);


  const [searchText, setSearchText] = useState("");
  const [friendStatus, setFriendStatus] = useState({}); 

    //state show find friend
    const [showSearch, setShowSearch] = useState(false);


  // Kiểm tra trạng thái bạn bè
  useEffect(() => {
    const checkIsFriend = async () => {
      if (!members || members.length === 0) return;

      const statusUpdates = {};
      for (const item of members) {
        try {

            if( item?.id === user?.id) continue; // Bỏ qua chính mình
          const response = await dispatch(checkFriendStatus(item?.id)).unwrap();
          console.log("response", response);
          statusUpdates[item?.id] = response; 
        } catch (error) {
          console.log(`Lỗi khi kiểm tra trạng thái bạn bè cho ${item?.id}:`, error);
          statusUpdates[item?.id] = false; 
        }
      }
      setFriendStatus((prev) => ({ ...prev, ...statusUpdates }));
    };

    checkIsFriend();
  }, [members, dispatch]);


  // Xu lý tìm kiếm
  const handleSearch = async (keyword) => {
    console.log("keyword", keyword);
  };

  useEffect(() => {
    if (searchText) {
      handleSearch(searchText);
    }
  }, [searchText]);

  // handle gửi lời mời kết bạn
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


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#006AF5", "#5FCBF2"]}
        locations={[0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        {showSearch && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginLeft: 10 }}>

                <TouchableOpacity style={styles.searchBox}>
                    <IconA name="search1" size={24} color="#fff" />
                    <TextInput
                        placeholder="Tìm kiếm"
                        placeholderTextColor={"#B8D9FF"}
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </TouchableOpacity>
                {searchText.trim() && (

                    <IconA name="close" size={24} color="#fff" onPress={() =>{ setShowSearch(false); setSearchText("")}} />
                )}
            </View>
        )}
        {!showSearch && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginLeft: 10, width: '90%' }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                    Thành viên
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
                    <IconA name="addusergroup" size={24} color="#fff" 
                        onPress={() => { console.log("Xử lý thêm thành viên") }} 
                    />
                    
                    <IconA name="search1" size={24} color="#fff" 
                        onPress={() => setShowSearch(true)} 
                    />

                </View>
            </View>
        )}
      </LinearGradient>


        <View>
          <Text style={styles.sectionTitle}>
            Thành viên ({members.length})
          </Text>
          <FlatList
            data={members}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => 
              ItemMember({item, 
                sendRequest: (id) => handleSendRequest(id), 
                isSuccessSent: isSuccess, 
                isFriend: friendStatus[item?.id],
                userId: user?.id
              })}
          />
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20, // Chừa khoảng trống phía dưới
    paddingTop: StatusBar.currentHeight || 0,
  },

  // Header Gradient
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  // Thanh tìm kiếm
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 40,
    width: '85%',
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },

  // Tiêu đề từng phần
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    padding: 10,
  },

  // Liên hệ đã tìm
  contactItem: {
    alignItems: "center",
    marginRight: 15,
    padding: 10,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },

  // Truy cập nhanh
  quickAccessContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  // Lịch sử tìm kiếm
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    padding: 10,
  },
  historyText: {
    fontSize: 14,
    marginLeft: 10,
  },

  // Nút chỉnh sửa lịch sử tìm kiếm
  editHistoryText: {
    color: "#007AFF",
    padding: 10,
  },
});

export default MemberGroupScreen;
