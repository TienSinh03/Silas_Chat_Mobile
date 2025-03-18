import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Switch,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const GroupSettingsScreen = () => {
    const [isPinned, setIsPinned] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const leaveGroup = () => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn rời nhóm?", [
            { text: "Hủy", style: "cancel" },
            { text: "Rời nhóm", onPress: () => console.log("Rời nhóm") },
        ]);
    };

    const clearChatHistory = () => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa lịch sử trò chuyện?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                onPress: () => console.log("Xóa lịch sử trò chuyện"),
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Ảnh đại diện + Tên nhóm */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="people" size={40} color="white" />
                </View>
                <Text style={styles.name}>TH_CNM_CN_10-12</Text>
            </View>

            {/* Các tùy chọn chính */}
            <View style={styles.optionsRow}>
                <OptionButton icon="search" text="Tìm tin nhắn" />
                <OptionButton icon="user-plus" text="Thêm thành viên" />
                <OptionButton icon="image" text="Đổi hình nền" />
                <OptionButton icon="bell-off" text="Tắt thông báo" />
            </View>

            {/* Danh sách tùy chọn */}
            <OptionRow icon="folder" text="Ảnh, file, link" />
            <OptionRow icon="calendar" text="Lịch nhóm" />
            <OptionRow icon="bookmark" text="Tin nhắn đã ghim" />
            <OptionRow icon="bar-chart-2" text="Bình chọn" />
            <OptionRow icon="users" text="Xem thành viên (27)" />
            <OptionRow icon="link" text="Link nhóm" />

            {/* Ghim trò chuyện */}
            <SettingToggle
                label="Ghim trò chuyện"
                value={isPinned}
                onChange={setIsPinned}
            />
            {/* Ẩn trò chuyện */}
            <SettingToggle
                label="Ẩn trò chuyện"
                value={isMuted}
                onChange={setIsMuted}
            />
            {/* Rời nhóm & Xóa lịch sử trò chuyện */}
            <OptionRow
                icon="log-out"
                text="Rời nhóm"
                onPress={leaveGroup}
                color="red"
            />
            <OptionRow
                icon="trash-2"
                text="Xóa lịch sử trò chuyện"
                onPress={clearChatHistory}
                color="red"
            />
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

const OptionRow = ({ icon, text }) => (
    <TouchableOpacity style={styles.optionRow}>
        <Feather
            name={icon}
            size={20}
            color="white"
            style={styles.optionIcon}
        />
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
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
    },
    name: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
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

export default GroupSettingsScreen;
