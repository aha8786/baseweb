/** @type {import('next').NextConfig} */
const config = {
  images: {
    // 모든 외부 이미지 허용 (보안보다 사용성 우선)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 도메인 허용
      },
      {
        protocol: 'http',
        hostname: '**', // 모든 HTTP 도메인 허용
      },
    ],
    // 기존 domains 설정도 유지 (하위 호환성)
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'imgur.com',
      'i.imgur.com',
      'cdn.pixabay.com',
      'images.pexels.com',
      'via.placeholder.com',
      'picsum.photos',
    ],
  },
}

export default config
