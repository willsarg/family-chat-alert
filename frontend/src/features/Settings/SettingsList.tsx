import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../navigation/types';
import {RootState} from '../../store';
import {
  addApprovedNumber,
  removeApprovedNumber,
  updateApprovedNumber,
} from '../../store/slices/settingsSlice';
import type {ApprovedNumber} from '../../store/slices/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsList: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const route = useRoute<Props['route']>();
  const navigation = useNavigation<Props['navigation']>();
  const approvedNumbers = useSelector(
    (state: RootState) => state.settings.approvedNumbers,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNumber, setEditingNumber] = useState<ApprovedNumber | null>(
    null,
  );
  const [formData, setFormData] = useState({name: '', number: ''});
  const [smsPermission, setSmsPermission] = useState<string>('');

  // Handle pre-filled number from navigation
  useEffect(() => {
    const addApprovedNumberParams = route.params?.addApprovedNumber;
    if (addApprovedNumberParams?.showModal) {
      setFormData(prev => ({
        ...prev,
        number: addApprovedNumberParams.number,
      }));
      setModalVisible(true);
      // Clear the navigation params after using them
      navigation.setParams({addApprovedNumber: undefined});
    }
  }, [route.params, navigation]);

  const checkSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setSmsPermission(permission ? 'granted' : 'denied');
    } catch (err) {
      console.log(err);
      setSmsPermission('error');
    }
  };

  React.useEffect(() => {
    checkSmsPermission();
  }, []);

  const requestSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setSmsPermission(permission);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.number.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingNumber) {
      dispatch(
        updateApprovedNumber({
          ...editingNumber,
          name: formData.name,
          number: formData.number,
        }),
      );
    } else {
      dispatch(addApprovedNumber(formData));
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingNumber(null);
    setFormData({name: '', number: ''});
  };

  const handleEdit = (number: ApprovedNumber) => {
    setEditingNumber(number);
    setFormData({name: number.name, number: number.number});
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Approved Number',
      'Are you sure you want to remove this number?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(removeApprovedNumber(id)),
        },
      ],
    );
  };

  const renderItem = ({item}: {item: ApprovedNumber}) => (
    <View style={styles.numberItem}>
      <View style={styles.numberInfo}>
        <Text style={styles.numberName}>{item.name}</Text>
        <Text style={styles.numberValue}>{item.number}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.permissionSection}>
        <Text style={styles.sectionTitle}>SMS Permission Status</Text>
        <View style={styles.permissionStatus}>
          <Text style={styles.permissionText}>
            Status: {smsPermission || 'checking...'}
          </Text>
          {smsPermission !== 'granted' && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestSmsPermission}>
              <Text style={styles.buttonText}>Request Permission</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.approvedNumbersSection}>
        <Text style={styles.sectionTitle}>Approved Numbers</Text>
        <FlatList
          data={approvedNumbers}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No approved numbers added yet</Text>
          }
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Approved Number</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingNumber ? 'Edit Approved Number' : 'Add Approved Number'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={text =>
                setFormData(prev => ({...prev, name: text}))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.number}
              onChangeText={text =>
                setFormData(prev => ({...prev, number: text}))
              }
              keyboardType="phone-pad"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                  {editingNumber ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  permissionSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  approvedNumbersSection: {
    flex: 1,
    padding: 16,
  },
  numberItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberInfo: {
    flex: 1,
  },
  numberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  numberValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 'auto',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsList;
