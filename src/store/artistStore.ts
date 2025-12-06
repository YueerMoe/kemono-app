// src/stores/artist.ts
import {defineStore} from 'pinia';
import {Artist} from '../lib/interface/artist.ts'; // 确保路径正确
import {fetch} from '@tauri-apps/plugin-http';
import {BaseDirectory, exists, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {AndroidFs} from "tauri-plugin-android-fs-api";

interface ArtistState {
    allArtists: Artist[] | null; // 缓存所有 Artist 数据
    isLoading: boolean;
    error: string | null;
}

export const useArtistStore = defineStore('artist', {
    state: (): ArtistState => ({
        allArtists: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        /**
         * @description 负责从 API 获取数据并实现缓存。
         * 只有当 allArtists 为 null 时才执行 fetch。
         * @returns {Promise<Artist[] | null>} 返回缓存的数据或 null。
         */
        async fetchAndCacheArtists(): Promise<Artist[] | null> {
// 1. 检查内存缓存
            if (this.allArtists) {
                console.log('数据已从内存缓存加载。');
                return this.allArtists;
            }

            // 2. 避免重复加载
            if (this.isLoading) return null;

            this.isLoading = true;
            this.error = null;

            const fileName = 'artists.json';
            // --- 【新增的本地缓存检查逻辑】 ---
            try {
                const cacheExists = await exists(fileName, { baseDir: BaseDirectory.Cache });

                if (cacheExists) {
                    // 获取文件状态（ctime 状态改变时间，或 mtime 内容修改时间）
                    // 注意：Tauri 的 fs API 没有直接提供 stat 的 mtime/ctime，通常需要读取文件内容来间接判断，
                    // 或者依赖外部库。但最简单和可靠的方式是，将时间戳也写在缓存文件内。

                    // 💡 最佳实践：我们将缓存内容读取出来，并检查其中的时间戳。
                    const cacheContent = await readTextFile(fileName, { baseDir: BaseDirectory.Cache });
                    const cachedData = JSON.parse(cacheContent);

                    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

                    // 假设缓存文件结构为 { timestamp: number, artists: Artist[] }
                    if (cachedData.timestamp && (Date.now() - cachedData.timestamp) < ONE_DAY_MS) {

                        // 缓存未过期 (小于 1 天)
                        this.allArtists = cachedData.artists;
                        console.log('数据已从本地缓存文件加载，未超过 1 天。');
                        return cachedData.artists;
                    } else {
                        console.log('本地缓存已过期 (超过 1 天)，将重新拉取数据。');
                    }
                }
            } catch (e) {
                console.warn('读取本地缓存失败或文件损坏，将重新拉取数据:', e);
                // 继续执行，从网络拉取
            }
            // --- 【新增本地缓存检查逻辑结束】 ---


            try {
                const url = 'https://kemono.cr/api/v1/creators';

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/css',
                        'Origin': 'https://kemono.cr',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const artists: Artist[] = await response.json();

                // 3. 缓存数据到内存
                this.allArtists = artists;

                // 4. 【新增】缓存数据到本地文件 (包含时间戳)
                const dataToCache = {
                    timestamp: Date.now(), // 记录当前的 Unix 时间戳
                    artists: artists
                };
                AndroidFs
                await writeTextFile(fileName, JSON.stringify(dataToCache), {baseDir: BaseDirectory.Cache});

                return artists;

            } catch (e) {
                this.error = `数据加载失败: ${(e as Error).message}`;
                console.error(e);
                return null;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * @description 按 name 和 service 搜索 Artist。
         * 首次调用时触发数据缓存。
         * @param name 要搜索的名称 (不区分大小写，部分匹配)。
         * @param service 可选，要搜索的服务 (精确匹配)。
         * @returns {Promise<Artist[]>} 过滤后的 Artist 数组。
         */
        async searchByNameAndService(name: string, service?: string): Promise<Artist[]> {
            // 确保数据已缓存
            const data = await this.fetchAndCacheArtists();

            if (!data) {
                // 如果数据加载失败，返回空数组
                return [];
            }

            // 标准化搜索名称
            const lowerName = name.toLowerCase().trim();

            return data.filter(artist => {
                // 1. 名称匹配 (不区分大小写，部分匹配)
                const nameMatch = artist.name.toLowerCase().includes(lowerName);

                // 2. Service 匹配
                let serviceMatch = true;
                if (service) {
                    // 如果提供了 service，则必须精确匹配
                    serviceMatch = artist.service === service;
                }

                // 只有当名称和 Service (如果提供) 都匹配时才返回
                return nameMatch && serviceMatch;
            });
        },
        async searchID(id: string): Promise<Artist> {
            const data = await this.fetchAndCacheArtists();

            if (!data) {
                // 如果数据加载失败，返回空数组
                return {} as Artist;
            }

            const res = data.filter(artist => {

                const nameMatch = artist.id.match(id);

                if(nameMatch){
                    return nameMatch
                }else {
                    return [] as Artist[]
                }
            })

            if(res){
                return res[0]
            }else {
                return {} as Artist;
            }
        }
    },
});