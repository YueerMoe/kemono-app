import {Service} from "./service.ts";

export interface Announcement{
    user_id: string;
    hash: string;
    content: string;
    added: string;
    published: string | null;
    service: Service;
}