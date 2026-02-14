export class WorkerBlueskyService {
  constructor(private readonly appPassword: string) {}

  async publish(content: string, mediaUrls: string[]) {
    return { id: "bsky-post-id", content, mediaUrls, secretPreview: this.appPassword.slice(0, 4) };
  }

  async getEngagement(platformPostId: string) {
    return { platformPostId, likes: 0, comments: 0, reposts: 0 };
  }

  async reply(platformPostId: string, content: string) {
    return { platformPostId, replyId: "bsky-reply-id", content };
  }

  async refreshToken(refreshToken: string) {
    return { accessToken: this.appPassword, refreshToken };
  }
}

