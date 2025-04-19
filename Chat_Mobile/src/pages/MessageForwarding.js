import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { getMyFriends } from '../store/slice/friendSlice'; 
import Loading from '../components/Loading'; 
import { forwardMessage } from '../api/chatApi';

const MessageForwarding = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { friends, isLoading } = useSelector((state) => state.friend);
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('Nhóm mới');
  const [message, setMessage] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [forwarding, setForwarding] = useState(false);

  const forwardedMessage = route.params?.forwardedMessage;
  console.log('Forwarded message:', forwardedMessage);

  useEffect(() => {
    dispatch(getMyFriends());
  }, [dispatch]);

  const filteredFriends = friends.filter(friend => {
    if (activeTab === 'Nhóm mới') return friend.type === 'group' || friend.type === 'contact' || !friend.type;
    if (activeTab === 'Nhật ký') return friend.type === 'contact' || !friend.type;
    if (activeTab === 'App khác') return friend.type === 'app';
    return true;
  });

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleForwardMessage = async () => {
    if (selectedFriends.length === 0) {
      alert('Vui lòng chọn ít nhất một người nhận!');
      return;
    }

    if (!forwardedMessage) {
      alert('Không có tin nhắn để chuyển tiếp!');
      return;
    }

    if (!user?.id) {
      alert('Không thể xác định người gửi. Vui lòng đăng nhập lại.');
      return;
    }

    setForwarding(true);
    try {
      for (const friendId of selectedFriends) {
        console.log(`Forwarding message to ${friendId}`);
        await forwardMessage({
          messageId: forwardedMessage.id,
          senderId: user.id,
          receiverId: friendId,
          content: forwardedMessage.content || '', // Content for text messages
          messageType: forwardedMessage.messageType, // Pass the message type (TEXT, IMAGE, AUDIO)
          fileUrl: forwardedMessage.fileUrl || null, // Pass the fileUrl for images/audio
          additionalMessage: message.trim(), // Optional additional message
        });
      }

      alert('Tin nhắn đã được chuyển tiếp thành công!');
      navigation.goBack();
    } catch (error) {
      console.error('Error forwarding message:', error.message);
      alert('Đã có lỗi xảy ra khi chuyển tiếp tin nhắn: ' + error.message);
    } finally {
      setForwarding(false);
    }
  };

  const renderFriendItem = ({ item }) => {
    const isSelected = selectedFriends.includes(item.userId);
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => toggleFriendSelection(item.userId)}
      >
        <Image
          source={{ uri: item.avatar || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.contactName}>{item.displayName}</Text>
        </View>
        <View style={[styles.checkbox, isSelected ? styles.checkboxSelected : null]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chia sẻ</Text>
        <Text style={styles.selectedCount}>Đã chọn: {selectedFriends.length}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="#A0A0A0"
          style={styles.searchInput}
        />
      </View>

      {forwardedMessage ? (
        <View style={styles.forwardedMessageContainer}>
          <Text style={styles.forwardedMessageLabel}>Tin nhắn chuyển tiếp:</Text>
          {forwardedMessage.messageType === 'TEXT' && (
            <Text style={styles.forwardedMessageText}>{forwardedMessage.content}</Text>
          )}
          {forwardedMessage.messageType === 'IMAGE' && (
            <Image
              source={{ uri: forwardedMessage.fileUrl }}
              style={styles.forwardedMessageImage}
            />
          )}
          {forwardedMessage.messageType === 'AUDIO' && (
            <Text style={styles.forwardedMessageText}>[Tin nhắn thoại]</Text>
          )}
        </View>
      ) : (
        <Text style={styles.emptyText}>Không có tin nhắn để chuyển tiếp</Text>
      )}

      <View style={styles.tabContainer}>
        {['Nhóm mới', 'Nhật ký', 'App khác'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Gần đây</Text>
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.userId.toString()}
        style={styles.chatList}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có bạn bè để hiển thị</Text>}
      />

      <View style={styles.bottomContainer}>
        <TextInput
          placeholder="Thêm tin nhắn (tùy chọn)"
          placeholderTextColor="#A0A0A0"
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={[styles.forwardButton, forwarding ? styles.forwardButtonDisabled : null]}
          onPress={handleForwardMessage}
          disabled={forwarding}
        >
          <Icon name="arrow-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Loading isLoading={isLoading || forwarding} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A3435',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  selectedCount: {
    color: '#A0A0A0',
    fontSize: 14,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A4445',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  forwardedMessageContainer: {
    backgroundColor: '#2A3435',
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  forwardedMessageLabel: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 5,
  },
  forwardedMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  forwardedMessageImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3A4445',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  sectionHeader: {
    padding: 15,
  },
  sectionHeaderText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  chatList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#A0A0A0',
    borderRadius: 12,
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2A3435',
  },
  messageInput: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#3A4445',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  forwardButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
  },
  forwardButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MessageForwarding;