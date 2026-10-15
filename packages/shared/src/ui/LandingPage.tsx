import { Text, View } from 'react-native';

import type { LandingPageData } from '../types';
import { Button } from './Button';

type LandingPageProps = {
  data: LandingPageData;
  onCallToActionPress?: () => void;
};

export function LandingPage({ data, onCallToActionPress }: LandingPageProps) {
  const { hero, features } = data;

  return (
    <View style={{ gap: 16 }}>
      <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '700' }}>
        {hero.heading}
      </Text>
      <Text style={{ fontSize: 16 }}>{hero.subheading}</Text>
      {hero.callToActionText ? (
        <Button onPress={onCallToActionPress}>{hero.callToActionText}</Button>
      ) : null}
      {(features ?? []).map((feature, index) => (
        <View key={feature.id ?? index} style={{ gap: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            {feature.title}
            {feature.badge ? ` · ${feature.badge}` : ''}
          </Text>
          <Text>{feature.description}</Text>
        </View>
      ))}
    </View>
  );
}
