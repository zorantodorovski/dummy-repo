import { Button, formatGreeting, type AppMetadata } from '@repo/shared';
import { Text, View } from 'react-native';

const appMetadata: AppMetadata = {
  name: 'Dummy App',
  version: '1.0.0',
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text>{formatGreeting(appMetadata.name)}</Text>
      <Text>Version {appMetadata.version}</Text>
      <Button>Get started</Button>
    </View>
  );
}
