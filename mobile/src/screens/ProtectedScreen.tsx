import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {UserRepository} from '../repositories';
import {Screen} from '../components';

export function ProtectedScreen() {
  // Fetch protected data when the screen has mounted
  useEffect(() => {
    const repository = new UserRepository();
    repository.fetchTest1().then(() => console.log('✅ Success fetchTest1'));
    repository.fetchTest2().then(() => console.log('✅ Success fetchTest2'));
    repository.fetchTest3().then(() => console.log('✅ Success fetchTest3'));

    // The Root ErrorBoundary is responsible for errors in the unpredictable range for a particular API.
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        <View>
          <Text>Protected API request has sent!</Text>
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
