/**
 * lib/blocked-email-domains.ts — 使い捨てメールドメインのブロックリスト
 *
 * よく使われる使い捨てメールサービスのドメインを列挙しています。
 * 新しいドメインを発見したらこのリストに追加してください。
 */

export const BLOCKED_DOMAINS = new Set([
  // Mailinator 系
  "mailinator.com",
  "mailinator2.com",
  "mailinator.net",
  "suremail.info",
  "spamherelots.com",

  // Guerrilla Mail 系
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamailblock.com",
  "grr.la",
  "sharklasers.com",
  "spam4.me",

  // 10 Minute Mail 系
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "10minemail.com",
  "10minutemail.de",

  // Temp Mail 系
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.com",
  "tempmail.net",
  "tempail.com",
  "tempr.email",
  "tempinbox.com",
  "tempinbox.co.uk",
  "mailtemp.info",
  "tmpmail.net",
  "tmpmail.org",
  "disposableemailaddresses.com",

  // Trash Mail 系
  "trashmail.com",
  "trashmail.at",
  "trashmail.io",
  "trashmail.me",
  "trashmail.net",
  "trashmail.xyz",
  "trashmailer.com",
  "trashmail.org",

  // Yopmail 系
  "yopmail.com",
  "yopmail.fr",
  "cool.fr.nf",
  "jetable.fr.nf",
  "nospam.ze.tc",
  "nomail.xl.cx",
  "mega.zik.dj",
  "speed.1s.fr",
  "courriel.fr.nf",
  "moncourrier.fr.nf",
  "monemail.fr.nf",
  "monmail.fr.nf",

  // Fake Inbox 系
  "fakeinbox.com",
  "fakeinbox.net",
  "mailin8r.com",
  "mailnull.com",
  "mailnesia.com",
  "maildrop.cc",
  "mailsac.com",
  "mailscrap.com",
  "mailnew.com",

  // Discard / Throwaway 系
  "discard.email",
  "discardmail.com",
  "discardmail.de",
  "dispostable.com",
  "throwaway.email",
  "throwam.com",

  // Spam Free 系
  "spamfree24.org",
  "spamfree24.de",
  "spamgourmet.com",
  "spamgourmet.net",
  "spamgourmet.org",
  "spamgob.com",
  "spam.la",

  // Getnada / Nada 系
  "getnada.com",
  "nadafaker.com",

  // その他よく使われるもの
  "objectmail.com",
  "pookmail.com",
  "filzmail.com",
  "zetmail.com",
  "mohmal.com",
  "inboxbear.com",
  "crazymailing.com",
  "spamfree.eu",
  "spamgob.com",
  "mytemp.email",
  "tempsky.com",
  "emailondeck.com",
  "33mail.com",
  "spamevader.com",
  "mailexpire.com",
  "throwam.com",
  "spambox.us",
  "spam.su",
  "maildx.com",
  "meltmail.com",
  "binka.me",
  "hmamail.com",
  "ownmail.net",
  "incognitomail.com",
  "incognitomail.net",
  "incognitomail.org",
  "dodgit.com",
  "jetable.com",
  "jetable.net",
  "jetable.org",
  "jetable.fr.nf",
  "sofimail.com",
  "kurzepost.de",
  "objectmail.com",
  "proxymail.eu",
  "rcpt.at",
  "trash-mail.at",
  "trashmail.at",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
]);

/**
 * メールアドレスのドメインが使い捨てかどうかを判定する
 * @returns true = ブロック対象, false = 問題なし
 */
export function isBlockedEmailDomain(email: string): boolean {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return BLOCKED_DOMAINS.has(domain);
}
