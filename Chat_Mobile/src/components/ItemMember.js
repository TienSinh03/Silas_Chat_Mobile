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
import ActionSheet from "react-native-actions-sheet";
import { Alert } from "react-native";

const { width } = Dimensions.get("window"); // Lấy kích thước màn hình

const ItemMember = ({item, isFriend, isSuccessSent, sendRequest, userId, actionSheetRef}) => {

    const handleSelectMember = () => {
        actionSheetRef.current?.show();
    }
    console.log("isFriend", isFriend);
    return (
        <View style={{flex: 1}}>

            <TouchableOpacity key={item?.id} 
                style={{cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0'}}
                onPress={handleSelectMember}
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

            {/* display box */}
            <ActionSheet ref={actionSheetRef} containerStyle={{backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', paddingVertical: 15}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign:'center', width: '90%'}}>Thông tin thành viên</Text>
                        <IconA name="close" size={24} color="#000" style={{width: '10%'}} onPress={() => {actionSheetRef.current?.hide();}}/>
                    </View>

                    <View style={{padding: 10,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <Image source={{ uri: item?.avatar }} style={styles.contactImage} />
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item?.display_name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>

                            <TouchableOpacity style={{padding: 10, backgroundColor: '#D6E9FF', borderRadius: 24}} 
                                onPress={() => {()=>{console.log("Call")}}}
                            >
                                <Icon name="call-outline" size={20} color="#000" />
                            </TouchableOpacity>

                            <TouchableOpacity style={{padding: 10, backgroundColor: '#D6E9FF', borderRadius: 24}} 
                                onPress={() => {()=>{console.log("Chat")}}}
                            >
                                <Icon name="chatbubble-ellipses-outline" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{padding: 20}}>

                        <TouchableOpacity style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10}} onPress={() => {actionSheetRef.current?.hide();}}>
                            <IconA name="user" size={24} color="#000" />
                            <Text style={{fontSize: 15}}>Xem thông tin</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10}} onPress={() => {actionSheetRef.current?.hide();}}>
                            <Icon name="shield-outline" size={24} color="#000" />
                            <Text style={{fontSize: 15}}>Bổ nhiệm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10}} onPress={() => {actionSheetRef.current?.hide();}}>
                            <IconA name="deleteusergroup" size={24} color="red" />
                            <Text style={{fontSize: 15, color:'red'}}>Xóa khỏi nhóm</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ActionSheet>

        </View>
    )
}

const styles = StyleSheet.create({
  
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
  

export default ItemMember;