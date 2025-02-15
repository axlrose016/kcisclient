import { IUserData } from "@/components/interfaces/iuser";

export {}

export type SessionPayload = {
    id: string;
    userData: IUserData[];
    sessionExpiration: Date;
}
