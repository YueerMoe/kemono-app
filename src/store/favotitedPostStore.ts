import { defineStore } from 'pinia';
import {favorite as f_req, getMyFavoriteList} from '../lib/request.ts'
import {PostContent} from "../lib/interface/PostContent.ts";

interface FavoritedPostState {
    posts: PostContent[];
    isLoading: boolean;
    error: string | null;
}
export const useFavoritedPostStore = defineStore('favoritedPost', {
    state: (): FavoritedPostState => ({
        posts: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchFavoritedPostList(fresh?: boolean): Promise<PostContent[]> {
            if (this.posts.length > 0 || fresh == false ) {
                return this.posts;
            }

            if (this.isLoading) {
                return [];
            }

            this.isLoading = true;

            this.error = null;

            this.posts = await getMyFavoriteList(true) as PostContent[];

            this.isLoading = false;

            return this.posts;

        },
        async isFavorited(post_id: string, service?: string): Promise<boolean> {

            await this.fetchFavoritedPostList();

            const data = this.posts
            if (!data) {
                // 如果数据加载失败，返回空数组
                throw new Error(``);
            }

            const d = data.filter(post => {
                // 1. 名称匹配 (不区分大小写，部分匹配)
                const nameMatch = post.id.toLowerCase().includes(post_id);

                // 2. Service 匹配
                let serviceMatch = true;
                if (service) {
                    // 如果提供了 service，则必须精确匹配
                    serviceMatch = post.service === service;
                }

                // 只有当名称和 Service (如果提供) 都匹配时才返回
                return nameMatch && serviceMatch;
            });

            return d.length > 0;
        },
        async favorite(post_id: string, user: string, service: string){
            await f_req(service, user, false, post_id);
            await this.fetchFavoritedPostList();
        },
        async unfavorite(post_id: string, user: string, service: string){
            await f_req(service, user, true, post_id);
            await this.fetchFavoritedPostList();
        }
    }
});