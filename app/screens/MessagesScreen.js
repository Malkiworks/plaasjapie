import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock conversation data - would be fetched from backend in real app
const mockConversations = [
  {
    id: '1',
    user: {
      name: 'Thandi',
      image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      isOnline: true,
    },
    lastMessage: {
      text: 'I love that farm market you mentioned. Maybe we could go together?',
      timestamp: '10:30 AM',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '2',
    user: {
      name: 'Johan',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      isOnline: false,
    },
    lastMessage: {
      text: 'The sunset here at the farm is beautiful. I took some photos to show you.',
      timestamp: 'Yesterday',
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '3',
    user: {
      name: 'Nosipho',
      image: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      isOnline: true,
    },
    lastMessage: {
      text: 'Have you been to the festival in Soweto? I heard it\'s amazing!',
      timestamp: 'Tuesday',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '4',
    user: {
      name: 'Pieter',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      isOnline: false,
    },
    lastMessage: {
      text: 'Ek sal jou more bel om die braai te reël. [Voice note available offline]',
      timestamp: 'Monday',
      isRead: true,
      hasVoiceNote: true,
    },
    unreadCount: 0,
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('messages');

  const filteredConversations = searchQuery
    ? mockConversations.filter(convo => 
        convo.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockConversations;

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.image }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
        </View>
        
        <View style={styles.messagePreview}>
          <View style={styles.lastMessageContainer}>
            {item.lastMessage.hasVoiceNote && (
              <Ionicons name="mic-outline" size={16} color="#555" style={{ marginRight: 4 }} />
            )}
            <Text 
              style={[
                styles.lastMessageText, 
                !item.lastMessage.isRead && styles.unreadText
              ]}
              numberOfLines={1}
            >
              {item.lastMessage.text}
            </Text>
          </View>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>All Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'offline' && styles.activeTab]}
          onPress={() => setActiveTab('offline')}
        >
          <Text style={[styles.tabText, activeTab === 'offline' && styles.activeTabText]}>Offline Available</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationsList}
      />

      <View style={styles.offlineBar}>
        <Ionicons name="cloud-offline-outline" size={16} color="white" />
        <Text style={styles.offlineText}>
          Offline mode: 4 conversations available
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E63946',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#E63946',
    fontWeight: 'bold',
  },
  conversationsList: {
    backgroundColor: 'white',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  lastMessageText: {
    fontSize: 14,
    color: '#555',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#333',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E63946',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    paddingVertical: 8,
  },
  offlineText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
}); 