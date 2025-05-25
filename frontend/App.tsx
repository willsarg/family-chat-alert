/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, PermissionsAndroid} from 'react-native';
import 'react-native-gesture-handler';
import {Provider, useDispatch} from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import {store} from './src/store';
import {addMessage} from './src/store/slices/chatSlice';

const AppContent = () => {
  const dispatch = useDispatch();
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  const requestSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setReceiveSmsPermission(permission);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestSmsPermission();
  }, []);

  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const {messageBody, senderPhoneNumber} = JSON.parse(message);
          dispatch(
            addMessage({
              number: senderPhoneNumber,
              message: {
                message: messageBody,
                timestamp: new Date().toISOString(),
              },
            }),
          );
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  }, [receiveSmsPermission, dispatch]);

  return <AppNavigator />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
