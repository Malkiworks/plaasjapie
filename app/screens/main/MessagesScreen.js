import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';

const MessagesScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([
    // Sample data for demonstration
    {
      id: '1',
      userId: 'user1',
      name: 'Anna',
      photoURL: 'https://images.unsplash.com/photo-1615212814093-f56085658024?q=80&w=1974&auto=format&fit=crop',
      lastMessage: 'Hi there! How are your vineyards doing this season?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unread: 1,
      isOnline: true
    },
    {
      id: '2',
      userId: 'user2',
      name: 'Johan',
      photoURL: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=2070&auto=format&fit=crop',
      lastMessage: 'Would you like to meet up this weekend?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread: 0,
      isOnline: false
    },
    {
      id: '3',
      userId: 'user3',
      name: 'Lerato',
      photoURL: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?q=80&w=1968&auto=format&fit=crop',
      lastMessage: 'I\'d love to swap some farming tips with you!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: 3,
      isOnline: true
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // Check if same day
    if (messageDate.toDateString() === now.toDateString()) {
      // Format as time only
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return translate('messages.yesterday');
    }
    
    // Format as date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Filter conversations based on search
  const filteredConversations = searchQuery
    ? conversations.filter(convo => 
        convo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;
  
  // Navigate to chat
  const navigateToChat = (conversation) => {
    navigation.navigate('Chat', { conversation });
  };
  
  // Render conversation item
  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigateToChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
        
        <View style={styles.conversationBody}>
          <Text 
            style={[styles.message, item.unread > 0 && styles.unreadMessage]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
      <Text style={styles.emptyTitle}>{translate('messages.noMessages')}</Text>
      <Text style={styles.emptyText}>{translate('messages.noMessagesDescription')}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('messages.title')}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={translate('common.search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>
      
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={
          filteredConversations.length === 0 ? styles.emptyListContent : null
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  conversationBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#E63946',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MessagesScreen; 