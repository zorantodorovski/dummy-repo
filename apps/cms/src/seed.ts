import type { Payload } from 'payload';

export async function seedLandingPage(payload: Payload): Promise<void> {
  const existing = await payload.findGlobal({ slug: 'landing-page' });

  if (existing?.title) {
    return;
  }

  await payload.updateGlobal({
    slug: 'landing-page',
    data: {
      title: 'Welcome',
      hero: {
        heading: 'Build once, run everywhere',
        subheading: 'A dynamic landing page served live from Payload CMS.',
        callToActionText: 'Get started',
      },
      features: [
        {
          title: 'Cross-platform',
          description: 'Renders on iOS, Android and Web from one codebase.',
          badge: 'New',
        },
        {
          title: 'Editable',
          description: 'Update content in the CMS dashboard, no redeploy needed.',
        },
      ],
    },
  });
}
