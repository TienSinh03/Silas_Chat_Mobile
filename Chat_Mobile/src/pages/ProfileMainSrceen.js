import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import FindInfo from '../navigation/FindInfo';
import { removeToken } from '../utils/authHelper';
import { useAuth } from '../contexts/AuthContext';

const ProfileMainScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { setIsLoggedIn } = useAuth(); // Get setIsLoggedIn from AuthContext
    //logout
    const handleLogout = () => {
        // Implement logout functionality here
        console.log('Logout pressed');
        removeToken();

        setIsLoggedIn(false);
        setTimeout(() => {
            navigation.replace("HomeScreen");
        }, 100);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView>
                <Header iconRight="logout" onIconRightPress={handleLogout} />
                {modalVisible && <FindInfo />}
            </SafeAreaView>

            {/* Profile */}
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482741PIj/anh-mo-ta.png' }}
                    style={styles.avatar}
                />
                <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate("Profile"); }}>
                    <Text style={styles.name}>Ngô Văn Toàn</Text>
                    <Text style={styles.viewProfile}>Xem trang cá nhân</Text>
                </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView>
                <MenuItem icon="cloud" title="zCloud" subtitle="Không gian lưu trữ dữ liệu trên đám mây" />
                <MenuItem icon="paint-brush" title="zStyle - Nổi bật trên Zalo" subtitle="Hình nền và nhạc cho cuộc gọi Zalo" />
                <MenuItem icon="cloud-upload" title="Cloud của tôi" subtitle="Lưu trữ các tin nhắn quan trọng" />
                <MenuItem icon="folder" title="Dữ liệu trên máy" subtitle="Quản lý dữ liệu Zalo của bạn" />
                <MenuItem icon="qrcode" title="Ví QR" subtitle="Lưu trữ và xuất trình các mã QR quan trọng" />
                <MenuItem icon="shield" title="Tài khoản và bảo mật" />
                <MenuItem icon="lock" title="Quyền riêng tư" />
            </ScrollView>
        </View>
    );
};

const MenuItem = ({ icon, title, subtitle }) => (
    <TouchableOpacity style={styles.menuItem}>
        <Icon name={icon} size={22} color="#007AFF" style={styles.icon} />
        <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginTop: 40,
    },

    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        marginRight: 15,
    },

    name: {
        color: '#121212',
        fontSize: 18,
        fontWeight: 'bold',
    },

    viewProfile: {
        color: '#007AFF',
        fontSize: 14,
        marginTop: 3,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },

    icon: {
        marginRight: 15,
    },

    menuTextContainer: {
        flex: 1,
    },

    menuTitle: {
        color: '#121212',
        fontSize: 16,
        fontWeight: '500',
    },

    menuSubtitle: {
        color: '#666666',
        fontSize: 12,
        marginTop: 3,
    },
});

export default ProfileMainScreen;
