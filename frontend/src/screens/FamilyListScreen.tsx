import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import FamilyList from '../features/Family/FamilyList';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyList'>;

const FamilyListScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FamilyList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default FamilyListScreen;
