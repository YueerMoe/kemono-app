// src/stores/artist.ts
import {defineStore} from 'pinia';
import {BaseDirectory, exists, mkdir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";

import {Post} from "../lib/interface/post.ts";


export interface BrowseRecord {
    post: Post;
    time: number;
}

function moveOrCreateBrowseRecordItemToFront(
    arr: BrowseRecord[],
    targetItem: BrowseRecord
): BrowseRecord[] {

    // 1. 创建数组的副本以保持不可变性
    const newArray = [...arr];

    // 2. 查找目标成员的索引，仅判断 type 和 keyword
    const index = newArray.findIndex(item =>
        item.post.id === targetItem.post.id
    );

    if (index !== -1) {
        // ========== 情况 1: 成员已存在 (移动到最前) ==========

        // 2.1: 从原位置删除该旧成员
        newArray.splice(index, 1);

        // 2.2: 将传入的 targetItem（包含最新的 time 字段）添加到最前面
        newArray.unshift(targetItem);

    } else {
        // ========== 情况 2: 成员未找到 (添加到最前) ==========

        // 使用 unshift() 将 targetItem 直接添加到数组的最前面
        newArray.unshift(targetItem);
    }

    return newArray;
}

export const useBrowseHistoryStore = defineStore('browseHistory', {
    state: () => ({
        history: [] as BrowseRecord[],
        isLoading: false,
    }),

    actions: {
        async getBrowseHistory(): Promise<BrowseRecord[] | []> {

            if (this.history.length > 0) {
                return this.history;
            }
            // 2. 避免重复加载
            if (this.isLoading) return [] as BrowseRecord[];

            this.isLoading = true;

            const fileName = `history/browse.json`;

            // --- 【新增的本地缓存检查逻辑】 ---
            try {

                const cacheExists = await exists(fileName, { baseDir: BaseDirectory.Data });

                if (cacheExists) {

                    const cacheContent = await readTextFile(fileName, { baseDir: BaseDirectory.Data });

                    const cachedData = JSON.parse(cacheContent);

                    this.history = cachedData as BrowseRecord[];

                    return this.history;
                }else {
                    return [] as BrowseRecord[];
                }

            } catch (e) {
                return [] as BrowseRecord[];
            }
        },
        async updateBrowseRecord(){

            if (!await exists(`history/`, { baseDir: BaseDirectory.Data })){
                await mkdir(`history/`, { baseDir: BaseDirectory.Data })
            }
            try {
                await writeTextFile(
                    `history/browse.json`,
                    JSON.stringify(this.history),
                    { baseDir: BaseDirectory.Data, create: true }
                );
            }catch (e){
                console.error(e);
            }

        },
        async deleteBrowseRecord(){
            this.history = []
            await this.updateBrowseRecord()
        },

        async addBrowseRecord(post: Post): Promise<void> {
            this.history = moveOrCreateBrowseRecordItemToFront(
                this.history,
                {post: post, time: new Date().getTime()} as BrowseRecord
            )
            await this.updateBrowseRecord()
        },
    },
});