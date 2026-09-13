# 不動産管理アプリ

Supabase認証を利用した不動産管理Webアプリです。

## セットアップ

```bash
npm install
```

`.env.example` を参考に `.env` を作成し、SupabaseのProject URLとPublishable keyを設定してください。

```bash
cp .env.example .env
```

## 開発サーバー起動

```bash
npm run dev
```

## 機能

- メールアドレス＋パスワードでの会員登録・ログイン
- ログイン後は物件一覧画面(ダミーデータ)へ遷移
- 未ログイン時はログイン画面へリダイレクト
- ログアウト機能
