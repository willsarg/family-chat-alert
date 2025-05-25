import {faCheckCircle, faFlag} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootStackParamList} from '../../navigation/types';
import type {RootState} from '../../store';
import {selectIsNumberApproved} from '../../store/slices/settingsSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatMessage'>;

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

const ChatMessage: React.FC<Props> = ({route, navigation}) => {
  const {number} = route.params;
  const chat = useSelector((state: RootState) => state.chat[number]);
  const isApproved = useSelector((state: RootState) =>
    selectIsNumberApproved(state, number),
  );

  if (!chat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chat not found</Text>
      </View>
    );
  }

  const handleApproveNumber = () => {
    // Navigate to the SettingsTab and pass params to the initial screen (SettingsScreen)
    navigation.navigate('SettingsTab', {
      screen: 'Settings',
      params: {
        addApprovedNumber: {
          number,
          showModal: true,
        },
      },
    });
  };

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
        <View style={styles.senderInfo}>
          <Text style={styles.phoneNumber}>{number}</Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.riskLevel,
                {color: getRiskLevelColor(chat.risk_level)},
              ]}>
              {chat.risk_level.toUpperCase()}
            </Text>
            {chat.flagged && (
              <View style={styles.flagContainer}>
                <FontAwesomeIcon icon={faFlag} size={12} color="#fff" />
                <Text style={styles.flagLabel}>{chat.flag_label}</Text>
              </View>
            )}
          </View>
        </View>
        {!isApproved && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApproveNumber}>
            <FontAwesomeIcon icon={faCheckCircle} size={20} color="#4CAF50" />
            <Text style={styles.approveButtonText}>Add to Approved</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f8f8f8',
  },
  senderInfo: {
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  flagContainer: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  approveButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
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
