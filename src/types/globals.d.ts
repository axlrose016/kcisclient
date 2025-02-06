import { IUserData } from "@/components/interfaces/library-interface";

export {}

export type SessionPayload = {
    id: string;
    userData: IUserData[];
    sessionExpiration: Date;
}
