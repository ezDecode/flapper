import { TwitterApi } from "npm:twitter-api-v2@1.17.0";
import { decrypt } from "./token-crypto.ts";

const apiBase = "https://api.twitter.com/2";

export class TwitterService {
  private client: TwitterApi;

  constructor(decryptedAccessToken: string) {
    this.client = new TwitterApi(decryptedAccessToken);
  }

  static async fromEncrypted(encryptedToken: string) {
    const token = await decrypt(encryptedToken);
    return new TwitterService(token);
  }

  async publishTweet(content: string) {
    const response = await this.client.v2.tweet(content);
    return {
      id: response.data.id,
      url: `https://twitter.com/i/web/status/${response.data.id}`
    };
  }

  async getTweetMetrics(tweetId: string) {
    const bearer = Deno.env.get("TWITTER_BEARER_TOKEN");
    const token = bearer ? bearer : this.client.getActiveTokens().accessToken;
    const response = await fetch(`${apiBase}/tweets/${tweetId}?tweet.fields=public_metrics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const payload = await response.json();
    const metrics = payload?.data?.public_metrics ?? {};
    return {
      likes: metrics.like_count ?? 0,
      reposts: metrics.retweet_count ?? 0,
      comments: metrics.reply_count ?? 0
    };
  }

  async replyToTweet(tweetId: string, content: string) {
    const response = await this.client.v2.reply(content, tweetId);
    return { id: response.data.id };
  }

  static async refreshTokens(encryptedRefresh: string) {
    const refreshToken = await decrypt(encryptedRefresh);
    const clientId = Deno.env.get("TWITTER_CLIENT_ID");
    const clientSecret = Deno.env.get("TWITTER_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new Error("Missing Twitter client credentials");
    }

    const basic = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error("Twitter token refresh failed");
    }

    return (await response.json()) as { access_token: string; refresh_token?: string; expires_in?: number };
  }
}
