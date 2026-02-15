import { decrypt } from "./token-crypto.ts";

const base = "https://api.linkedin.com";

export class LinkedInService {
  constructor(private readonly decryptedAccessToken: string) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.decryptedAccessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    };
  }

  async getMyUrn() {
    const response = await fetch(`${base}/v2/userinfo`, {
      headers: {
        Authorization: `Bearer ${this.decryptedAccessToken}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch LinkedIn user profile");
    }
    const payload = await response.json();
    return `urn:li:person:${payload.sub}`;
  }

  async publishPost(content: string, authorUrn: string) {
    const response = await fetch(`${base}/v2/ugcPosts`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE"
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
      })
    });

    if (!response.ok) {
      throw new Error("LinkedIn publish failed");
    }

    const location = response.headers.get("x-restli-id") ?? "";
    return { id: location };
  }

  async getPostEngagement(postUrn: string) {
    const response = await fetch(`${base}/v2/socialActions/${encodeURIComponent(postUrn)}`, {
      headers: this.headers()
    });
    if (!response.ok) {
      throw new Error("Could not fetch LinkedIn engagement");
    }
    const payload = await response.json();
    return {
      likes: payload?.likesSummary?.totalLikes ?? 0,
      comments: payload?.commentsSummary?.totalFirstLevelComments ?? 0
    };
  }

  async addComment(postUrn: string, content: string, authorUrn: string) {
    const response = await fetch(`${base}/v2/socialActions/${encodeURIComponent(postUrn)}/comments`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        actor: authorUrn,
        message: {
          text: content
        }
      })
    });
    if (!response.ok) {
      throw new Error("LinkedIn comment failed");
    }
    const payload = await response.json();
    return { id: payload?.id ?? "" };
  }

  static async fromEncrypted(encryptedToken: string) {
    const token = await decrypt(encryptedToken);
    return new LinkedInService(token);
  }

  static async refreshToken(encryptedRefresh: string) {
    const refreshToken = await decrypt(encryptedRefresh);
    const clientId = Deno.env.get("LINKEDIN_CLIENT_ID");
    const clientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new Error("Missing LinkedIn client credentials");
    }

    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    if (!response.ok) {
      throw new Error("LinkedIn refresh failed");
    }

    return (await response.json()) as { access_token: string; refresh_token?: string; expires_in?: number };
  }
}
