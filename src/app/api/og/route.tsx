import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerName = searchParams.get('name') || 'Proprietário';
    const propertyCount = searchParams.get('count') || '0';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
            backgroundImage: 'linear-gradient(to bottom right, #1E40AF, #0F172A)',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-0.05em',
              }}
            >
              Lugo
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 80px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 20,
                maxWidth: '900px',
              }}
            >
              Imóveis de {ownerName}
            </div>
            <div
              style={{
                fontSize: 32,
                color: '#94A3B8',
                marginBottom: 40,
              }}
            >
              {propertyCount} {propertyCount === '1' ? 'imóvel disponível' : 'imóveis disponíveis'}
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#CBD5E1',
                backgroundColor: '#1E293B',
                padding: '16px 32px',
                borderRadius: 12,
              }}
            >
              Aluguel direto com o proprietário
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
