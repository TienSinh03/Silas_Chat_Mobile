import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
    // const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);


    return (
        <ScrollView style={styles.container}>

            <View style={styles.iconContainer}>
                {/* Nút mũi tên quay lại */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate("ProfileMain"); // Chuyển đến màn hình chính nếu không có màn hình trước đó
                        }
                    }}
                >
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                {/* Nút time-outline */}
                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => setHistoryModalVisible(true)}
                >
                    <Ionicons name="time-outline" size={24} color="white" />
                </TouchableOpacity>

                {/* Nút 3 chấm */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="ellipsis-horizontal-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Modal hiện lịch sử */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={historyModalVisible}
                onRequestClose={() => setHistoryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cho phép bạn bè xem nhật ký</Text>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Toàn bộ bài đăng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Trong 7 ngày gần nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Trong 1 tháng gần nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Trong 6 tháng gần nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Tùy chỉnh</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setHistoryModalVisible(false)}
                        >
                            <Text>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal hiện menu */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => { setModalVisible(false); navigation.navigate("EditProfile"); }}
                        >
                            <Text>Thông tin</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Đổi ảnh đại diện</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Đổi ảnh bìa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Cập nhật giới thiệu bản thân</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Ví của tôi</Text>
                        </TouchableOpacity>

                        {/* Đóng modal */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


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
    container: { flex: 1, backgroundColor: "#fff"},
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
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15, // Tăng padding ngang để có khoảng cách đều hơn
        paddingVertical: 10, // Thêm padding dọc để căn giữa
        top:40
    },

    backButton: {
        position: "absolute",
        left: 10,  // Căn lề trái
        padding: 5, 
        zIndex: 10, // Đảm bảo nút nằm trên cùng
    },    
    historyButton: {
        position: "absolute",
        // top: 50,
        right: 50,
        zIndex: 10,
    },
    menuButton: {
        position: "absolute",
        // top: 45,  // Giảm xuống để không bị che khuất
        right: 10, // Đặt sát mép phải
        zIndex: 10, // Đảm bảo nằm trên cùng
        padding: 5,
        borderRadius: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    closeButton: {
        marginTop: 10,
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    closeButton: {
        marginTop: 10,
        alignItems: "center",
    },

});

export default ProfileScreen;
