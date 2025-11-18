import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GitPayWidget – Simple payments for GitHub Pages';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Dynamic OG image with brand gradient + logo text.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>GitPayWidget</div>
        <div style={{ fontSize: 32, marginTop: 16, opacity: 0.9 }}>
          Accept payments on GitHub Pages with a single script tag
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
