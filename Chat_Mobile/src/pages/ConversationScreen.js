import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import Header from "../components/Header";
import ConservationList from "../components/ConservationList";
import TabTopCategoryChat from "../navigation/TabTopCategoryChat";
import IconA from "react-native-vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");

const ConversationScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        iconLeft={"qrcode"}
        iconRight={"plus"}
        onIconRightPress={() => setModalVisible(true)}
      />
      <TabTopCategoryChat />
      {/* <ConservationList category="priority" /> */}

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <TouchableOpacity style={styles.modalItem} onPress={() => { setModalVisible(false); navigation.navigate("AddFriendScreen"); }}>
              <IconA name="adduser" size={24} color="#000" />
              <Text style={{fontSize: 15}}>Thêm bạn bè</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem} onPress={() => { setModalVisible(false); navigation.navigate("CreateGroupScreen"); }}>
              <IconA name="addusergroup" size={24} color="#000" />
              <Text style={{fontSize: 15}}>Tạo nhóm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{paddingTop: 8}}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{fontSize: 15, textAlign:"right"}}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
  modalContainer: {
    flex: 1,
    alignItems: "flex-end",
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width / 2,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
},
  modalItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap:10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
export default ConversationScreen;
