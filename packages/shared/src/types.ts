export interface AppMetadata {
  name: string;
  version: string;
}

export type ContentStatus = 'draft' | 'published';

export interface LandingPageFeature {
  id?: string | null;
  title: string;
  description: string;
  badge?: string | null;
}

export interface LandingPageData {
  title: string;
  hero: {
    heading: string;
    subheading: string;
    callToActionText?: string | null;
  };
  features?: LandingPageFeature[] | null;
}
