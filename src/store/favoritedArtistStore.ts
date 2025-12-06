import { defineStore } from 'pinia';
import {ArtistProfile} from "../lib/interface/artist.ts";
import {getMyFavoriteList} from '../lib/request.ts'
import {favorite as f_req } from '../lib/request.ts'

// 2. 定义 Store 状态和常量
interface FavoritedArtistState {
    artists: ArtistProfile[];
    isLoading: boolean;
    error: string | null;
}
export const useFavoritedArtistStore = defineStore('favoritedArtist', {
    state: (): FavoritedArtistState => ({
        artists: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchFavoritedArtistList(fresh?: boolean): Promise<ArtistProfile[]> {
            if (this.artists.length > 0 || fresh == false ) {
                return this.artists;
            }

            if (this.isLoading) {
                return [];
            }

            this.isLoading = true;

            this.error = null;

            this.artists = await getMyFavoriteList() as ArtistProfile[];

            this.isLoading = false;

            return this.artists;

        },
        async isFavorited(artist_id: string, service?: string): Promise<boolean> {

            await this.fetchFavoritedArtistList();

            const data = this.artists
            if (!data) {
                // 如果数据加载失败，返回空数组
                throw new Error(``);
            }

            const d = data.filter(artist => {
                // 1. 名称匹配 (不区分大小写，部分匹配)
                const nameMatch = artist.id.toLowerCase().includes(artist_id);

                // 2. Service 匹配
                let serviceMatch = true;
                if (service) {
                    // 如果提供了 service，则必须精确匹配
                    serviceMatch = artist.service === service;
                }

                // 只有当名称和 Service (如果提供) 都匹配时才返回
                return nameMatch && serviceMatch;
            });

            return d.length > 0;
        },
        async favorite(artist_id: string, service: string){
            await f_req(service, artist_id, false);
            await this.fetchFavoritedArtistList();
        },
        async unfavorite(artist_id: string, service: string){
            await f_req(service, artist_id, true);
            await this.fetchFavoritedArtistList();
        }
    }
});