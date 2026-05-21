/**
 * lib/stripe.ts — Stripe クライアントとプラン定義
 *
 * Stripe はオンライン決済を簡単に実装できるサービスです。
 * このファイルで Stripe の初期設定と、販売するプランの一覧を定義します。
 */

import Stripe from "stripe";

// Stripe クライアントの初期化（サーバー側でのみ使う）
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ==============================
// プランの定義
// ==============================
export const PLANS = [
  {
    id: "10credits_intro",
    name: "初回限定 10クレジット",
    credits: 10,
    priceId: process.env.STRIPE_PRICE_10_INTRO!,
    description: "初めての方だけのお得なパック",
    badge: "初回限定",
    isOneTime: true,
  },
  {
    id: "10credits",
    name: "10クレジット",
    credits: 10,
    priceId: process.env.STRIPE_PRICE_10!,
    description: "少しだけ試したい方に",
    badge: null,
    isOneTime: false,
  },
  {
    id: "25credits",
    name: "25クレジット",
    credits: 25,
    priceId: process.env.STRIPE_PRICE_25!,
    description: "まずはお手軽に始めたい方に",
    badge: "人気",
    isOneTime: false,
  },
  {
    id: "100credits",
    name: "100クレジット",
    credits: 100,
    priceId: process.env.STRIPE_PRICE_100!,
    description: "まとめて使いたい方に",
    badge: null,
    isOneTime: false,
  },
  {
    id: "300credits",
    name: "300クレジット",
    credits: 300,
    priceId: process.env.STRIPE_PRICE_300!,
    description: "大量に使う方・チーム利用に",
    badge: "お得",
    isOneTime: false,
  },
] as const;

// priceId からプランを検索するヘルパー関数
export function getPlanByPriceId(priceId: string) {
  return PLANS.find((plan) => plan.priceId === priceId) ?? null;
}
