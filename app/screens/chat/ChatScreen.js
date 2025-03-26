import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';

const ChatScreen = ({ route, navigation }) => {
  const { matchId, matchName, matchPhoto } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef(null);

  // Sample user data (replace with actual user data from context or auth)
  const currentUser = {
    id: 'user123',
    name: 'Johan Botha',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop'
  };

  // Sample messages data
  useEffect(() => {
    // Simulate fetching messages
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          text: 'Hi there! I saw you have a gorgeous farm in Stellenbosch.',
          timestamp: new Date(Date.now() - 3600000 * 2),
          senderId: matchId || 'match456',
          senderName: matchName || 'Anna Visser',
          imageUrl: null,
          isVoiceNote: false
        },
        {
          id: '2',
          text: 'Yes, it\'s been in our family for generations. We specialize in wine grapes.',
          timestamp: new Date(Date.now() - 3600000 * 1.5),
          senderId: currentUser.id,
          senderName: currentUser.name,
          imageUrl: null,
          isVoiceNote: false
        },
        {
          id: '3',
          text: 'That sounds wonderful! I have a small olive farm myself.',
          timestamp: new Date(Date.now() - 3600000),
          senderId: matchId || 'match456',
          senderName: matchName || 'Anna Visser',
          imageUrl: null,
          isVoiceNote: false
        },
        {
          id: '4',
          text: 'Maybe we could visit each other\'s farms sometime?',
          timestamp: new Date(Date.now() - 1800000),
          senderId: matchId || 'match456',
          senderName: matchName || 'Anna Visser',
          imageUrl: null,
          isVoiceNote: false
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [matchId, matchName]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Send message
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      imageUrl: null,
      isVoiceNote: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implementation for voice recording would go here
  };

  // Send voice note
  const sendVoiceNote = () => {
    setIsRecording(false);
    // Implementation for sending voice note would go here
  };

  // Render message item
  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.userMessageContainer : styles.otherMessageContainer
      ]}>
        {!isCurrentUser && (
          <Image
            source={{ uri: matchPhoto || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' }}
            style={styles.avatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.userMessageBubble : styles.otherMessageBubble
        ]}>
          {item.isVoiceNote ? (
            <View style={styles.voiceNoteContainer}>
              <Ionicons name="play" size={20} color={isCurrentUser ? "#fff" : "#333"} />
              <View style={styles.voiceWaveform}>
                {/* Voice waveform visualization would go here */}
                <View style={[styles.waveformBar, { height: 15 }]} />
                <View style={[styles.waveformBar, { height: 10 }]} />
                <View style={[styles.waveformBar, { height: 20 }]} />
                <View style={[styles.waveformBar, { height: 7 }]} />
                <View style={[styles.waveformBar, { height: 12 }]} />
                <View style={[styles.waveformBar, { height: 18 }]} />
                <View style={[styles.waveformBar, { height: 8 }]} />
              </View>
              <Text style={[styles.voiceDuration, isCurrentUser ? styles.userMessageText : styles.otherMessageText]}>
                0:12
              </Text>
            </View>
          ) : item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
          ) : (
            <Text style={[
              styles.messageText,
              isCurrentUser ? styles.userMessageText : styles.otherMessageText
            ]}>
              {item.text}
            </Text>
          )}
          
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.userMessageTime : styles.otherMessageTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        
        {isCurrentUser && (
          <Image
            source={{ uri: currentUser.photo }}
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <Image
            source={{ uri: matchPhoto || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' }}
            style={styles.headerAvatar}
          />
          
          <View>
            <Text style={styles.headerName}>{matchName || 'Anna Visser'}</Text>
            <Text style={styles.headerStatus}>{translate('chat.online')}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E63946" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      
      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color="#666" />
          </TouchableOpacity>
          
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <Ionicons name="radio" size={24} color="#E63946" />
              <Text style={styles.recordingText}>{translate('chat.recording')}</Text>
              <TouchableOpacity onPress={toggleRecording}>
                <Text style={styles.cancelButton}>{translate('chat.cancel')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={translate('chat.typePlaceholder')}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          )}
          
          {inputText.trim() !== '' ? (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          ) : isRecording ? (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendVoiceNote}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.micButton}
              onPress={toggleRecording}
            >
              <Ionicons name="mic-outline" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  infoButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: '#E63946',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherMessageTime: {
    color: '#999',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  voiceNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 30,
    paddingHorizontal: 8,
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#E63946',
    marginHorizontal: 1,
    borderRadius: 3,
  },
  voiceDuration: {
    fontSize: 12,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 5,
    marginRight: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#E63946',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    padding: 8,
    marginLeft: 5,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  recordingText: {
    flex: 1,
    color: '#E63946',
    marginLeft: 8,
  },
  cancelButton: {
    color: '#666',
    fontWeight: '500',
  },
});

export default ChatScreen; 