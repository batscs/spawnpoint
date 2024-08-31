import crypto from "crypto";
import {strict} from "node:assert";

type TokenEntry = {
    token: string;
    timestamp: number; // store timestamp in milliseconds
};

export default class Authentication {
    // Store tokens in a Set. The Set will store objects of type TokenEntry
    private static tokenSet: Set<TokenEntry> = new Set();

    static generateToken(): string {
        // Generate a new token
        const token : string = crypto.randomUUID();

        // Get the current timestamp
        const now : number = Date.now();

        // Add the token and timestamp to the Set
        this.tokenSet.add({ token, timestamp: now });

        // Clean up tokens older than 14 days
        this.cleanupOldTokens();

        return token;
    }

    static authenticateToken(token: string): boolean {

        // Iterate through the Set and check if the token exists
        for (let entry of this.tokenSet) {
            if (entry.token === token) {
                return true; // Token is valid
            }
        }

        // If the token was not found, return false
        return false;
    }

    static verifyPassword(password: string): boolean {
        // TODO DB verwenden um password zu prüfen
        return true;
    }

    private static cleanupOldTokens(): void {
        const expiration = 14 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const maxTimestamp = now + expiration;

        // Iterate through the Set and remove tokens older than 14 days
        for (let entry of this.tokenSet) {
            if (entry.timestamp > maxTimestamp) {
                this.tokenSet.delete(entry);
            }
        }
    }
}
