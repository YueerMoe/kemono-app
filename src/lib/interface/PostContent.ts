import {Service} from "./service.ts";

interface PostFile {
    name: string;
    path: string;
}

interface PostAttachment extends PostFile {}

interface PostEmbed {
    // 根据实际数据可能为空对象，若后续有字段可扩展
}

export interface PostContent {
    id: string;
    user: string;
    service: Service;
    title: string;
    content: string;
    embed: PostEmbed;
    shared_file: boolean;
    added: null; // 若始终为 null，可保留；若可能有值，改为 Date | null
    published: string; // ISO 8601 字符串，如 "2024-12-15T10:00:00"
    edited: string;    // ISO 8601 字符串，如 "2025-06-10T15:43:33"
    file: PostFile;
    attachments: PostAttachment[];
    poll: null; // 若始终为 null
    captions: null; // 若始终为 null
    tags: string[]; // 空数组，但元素是字符串
    incomplete_rewards: null; // 若始终为 null
    next: string; // 下一篇 ID（字符串）
    prev: string; // 上一篇 ID（字符串）
}