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
import {AppDispatch, store} from './src/store';
import {evaluateAndAddMessage} from './src/store/slices/chatSlice';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
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
      console.log('SMS permission granted, setting up listener');
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        async message => {
          console.log('SMS received:', message);
          try {
            const {messageBody, senderPhoneNumber} = JSON.parse(message);

            await dispatch(
              evaluateAndAddMessage({
                number: senderPhoneNumber,
                message: messageBody,
              }),
            );
            console.log('Message evaluation dispatched');
          } catch (error) {
            console.error('Error handling SMS:', error);
          }
        },
      );

      return () => {
        console.log('Cleaning up SMS listener');
        subscriber.remove();
      };
    } else {
      console.log('SMS permission not granted:', receiveSmsPermission);
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
