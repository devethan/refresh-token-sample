import {StyleSheet, View} from 'react-native';
import {ReactNode} from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {useHandleError} from './hooks';

interface IProps {
  children: ReactNode;
}

export function Screen({children}: IProps) {
  const handleError = useHandleError();
  return (
    <ErrorBoundary onError={handleError}>
      <View style={styles.container}>{children}</View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {},
});
