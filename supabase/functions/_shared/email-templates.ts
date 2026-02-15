type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

function wrap(content: string) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a"><h2>Flapr</h2>${content}</div>`;
}

export function postFailed(platform: string, postPreview: string, reason: string, retryUrl: string): EmailTemplate {
  const body = `<p>Your ${platform} post failed to publish.</p><p><strong>Reason:</strong> ${reason}</p><p>${postPreview}</p><p><a href="${retryUrl}">Retry in Flapr</a></p>`;
  return {
    subject: `Flapr: ${platform} post failed`,
    html: wrap(body),
    text: `Your ${platform} post failed. Reason: ${reason}. Retry: ${retryUrl}`
  };
}

export function plugFailed(platform: string, plugContent: string, reason: string): EmailTemplate {
  const body = `<p>Your auto-plug failed on ${platform}.</p><p><strong>Reason:</strong> ${reason}</p><p>${plugContent}</p>`;
  return {
    subject: `Flapr: ${platform} auto-plug failed`,
    html: wrap(body),
    text: `Your auto-plug failed on ${platform}. Reason: ${reason}.`
  };
}

export function tokenExpired(platform: string, reconnectUrl: string): EmailTemplate {
  const body = `<p>Your ${platform} connection expired.</p><p><a href="${reconnectUrl}">Reconnect ${platform} in Flapr</a></p>`;
  return {
    subject: `Flapr: reconnect your ${platform} account`,
    html: wrap(body),
    text: `Your ${platform} connection expired. Reconnect: ${reconnectUrl}`
  };
}

export function welcomeEmail(name: string): EmailTemplate {
  const body = `<p>Hi ${name || "there"},</p><p>Welcome to Flapr. Connect a platform, schedule your first post, and set your first auto-plug.</p>`;
  return {
    subject: "Welcome to Flapr",
    html: wrap(body),
    text: `Hi ${name || "there"}, welcome to Flapr.`
  };
}
