import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
    // const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            {/* Ảnh bìa */}
            <View style={styles.coverPhotoContainer}>
                <Image
                    source={{ uri: "https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg" }}
                    style={styles.coverPhoto}
                />
            </View>

            {/* Ảnh đại diện và thông tin */}
            <View style={styles.profileInfo}>
                <Image
                    source={{ uri: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482741PIj/anh-mo-ta.png" }}
                    style={styles.avatar}
                />
                <Text style={styles.userName}>Ngô Văn Toàn</Text>
                <TouchableOpacity onPress={() => navigation.navigate("EditStatus")}>
                    <Text style={styles.status}>"Đường còn dài, tuổi còn trẻ"</Text>
                </TouchableOpacity>

            </View>

            {/* Các nút chức năng */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>Chỉnh sửa trang cá nhân</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Ionicons name="settings-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>Cài đặt</Text>
                </TouchableOpacity>
            </View>

            {/* Các mục khác */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="images-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ảnh của tôi</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="bookmark-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Kho khoảnh khắc</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    coverPhotoContainer: { height: 200, backgroundColor: "#ccc" },
    coverPhoto: { width: "100%", height: "100%" },
    profileInfo: { alignItems: "center", marginTop: -50 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#fff" },
    userName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
    status: {
        fontSize: 18,
        color: "#000000",
        // textDecorationLine: "underline",
    },
    actions: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
    button: { flexDirection: "row", alignItems: "center", backgroundColor: "#007AFF", padding: 10, borderRadius: 5, marginHorizontal: 5 },
    buttonText: { color: "white", marginLeft: 5 },
    menu: { marginTop: 20 },
    menuItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    menuText: { fontSize: 18, marginLeft: 10 },
});

export default ProfileScreen;
