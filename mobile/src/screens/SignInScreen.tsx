import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {AuthRepository} from '../repositories';

export function SignInScreen() {
  const navigation = useNavigation();
  const handlePress = async () => {
    try {
      await new AuthRepository().signIn();
      navigation.dispatch(StackActions.replace('Route'));
    } catch (e) {
      // Handle errors in locally
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Button title={'Sign In and get tokens'} onPress={handlePress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
