import {Composer, createI18n} from "vue-i18n";
import {zh_cn} from "./lang/zh-CN.ts";
import {en_us} from "./lang/en-US.ts";

export const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        "zh-CN": zh_cn,
        "en-US": en_us,
    }
})

const { t, locale } = i18n.global as Composer;

export { t, locale };