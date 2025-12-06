import {defineStore} from "pinia";
import {Me, me} from "../lib/request.ts";


interface MyInfoStore {
    info: Me | null; // 缓存所有 Artist 数据
}

export const useMyInfoStore = defineStore('myInfo', {
    state: () : MyInfoStore => ({
        info: null,
    }),

    actions: {
        async getMyInfo(): Promise<Me | null> {
            if (this.info !== null) {
                return this.info;
            }
            this.info = await me();

            return this.info
        },
        async setMyInfo(i: Me) {
            this.info = i
        }
    }
});