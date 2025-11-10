import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 必要な設定だけ書く
  typescript: {
    ignoreBuildErrors: false, // 型エラーを無視しない場合
  },
  // experimental や swcMinify は削除
};

export default nextConfig;
