import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootStackParamList} from '../../navigation/types';
import type {RootState} from '../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatMessage'>;

const ChatMessage: React.FC<Props> = ({route}) => {
  const {number} = route.params;
  const chat = useSelector((state: RootState) => state.chat[number]);

  if (!chat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chat not found</Text>
      </View>
    );
  }

  const renderMessage = ({item}: {item: (typeof chat.messages)[0]}) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.riskLevel}>Risk Level: {chat.risk_level}</Text>
        {chat.flagged && (
          <View style={styles.flagContainer}>
            <Text style={styles.flagLabel}>{chat.flag_label}</Text>
          </View>
        )}
      </View>
      <FlatList
        data={chat.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.timestamp}
        inverted
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskLevel: {
    fontSize: 16,
    fontWeight: '600',
  },
  flagContainer: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  flagLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  messageContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatMessage;
