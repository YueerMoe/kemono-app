import {createRouter, createWebHashHistory} from 'vue-router'

import MainPage from "../pages/main/MainPage.vue";
import SearchPage from "../pages/search/SearchPage.vue";
import SearchResult from "../pages/search/SearchResult.vue";
import ErrorPage from "../pages/ErrorPage.vue";
import ArtistPage from "../pages/ArtistPage.vue";
import SearchMainPage from "../pages/search/SearchMainPage.vue";
import PostPage from "../pages/PostPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import PopularPage from "../pages/main/PopularPage.vue";
import DiscoveryPage from "../pages/main/DiscoveryPage.vue";
import FavoritePage from "../pages/main/FavoritePage.vue";
import UserPage from "../pages/main/UserPage.vue";
import PreferenceSet from "../pages/settings/PreferenceSet.vue";
import ArtistAnnouncements from "../pages/artist/ArtistAnnouncements.vue";
import ArtistPosts from "../pages/artist/ArtistPosts.vue";
import HistoryPage from "../pages/user/HistoryPage.vue";
import FavoritePost from "../pages/favorite/FavoritePost.vue";
import FavoriteArtist from "../pages/favorite/FavoriteArtist.vue";
import HomePage from "../pages/main/HomePage.vue";


const index = [
    {
        path: '/search',
        component: SearchMainPage,
        children: [
            {
                path: '',
                name: 'search',
                component: SearchPage,
            },
            {
                path: 'result',
                component: SearchResult,
                name: 'search-result',
            }
        ]
    },
    {
        path: '/error',
        component: ErrorPage,
        name: 'error',
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
    },
    {
        path: '/artist/:service/:user',
        name: 'artist',
        component: ArtistPage,
        children: [
            {
                path: '',
                name: 'artist-posts',
                component: ArtistPosts,
            },
            {
                path: 'announcements',
                name: 'artist-announcements',
                component: ArtistAnnouncements,
            }
        ]
    },
    {
        path: '/post/:service:/:user/:id',
        name: 'post',
        component: PostPage,
    },
    {
        path: '/about',
        name: 'about',
        component: AboutPage,
    },
    {
        path: '/preference',
        name: 'preference',
        component: PreferenceSet
    },
    {
        path: '/history',
        name: 'history',
        component: HistoryPage,
    },
    {
        path: '/',
        component: MainPage,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                component: HomePage,
            },
            {
                path: 'popular',
                name: 'popular',
                component: PopularPage,
            },
            {
                path: 'discovery',
                name: 'discovery',
                component: DiscoveryPage,
            },
            {
                path: 'favorite',
                name: 'favorite',
                component: FavoritePage,
                redirect: '/favorite/artists',
                children: [
                    {
                        path: 'posts',
                        name: 'favorite-posts',
                        component: FavoritePost
                    },
                    {
                        path: 'artists',
                        name: 'favorite-artists',
                        component: FavoriteArtist
                    }
                ]
            },
            {
                path: 'user',
                name: 'user',
                component: UserPage,
            }
        ]
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: index,
})

router.beforeEach((to, from, next) => {
    to.query.from = from.path
    next()
})