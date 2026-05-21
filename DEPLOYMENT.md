# デプロイ手順書

## 概要
このドキュメントは、プレゼン添削AI を本番環境にデプロイするための手順を説明します。

---

## ステップ 1: Vercel で環境変数を設定

現在のデプロイ URL: https://presentation-review.vercel.app

### Vercel ダッシュボードでの設定

1. **Vercel ダッシュボードを開く**
   - https://vercel.com/dashboard にアクセス
   - 「presentation-review」プロジェクトをクリック

2. **Settings → Environment Variables を開く**
   - 画面左側の「Settings」をクリック
   - 「Environment Variables」を選択

3. **以下の環境変数を設定**

| 環境変数名 | 値 | 説明 |
|-----------|-----|------|
| `NEXT_PUBLIC_BASE_URL` | `https://presentation-review.vercel.app` | テスト用。ドメイン接続後は `https://presentation-review.com` に変更 |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |
| `STRIPE_SECRET_KEY` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |
| `STRIPE_WEBHOOK_SECRET` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |
| `STRIPE_PRICE_*` | `.env.local` の各価格ID | 既に設定済みの場合はスキップ |
| `RESEND_API_KEY` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `.env.local` から同じ値をコピー | 既に設定済みの場合はスキップ |

4. **各項目を入力して「Save」をクリック**

### 重要なポイント

- **秘密キー（STRIPE_SECRET_KEY など）は必ず Vercel で設定してください**
- ローカルの `.env.local` ファイルは .gitignore に含まれているため、自動的には Vercel に送られません
- 環境変数を変更した後、**自動的に再デプロイが実行されます**

---

## ステップ 2: DNS 設定（ドメイン接続）

既に `/dashboard/delete-confirmation?token=xxx` ページで DNS 設定が完了している場合は、このステップをスキップしてください。

### Vercel でドメインを確認

1. **Vercel ダッシュボード → Settings → Domains**
2. ドメイン `presentation-review.com` の状態を確認
3. **✓ Valid Configuration** と表示されれば接続完了

### Xdomain で DNS 設定を確認

1. **Xdomain ダッシュボード → ドメイン管理ツール**
2. **presentation-review.com** の DNS 設定に以下が登録されているか確認

```
ホスト名: .presentation-review.com
種別: A
内容: 216.198.79.1
TTL: 3600
```

### ドメイン接続後の NEXT_PUBLIC_BASE_URL 更新

ドメイン接続が完了したら、Vercel の環境変数を更新してください：

1. **Vercel → Settings → Environment Variables**
2. **NEXT_PUBLIC_BASE_URL** を更新
   - 現在の値: `https://presentation-review.vercel.app`
   - 新しい値: `https://presentation-review.com`
3. **Save** をクリック（自動再デプロイが実行されます）

---

## ステップ 3: メール送信の設定（オプション）

### テスト段階（現在）

現在のメール送信は Resend のテストモードで動作しており、以下のアドレスから送信されます：
- アカウント削除確認: `プレゼン添削AI <noreply@resend.dev>`
- 添削完了通知: `プレゼン添削AI <onboarding@resend.dev>`

**テスト環境では、登録したメールアドレスにのみメールが届きます。**

### 本番環境でのセットアップ（後日）

1. **Resend でドメイン認証を完了**
   - https://resend.com にログイン
   - Domains → Add Domain で `presentation-review.com` を追加
   - DNS レコードを追加してドメインを認証

2. **認証完了後、コードを更新**
   ```typescript
   from: "プレゼン添削AI <noreply@presentation-review.com>"
   ```

---

## ステップ 4: Stripe 本番化（最後の段階）

### ⚠️ 本番前に実行しないでください

現在、Stripe はテストモード（`sk_test_...`）で動作しています。

**本番化の手順（実装後）：**

1. Stripe ダッシュボード → 本番キーを取得
2. Vercel → Settings → Environment Variables
3. `STRIPE_SECRET_KEY` をテストキーから本番キー（`sk_live_...`）に変更
4. 保存（自動再デプロイ）

---

## トラブルシューティング

### メールが届かない場合

1. **テスト環境の制限を確認**
   - Resend テストモードでは、Resend ダッシュボードで登録したメールアドレスにのみ届きます
   - コマンドラインで確認したアドレスを試してください

2. **迷惑メールフォルダをチェック**
   - Gmail、Outlook などの迷惑メール対策で誤分類されている可能性

3. **環境変数が正しく設定されているか確認**
   - Vercel → Deployments → 最新のデプロイをクリック
   - 「Environment Variables」タブで設定値を確認

### ドメイン接続できない場合

1. **DNS が反映されるまで待つ**
   - DNS キャッシュが更新されるまで 5～30 分かかることがあります
   - 数分待ってから Vercel で再確認してください

2. **Xdomain の DNS 設定を確認**
   - 正しいレコードが追加されているか確認
   - レコード内容をコピーペーストで確認（手入力のタイプミスがないか）

---

## デプロイ完了チェックリスト

- [ ] Vercel で `NEXT_PUBLIC_BASE_URL` を `https://presentation-review.vercel.app` に設定
- [ ] ドメイン接続が完了（DNS 設定、Vercel で Valid Configuration）
- [ ] 環境変数が全て設定済み（Settings → Environment Variables で確認）
- [ ] ブラウザで https://presentation-review.com にアクセスしてサイトが表示される
- [ ] サインアップ → ログイン → 添削 → 料金購入 まで一通りテストして動作確認

---

## 本番化の最終チェック

- [ ] Stripe を本番モードに切り替え
- [ ] Resend でドメイン認証を完了
- [ ] メール送信元を本番ドメインに変更
- [ ] 全機能を本番環境でテスト
