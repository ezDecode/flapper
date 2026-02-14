export class TwitterService {
  constructor(private readonly accessToken: string) {}

  async publish(content: string, mediaUrls: string[]) {
    return { id: "twitter-post-id", content, mediaUrls, tokenPreview: this.accessToken.slice(0, 6) };
  }

  async getEngagement(platformPostId: string) {
    return { platformPostId, likes: 0, comments: 0, reposts: 0 };
  }

  async reply(platformPostId: string, content: string) {
    return { platformPostId, replyId: "twitter-reply-id", content };
  }

  async refreshToken(refreshToken: string) {
    return { accessToken: this.accessToken, refreshToken };
  }
}

