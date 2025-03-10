import { IUserData } from "@/components/interfaces/iuser";

export {}

export type SessionPayload = {
    id: string;
    userData: IUserData;
    sessionExpiration: Date;
}

export type CombinedData = {
    [key: string]: any; // This allows any key with any value
};

export type ConfirmSave = () => void;
