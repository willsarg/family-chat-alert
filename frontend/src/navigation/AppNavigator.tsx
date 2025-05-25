import {faCog, faComments, faUsers} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootStackParamList, RootTabParamList} from './types';

// Screens
import ChatMessage from '../features/Chats/ChatMessage';
import ChatListScreen from '../screens/ChatListScreen';
import FamilyListScreen from '../screens/FamilyListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{title: 'Chats'}}
      />
      <Stack.Screen
        name="ChatMessage"
        component={ChatMessage}
        options={({route}) => ({
          title: route.params.number,
        })}
      />
    </Stack.Navigator>
  );
};

const FamilyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="FamilyList"
        component={FamilyListScreen}
        options={{title: 'Family Members'}}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Stack.Navigator>
  );
};

const ChatIcon = ({color, size}: {color: string; size: number}) => (
  <FontAwesomeIcon icon={faComments} size={size} color={color} />
);

const FamilyIcon = ({color, size}: {color: string; size: number}) => (
  <FontAwesomeIcon icon={faUsers} size={size} color={color} />
);

const SettingsIcon = ({color, size}: {color: string; size: number}) => (
  <FontAwesomeIcon icon={faCog} size={size} color={color} />
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#f4511e',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}>
        <Tab.Screen
          name="ChatTab"
          component={ChatStack}
          options={{
            title: 'Chats',
            tabBarIcon: ChatIcon,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="FamilyTab"
          component={FamilyStack}
          options={{
            title: 'Family',
            tabBarIcon: FamilyIcon,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{
            title: 'Settings',
            tabBarIcon: SettingsIcon,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
