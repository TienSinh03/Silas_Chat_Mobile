import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Switch,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const DetailSingleChatScreen = () => {
    const [isPinned, setIsPinned] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCallAlert, setIsCallAlert] = useState(true);

    return (
        <ScrollView style={styles.container}>
            {/* Ảnh đại diện + Tên */}
            <View style={styles.profileHeader}>
                <Image
                    source={{
                        uri: "https://avatars.githubusercontent.com/u/100653357?v=4",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>Tiến</Text>
                <Text style={styles.status}>se</Text>
            </View>

            {/* Các tùy chọn chính */}
            <View style={styles.optionsRow}>
                <OptionButton icon="search" text="Tìm tin nhắn" />
                <OptionButton icon="user" text="Trang cá nhân" />
                <OptionButton icon="image" text="Đổi hình nền" />
                <OptionButton icon="bell-off" text="Tắt thông báo" />
            </View>

            {/* Đánh dấu bạn thân */}
            <SettingToggle
                label="Đánh dấu bạn thân"
                value={isPinned}
                onChange={setIsPinned}
            />

            {/* Ảnh, file, link */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ảnh, file, link</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3, 4].map((item, index) => (
                        <Image
                            key={index}
                            source={{ uri: "https://i.imgur.com/6Z9PaeV.png" }}
                            style={styles.fileImage}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Tạo nhóm & Thêm vào nhóm */}
            <TouchableOpacity style={styles.optionRow}>
                <Ionicons name="people-outline" size={20} color="white" />
                <Text style={styles.optionText}>Tạo nhóm với Tiến</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow}>
                <Ionicons name="person-add-outline" size={20} color="white" />
                <Text style={styles.optionText}>Thêm Tiến vào nhóm</Text>
            </TouchableOpacity>

            {/* Nhóm */}
            <TouchableOpacity style={styles.optionRow}>
                <Ionicons name="people-outline" size={20} color="white" />
                <Text style={styles.optionText}>Xem nhóm chung (11)</Text>
            </TouchableOpacity>

            {/* Ghim và ẩn trò chuyện */}
            <SettingToggle
                label="Ghim trò chuyện"
                value={isPinned}
                onChange={setIsPinned}
            />
            <SettingToggle
                label="Ẩn trò chuyện"
                value={isMuted}
                onChange={setIsMuted}
            />
            <SettingToggle
                label="Báo cuộc gọi đến"
                value={isCallAlert}
                onChange={setIsCallAlert}
            />

            {/* Cài đặt khác */}
            <TouchableOpacity style={styles.optionRow}>
                <Feather name="settings" size={20} color="white" />
                <Text style={styles.optionText}>Cài đặt cá nhân</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow}>
                <Feather name="trash" size={20} color="red" />
                <Text style={[styles.optionText, { color: "red" }]}>
                    Xóa lịch sử trò chuyện
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// Component hiển thị tùy chọn
const OptionButton = ({ icon, text }) => (
    <TouchableOpacity style={styles.optionButton}>
        <Feather name={icon} size={22} color="white" />
        <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
);

// Component toggle bật/tắt
const SettingToggle = ({ label, value, onChange }) => (
    <View style={styles.optionRow}>
        <Text style={styles.optionText}>{label}</Text>
        <Switch value={value} onValueChange={onChange} />
    </View>
);

// 🌟 Style CSS
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    status: {
        color: "gray",
        fontSize: 14,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    optionButton: {
        alignItems: "center",
        padding: 10,
    },
    optionText: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
    },
    section: {
        marginVertical: 15,
    },
    sectionTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    fileImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
    },
    optionIcon: {
        marginRight: 10,
    },
});

export default DetailSingleChatScreen;
