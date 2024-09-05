# 学習記録アプリ

## アプリ紹介
Reactの勉強のため、作成した学習時間記録アプリです。  
DBはsupabaseを利用しております。  
主な機能としては、学習の内容と学習時間を記録すること。  
勉強時間の合計を表示します。

## 環境設定の方法
template.envをコピーし、.envにリネームしてください
以下.envの内容を編集してください
```.env
VITE_SUPABASE_URL=<SUPABASEの管理画面で取得したURL>
VITE_SUPABASE_KEY=<SUPABASEの管理画面で取得したキー>
```

## ローカル環境起動の仕方
```bash
npm install
npm run dev
```

## テスト
```bash
npm run test
```

## バージョン
node v20.15.0  
npm 10.7.0
