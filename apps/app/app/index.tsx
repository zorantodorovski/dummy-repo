import { LandingPage, type LandingPageData } from '@repo/shared';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

const cmsUrl = process.env.EXPO_PUBLIC_CMS_URL ?? 'http://localhost:3001';

export default function HomeScreen() {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${cmsUrl}/api/globals/landing-page`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json() as Promise<LandingPageData>;
      })
      .then(setData)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
      {data ? <LandingPage data={data} /> : null}
      {error ? <Text>Unable to load content: {error}</Text> : null}
      {!data && !error ? <ActivityIndicator /> : null}
    </ScrollView>
  );
}
