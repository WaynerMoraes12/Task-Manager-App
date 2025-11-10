import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../../styles/styles';

const ChatBotScreen = ({ chatMessages, chatInput, setChatInput, onSendMessage }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.content} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={100}
    >
      <Text style={styles.screenTitle}>💬 Assistente</Text>
      
      <ScrollView style={styles.chatMessages}>
        {chatMessages.length === 0 ? (
          <View style={styles.chatEmpty}>
            <Text style={styles.chatEmptyTitle}>👋 Olá!</Text>
            <Text style={styles.chatEmptySubtitle}>Pergunte sobre suas tarefas</Text>
          </View>
        ) : (
          chatMessages.map((msg, idx) => (
            <View 
              key={idx} 
              style={[
                styles.chatBubble, 
                msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot
              ]}
            >
              <Text style={[
                styles.chatText, 
                msg.sender === 'user' ? styles.chatTextUser : styles.chatTextBot
              ]}>
                {msg.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      
      <View style={styles.chatInputContainer}>
        <TextInput 
          style={styles.chatInput} 
          value={chatInput} 
          onChangeText={setChatInput} 
          placeholder="Digite..." 
          onSubmitEditing={onSendMessage} 
        />
        <TouchableOpacity style={styles.chatSendButton} onPress={onSendMessage}>
          <Text style={styles.chatSendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBotScreen;