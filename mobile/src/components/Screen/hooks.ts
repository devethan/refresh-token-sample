import {
  HttpAccessTokenExpiredError,
  HttpInvalidAccessTokenError,
  HttpInvalidRefreshTokenError,
  HttpRefreshTokenExpiredError,
} from '../../libs/api/errors';
import {useCallback} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

export function useHandleError() {
  const navigation = useNavigation();

  return useCallback((error: Error) => {
    console.debug('⚠️ Catch an error on the component', error.name);

    if (error instanceof HttpAccessTokenExpiredError) {
      // Handler error
      Alert.alert('Please authenticate again');
      navigation.dispatch(StackActions.replace('SignIn'));
    } else if (error instanceof HttpInvalidAccessTokenError) {
      // Handler error
      Alert.alert('Please authenticate again');
      navigation.dispatch(StackActions.replace('SignIn'));
    } else if (error instanceof HttpRefreshTokenExpiredError) {
      // Handler error
      navigation.dispatch(StackActions.replace('SignIn'));
      Alert.alert('Please authenticate again');
    } else if (error instanceof HttpInvalidRefreshTokenError) {
      // Handler error
      navigation.dispatch(StackActions.replace('SignIn'));
      Alert.alert('Please authenticate again');
    } else {
      // Define more errors
    }
  }, []);
}
