"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptSecret = void 0;
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
async function encryptSecret(secret, key) {
    await libsodium_wrappers_1.default.ready;
    const binkey = libsodium_wrappers_1.default.from_base64(key, libsodium_wrappers_1.default.base64_variants.ORIGINAL);
    const binsec = libsodium_wrappers_1.default.from_string(secret);
    // Encrypt the secret using libsodium
    const encBytes = libsodium_wrappers_1.default.crypto_box_seal(binsec, binkey);
    // Convert the encrypted Uint8Array to Base64
    return libsodium_wrappers_1.default.to_base64(encBytes, libsodium_wrappers_1.default.base64_variants.ORIGINAL);
}
exports.encryptSecret = encryptSecret;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jcnlwdFNlY3JldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9mZWF0dXJlcy9hbmFseXNpcy9zY20vZ2l0aHViL2VuY3J5cHRTZWNyZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNEVBQXVDO0FBRWhDLEtBQUssVUFBVSxhQUFhLENBQ2pDLE1BQWMsRUFDZCxHQUFXO0lBRVgsTUFBTSw0QkFBTSxDQUFDLEtBQUssQ0FBQTtJQUVsQixNQUFNLE1BQU0sR0FBRyw0QkFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsNEJBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDdkUsTUFBTSxNQUFNLEdBQUcsNEJBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFekMscUNBQXFDO0lBQ3JDLE1BQU0sUUFBUSxHQUFHLDRCQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUV2RCw2Q0FBNkM7SUFDN0MsT0FBTyw0QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsNEJBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDcEUsQ0FBQztBQWRELHNDQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvZGl1bSBmcm9tICdsaWJzb2RpdW0td3JhcHBlcnMnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbmNyeXB0U2VjcmV0KFxuICBzZWNyZXQ6IHN0cmluZyxcbiAga2V5OiBzdHJpbmdcbik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGF3YWl0IHNvZGl1bS5yZWFkeVxuXG4gIGNvbnN0IGJpbmtleSA9IHNvZGl1bS5mcm9tX2Jhc2U2NChrZXksIHNvZGl1bS5iYXNlNjRfdmFyaWFudHMuT1JJR0lOQUwpXG4gIGNvbnN0IGJpbnNlYyA9IHNvZGl1bS5mcm9tX3N0cmluZyhzZWNyZXQpXG5cbiAgLy8gRW5jcnlwdCB0aGUgc2VjcmV0IHVzaW5nIGxpYnNvZGl1bVxuICBjb25zdCBlbmNCeXRlcyA9IHNvZGl1bS5jcnlwdG9fYm94X3NlYWwoYmluc2VjLCBiaW5rZXkpXG5cbiAgLy8gQ29udmVydCB0aGUgZW5jcnlwdGVkIFVpbnQ4QXJyYXkgdG8gQmFzZTY0XG4gIHJldHVybiBzb2RpdW0udG9fYmFzZTY0KGVuY0J5dGVzLCBzb2RpdW0uYmFzZTY0X3ZhcmlhbnRzLk9SSUdJTkFMKVxufVxuIl19