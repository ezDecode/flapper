const encoder = new TextEncoder();
const decoder = new TextDecoder();

function hexToBytes(hex: string) {
  if (hex.length !== 64) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes hex (64 chars)");
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getKey() {
  const keyHex = Deno.env.get("TOKEN_ENCRYPTION_KEY");
  if (!keyHex) {
    throw new Error("Missing TOKEN_ENCRYPTION_KEY");
  }
  return crypto.subtle.importKey("raw", hexToBytes(keyHex), "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plaintext));
  const payload = new Uint8Array(iv.length + encrypted.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(encrypted), iv.length);
  return bytesToBase64(payload);
}

export async function decrypt(encryptedText: string): Promise<string> {
  const key = await getKey();
  const payload = base64ToBytes(encryptedText);
  const iv = payload.slice(0, 12);
  const ciphertext = payload.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return decoder.decode(decrypted);
}
