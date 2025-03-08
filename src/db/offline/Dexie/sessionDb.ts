import Dexie, { Table } from "dexie";
import { v4 as uuidv4 } from 'uuid';

// Define the structure of the session data
class SessionDB extends Dexie {
    sessions!: Table<{ id: string; session: string; createdAt: string; expiresAt: string }, string>;

    constructor() {
        super("sessionDB");
        this.version(1).stores({
            sessions: "id, session, createdAt, expiresAt", // Store session expiry time
        });
    }

    // Create or update a session
    async createSession(session:string,expiresAt:string): Promise<void> {

        await this.sessions.put({
            id: uuidv4(),
            session: session,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt,
        });
    }

    // Retrieve a session by ID
    async getSession(id: string): Promise<{ id: string; session: string; createdAt: string; expiresAt: string } | undefined> {
        return await this.sessions.get(id);
    }

    // Retrieve first session
    async getFirstSession(): Promise<{ id: string; session: string; createdAt: string; expiresAt: string } | undefined> {
        return await this.sessions.orderBy('createdAt').first();
    }

    // Delete a session by ID
    async deleteSession(id: string): Promise<void> {
        await this.sessions.delete(id);
    }

    // Clear expired sessions
    async clearExpiredSessions(): Promise<void> {
        const now = Date.now();
        const expiredSessions = await this.sessions.where("expiresAt").below(new Date(now).toISOString()).toArray();
        const expiredSessionIds = expiredSessions.map((session) => session.id);

        if (expiredSessionIds.length > 0) {
            await this.sessions.bulkDelete(expiredSessionIds);
        }
    }

    async clearAllSessions(): Promise<void> {
        const sessions = await this.sessions.toArray();
        await this.sessions.bulkDelete(sessions.map((session) => session.id));
    }
}

// Export the session database instance
export const sessionDb = new SessionDB();
