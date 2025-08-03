import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  
  // キャッシュバスティング用のバージョン管理
  cacheId: 'chapter4-5-update-' + Date.now(),
  
  // ランタイムキャッシュ設定
  runtimeCaching: [
    {
      urlPattern: /\//,
      handler: 'NetworkFirst', // キャッシュよりネットワークを優先
      options: {
        cacheName: 'pages-v2', // キャッシュ名を変更
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'NetworkFirst', // 変更: CacheFirst → NetworkFirst
      options: {
        cacheName: 'static-assets-v2', // キャッシュ名を変更
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-v2', // キャッシュ名を変更
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60
        }
      }
    }
  ]
})

export default pwaConfig(nextConfig)

