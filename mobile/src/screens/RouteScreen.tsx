import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {UserRepository} from '../repositories';
import {HttpErrorCodeEnum} from '../libs/api/errors';

export function RouteScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // fetch user data and change authenticated state
    new UserRepository()
      .fetchProfile()
      .then(res => {
        navigation.dispatch(StackActions.replace('Main'));
      })
      .catch(error => {
        const errorCode = error?.constructor?.name;
        console.debug('⚠️ Catch an error on the component', errorCode);
        switch (errorCode) {
          case HttpErrorCodeEnum.REFRESH_TOKEN_EXPIRED:
            Alert.alert('Please authenticate again');
          case HttpErrorCodeEnum.INVALID_ACCESS_TOKEN:
          case HttpErrorCodeEnum.ACCESS_TOKEN_EXPIRED:
          case HttpErrorCodeEnum.INVALID_REFRESH_TOKEN:
          default:
            navigation.dispatch(StackActions.replace('SignIn'));
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text>Loading...</Text>
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
