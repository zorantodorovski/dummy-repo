import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
}>;

export function Button({ children, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ backgroundColor: '#2563eb', borderRadius: 8, padding: 12 }}
    >
      <Text style={{ color: '#ffffff', textAlign: 'center' }}>{children}</Text>
    </Pressable>
  );
}
