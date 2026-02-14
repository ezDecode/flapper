import CryptoJS from "crypto-js";

const key = process.env.TOKEN_ENCRYPTION_KEY ?? "dev-token-encryption-key";

export const tokenService = {
  encrypt(value: string) {
    return CryptoJS.AES.encrypt(value, key).toString();
  },
  decrypt(encrypted: string) {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

