import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import type {RootStackParamList} from '../../navigation/types';
import type {RootState} from '../../store';
import type {ChatEntity} from '../../store/slices/types';

type ChatListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChatList'>;
};

const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'high':
      return '#ff4444';
    case 'medium':
      return '#ffbb33';
    default:
      return '#00C851';
  }
};

const Separator = () => <View style={styles.separator} />;

const ChatList: React.FC<ChatListProps> = ({navigation}) => {
  const chats = useSelector((state: RootState) => state.chat);

  const renderChatItem = ({item}: {item: [string, ChatEntity[string]]}) => {
    const [number, chat] = item;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatMessage', {number})}>
        <View style={styles.chatHeader}>
          <Text style={styles.phoneNumber}>{number}</Text>
          {chat.flagged && (
            <View style={styles.flagContainer}>
              <Text style={styles.flagLabel}>{chat.flag_label}</Text>
            </View>
          )}
        </View>
        <View style={styles.riskContainer}>
          <Text
            style={[
              styles.riskLevel,
              {color: getRiskLevelColor(chat.risk_level)},
            ]}>
            {chat.risk_level.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={Object.entries(chats)}
      renderItem={renderChatItem}
      keyExtractor={([number]) => number}
      ItemSeparatorComponent={Separator}
    />
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 16,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
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
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default ChatList;
