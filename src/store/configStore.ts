import {defineStore} from 'pinia';
import {BaseDirectory, exists, mkdir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";

// 定义配置接口
export interface Config {
    preference: {
        language: string;
    };
}

// 默认配置
const DEFAULT_CONFIG: Config = {
    preference: {
        language: 'System', // 默认语言设置为英文
    },
};


const CONFIG_PATH = 'kemono/config.json'

/**
 * 读取配置文件
 * @returns Config 对象或 null (如果文件不存在或读取失败)
 */
export async function readConfig<T>(defaultConfig: T): Promise<T> {

    try {
        if (await exists(CONFIG_PATH, {baseDir: BaseDirectory.Config})) {

            const content = await readTextFile(CONFIG_PATH, {baseDir: BaseDirectory.Config});

            return JSON.parse(content) as T;

        } else {

            return defaultConfig;

        }
    } catch (error) {

        return defaultConfig;

    }
}

/**
 * 写入配置文件
 * @param config 要写入的 Config 对象
 */
export async function writeConfig<T>(config: T): Promise<void> {

    if(!await exists('kemono/', {baseDir: BaseDirectory.Config})) {

        await mkdir('kemono/', {baseDir: BaseDirectory.Config});

    }

    const content = JSON.stringify(config);

    await writeTextFile(CONFIG_PATH, content, {baseDir: BaseDirectory.Config, create: true});

}

export const useConfigStore = defineStore('config', {
    state: () => ({
        config: DEFAULT_CONFIG as Config,
        isLoaded: false,
    }),

    actions: {
        /**
         * 异步加载配置文件并初始化 Store
         */
        async loadConfig() {
            if (this.isLoaded) return;

            this.config = await readConfig<Config>(DEFAULT_CONFIG);

            this.isLoaded = true;
        },

        /**
         * 将当前配置对象写入文件
         */
        async saveConfig() {
            await writeConfig(this.config);
        },

        /**
         * 示例：修改语言设置的 Action
         */
        async setLanguage(newLanguage: string) {
            this.config.preference.language = newLanguage;
            await this.saveConfig()
        },
        async getLanguage() {
            return this.config.preference.language;
        }
    },

    getters: {
        language: (state) => state.config.preference.language,
    }
});