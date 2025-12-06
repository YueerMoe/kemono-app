// src/stores/artist.ts
import {defineStore} from 'pinia';
import {BaseDirectory, exists, mkdir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";

export enum SearchType{
    Tag = 'tag',
    Post =  'post',
    Artist = 'artist',
}
export interface Record {
    type: SearchType,
    keyword: string,
    time: number
}


/**
 * 查找数组中的指定 SearchItem。
 * 判断依据：仅依赖 type 和 keyword 字段。
 * 如果找到，将其移动到数组最前面（使用传入的 targetItem）；
 * 如果未找到，将传入的 targetItem 添加到数组最前面。
 * @param arr 要操作的 SearchItem 数组
 * @param targetItem 要查找或新增的目标 SearchItem (包含最新的 time 字段)
 * @returns 操作后的新数组
 */
function moveOrCreateSearchItemToFront(
    arr: Record[],
    targetItem: Record
): Record[] {

    // 1. 创建数组的副本以保持不可变性
    const newArray = [...arr];

    // 2. 查找目标成员的索引，仅判断 type 和 keyword
    const index = newArray.findIndex(item =>
        item.type === targetItem.type &&
        item.keyword === targetItem.keyword
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

export const useSearchHistoryStore = defineStore('searchHistory', {
    state: () => ({
        history: [] as Record[],
        isLoading: false,
    }),

    actions: {
        async getSearchHistory(): Promise<Record[] | []> {

            if (this.history.length > 0) {

                return this.history;

            }
            if (this.isLoading) return [] as Record[];

            this.isLoading = true;

            const fileName = 'history/search.json';

            try {

                const cacheExists = await exists(fileName, { baseDir: BaseDirectory.AppData });

                if (cacheExists) {

                    const cacheContent = await readTextFile(fileName, { baseDir: BaseDirectory.AppData });

                    const cachedData = JSON.parse(cacheContent);

                    this.history = cachedData as Record[];

                    return this.history;
                }else {
                    return [] as Record[];
                }

            } catch (e) {
                return [] as Record[];
            }
        },

        /**
         * @description 添加搜索记录。
         * @param type 搜索的模式。
         * @param keyword 要搜索的关键词 。
         */
        async addSearchRecord(type: SearchType, keyword: string): Promise<void> {
            this.history = moveOrCreateSearchItemToFront(
                this.history,
                {type: type, keyword: keyword, time: new Date().getTime()} as Record
            )
            this.updateSearchRecord()
        },

        async updateSearchRecord(){
            if (!await exists('history/', { baseDir: BaseDirectory.AppData })){
                await mkdir('history/', { baseDir: BaseDirectory.AppData })
            }

            await writeTextFile('history/search.json', JSON.stringify(this.history),{ baseDir: BaseDirectory.AppData, create: true });
        },
        async deleteSearchRecord(){
            this.history = []
            await this.updateSearchRecord()
        }
    },
});