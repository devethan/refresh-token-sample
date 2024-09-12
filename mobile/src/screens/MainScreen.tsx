import {Button, StyleSheet, View} from 'react-native';
import React from 'react';
import {AuthRepository} from '../repositories';
import {StackActions, useNavigation} from '@react-navigation/native';
import {Screen} from '../components';

export function MainScreen() {
  const navigation = useNavigation();
  const handleSignOut = async () => {
    try {
      await new AuthRepository().signOut();
      navigation.dispatch(StackActions.replace('Route'));
    } catch (e) {
      // Handle errors in locally
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View>
          <Button
            title={'Go to Protected Screen'}
            onPress={() => navigation.navigate('Protected')}
          />
          <Button title={'Sign Out'} onPress={handleSignOut} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
