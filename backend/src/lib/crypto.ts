// import crypto from "crypto";

// export class Crypto {
//   /**
//    * Generate a cryptographically secure random token.
//    */
//   static randomToken(size = 64): string {
//     return crypto.randomBytes(size).toString("hex");
//   }

//   /**
//    * SHA-256 hash.
//    */
//   static sha256(value: string): string {
//     return crypto.createHash("sha256").update(value).digest("hex");
//   }
// }


// Inside src/lib/crypto.ts
import crypto from "crypto";

export class Crypto {
  static randomToken(size = 64): string {
    return crypto.randomBytes(size).toString("hex");
  }

  /**
   * SHA-256 hash with runtime argument defense checking.
   */
  static sha256(value: string): string {
    // ✅ FIXED: Explicit fallback to intercept undefined/null input variants
    if (!value) {
      throw new Error("CryptoError: Cannot compute hash string for undefined or empty data.");
    }
    return crypto.createHash("sha256").update(value).digest("hex");
  }
}