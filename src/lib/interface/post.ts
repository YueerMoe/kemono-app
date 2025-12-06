import {Service} from "./service.ts";

export interface PostAttachment {
    name: string,
    path: string,
}

interface FileInfo {
    name: string;
    path: string;
}

export interface Preview {
    type: string,
    server: string,
    name: string,
    path: string
}

export interface Attachment {
    index: number,
    path: string,
    name: string,
    extension: string,
    name_extension: string,
    server: string
}

export interface Video extends Attachment {}

export interface Post {
    id: string;
    title: string;
    user: string;
    published: string;
    service: Service;
    'substring': string;
    file: FileInfo;
    attachments: PostAttachment[];
}