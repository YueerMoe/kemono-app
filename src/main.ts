import { createApp } from "vue";
import App from "./App.vue";
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import {router} from "./router";
import {createPinia} from "pinia";
import {i18n} from "./i18n";
import 'virtual-icons';
import MasonryWall from "@yeger/vue-masonry-wall";
const app = createApp(App)

app.use(router)
    .use(createPinia())
    .use(i18n)
    .use(Varlet)
    .use(MasonryWall)
    .mount("#app");