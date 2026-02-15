import { BskyAgent } from "npm:@atproto/api@0.12.0";
import { decrypt } from "./token-crypto.ts";

export class BlueskyService {
  private readonly agent: BskyAgent;

  constructor(private readonly handle: string, private readonly decryptedAppPassword: string) {
    this.agent = new BskyAgent({ service: "https://bsky.social" });
  }

  static async fromEncrypted(handle: string, encryptedPassword: string) {
    const password = await decrypt(encryptedPassword);
    return new BlueskyService(handle, password);
  }

  async init() {
    await this.agent.login({
      identifier: this.handle,
      password: this.decryptedAppPassword
    });
  }

  async publishPost(content: string) {
    await this.init();
    const response = await this.agent.post({
      text: content,
      createdAt: new Date().toISOString()
    });
    return { uri: response.uri, cid: response.cid };
  }

  async getLikesCount(uri: string) {
    await this.init();
    const thread = await this.agent.getPostThread({ uri });
    const post = (thread.data.thread as { post?: { likeCount?: number } })?.post;
    return post?.likeCount ?? 0;
  }

  async replyToPost(uri: string, cid: string, content: string) {
    await this.init();
    const response = await this.agent.post({
      text: content,
      createdAt: new Date().toISOString(),
      reply: {
        root: { uri, cid },
        parent: { uri, cid }
      }
    });
    return { uri: response.uri };
  }
}
