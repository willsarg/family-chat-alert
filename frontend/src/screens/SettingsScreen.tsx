import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import SettingsList from '../features/Settings/SettingsList';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SettingsScreen;
