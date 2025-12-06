import {fetch} from "@tauri-apps/plugin-http";
import {
    BaseDirectory,
    readTextFile,
    remove,
    stat,
    writeFile,
    writeTextFile
} from '@tauri-apps/plugin-fs';
import {Snackbar} from "@varlet/ui";
import {useMyInfoStore} from "../store/myInfoStore.ts";
import {ArtistProfile} from "./interface/artist.ts";
import {t} from "../i18n";
import * as CryptoJS from 'crypto-js';

import {PostContent} from "./interface/PostContent.ts";
import {AndroidFs} from "tauri-plugin-android-fs-api";
import {openUrl} from "@tauri-apps/plugin-opener";
import {Service} from "./interface/service.ts";
import {Announcement} from "./interface/announcement.ts";
import {Post, Preview, Video, Attachment} from "./interface/post.ts";

export interface Profile{
    id: string,
    name: string,
    service: Service,
    indexed: string,
    updated: string,
    public_id: string,
    relation_id: string | null,
    post_count: number,
    dm_count: number,
    share_count: number,
    chat_count: number,
}

export interface Me{
    id: string,
    username: string,
    created_at: string,
    role: string,
    is_duplicate: boolean
}

const getSyncShaHash = (text: string): string => {
    const hash = CryptoJS.SHA256(text);
    return hash.toString(CryptoJS.enc.Hex).substring(0, 16);
};

class Cache{

    url: string;
    time: number;
    file: string
    opt = {baseDir: BaseDirectory.Cache}

    constructor(url: string, time?: number) {
        this.url = url;
        if (time) {
            this.time = time;
        } else {
            this.time = 3600;
        }
        this.file = getSyncShaHash(this.url) + '.dat';
    }

    async get(): Promise<string> {
        try {
            const stats = await stat(this.file, this.opt);
            if(stats.mtime){
                if((new Date().getTime() - stats.mtime.getTime()) < this.time * 1000){
                    return await readTextFile(this.file, this.opt);
                }
            }
            await remove(this.file)
            return '';

        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return '';
            }else{
                return '';
            }
        }
    }

    async set(data: string) {
        await writeTextFile(
            this.file,
            data,
            this.opt
        );
    }
}

export async function getProfile(service: string, user: string): Promise<Profile> {
    try {
        const url = `https://kemono.cr/api/v1/${service}/user/${user}/profile`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${response.status}`
            })
            return {} as Profile;
        }
        return (await response.json()) as Profile;
    } catch (e) {
        Snackbar.error({
            position: "bottom",
            content: `${e}`
        })
        return {} as Profile;
    }
}

export async function download_file(url: string, name: string) {
    Snackbar({content: t('requests.download.submit') , position: "bottom"})
    try {
        if(!await AndroidFs.hasPublicFilesPermission()){
            await AndroidFs.requestPublicFilesPermission()
        }
        const res = await fetch(url, {
            method: 'HEAD',
            headers: {
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });

        let mine = res.headers.get('Content-Type');

        if(!mine){
            mine = 'application/octet-stream';
        }

        const relativePath = "kemono/" + name;

        let uri;

        try {
            if(mine.startsWith('image')){
                uri = await AndroidFs.createNewPublicImageFile('Pictures', relativePath, mine);
            }else if(mine.startsWith('video')){
                uri = await AndroidFs.createNewPublicVideoFile('Movies', relativePath, mine);
            }else if(mine.startsWith('audio')){
                uri = await AndroidFs.createNewPublicAudioFile('Music', relativePath, mine);
            }else {
                await openUrl(url)
                return true
                //uri = await AndroidFs.createNewPublicFile('Download', relativePath, null);
            }

        }catch (e){
            Snackbar.error({
                position: "bottom",
                content: `${e}`
            })
            return false;
        }

        if (res.ok) {
            try {

                await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Origin': 'https://kemono.cr',
                    },
                    credentials: 'include'
                }).then(async r => {
                    const path = await AndroidFs.getFsPath(uri);

                    const f = r.body

                    await writeFile(
                        path,
                        f || new Uint8Array,
                        {
                            append: true
                        }
                    )
                    Snackbar.success({
                        position: "bottom",
                        content: t('requests.download.success')
                    })
                    return true;
                }).catch(e=>{
                        Snackbar.error({
                            position: "bottom",
                            content: t('requests.download.failed') + ':' + e,
                        })
                        return false;
                });
            }
            catch (e) {
                await AndroidFs.removeFile(uri).catch(() => {});
                Snackbar.error({
                    position: "bottom",
                    content: `${e}`
                })
                return false;
            }
        } else if (!res.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${res.status}`
            })
            return false;

        }
    } catch (error) {
        Snackbar.error({
            position: "bottom",
            content: `${error}`
        })
        return false;
    }
}


export async function login(username: string, password: string): Promise<boolean> {

    const url = "https://kemono.cr/api/v1/authentication/login"

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'text/css',
                'content-type': 'application/json',
                'Origin': 'https://kemono.cr/',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include'
        });

        if (!res.ok) {
            if (res.status === 400){
                Snackbar.error({
                    position: "bottom",
                    content: `${t('login.failed')}`
                })
                return false;
            }else{
                Snackbar.error({
                    position: "bottom",
                    content: `HTTP ${res.status}`
                })
                return false;
            }
        }

        const data = await res.json();

        const i = useMyInfoStore();

        await i.setMyInfo(data)

        return true;

    } catch (error) {
        Snackbar.error({
            position: "bottom",
            content: `${error}`
        })
        return false;
    }
}

export async function me():Promise<Me>{
    try {
        const res = await fetch(
            'https://kemono.cr/api/v1/account',
            {
                method: 'GET',
                headers: {
                    'Accept': 'text/css',
                    'Origin': 'https://kemono.cr/',
                },
                credentials: 'include'
        });

        if (!res.ok) {
            if (res.status === 401){
                Snackbar.error({
                    position: "bottom",
                    content: `${t('login.unAuthorized')}`
                })
                return {} as Me;
            }else{
                Snackbar.error({
                    position: "bottom",
                    content: `HTTP ${res.status}`
                })
                return {} as Me;
            }
        }
        const r = await res.text()
        const j = JSON.parse(r)
        return j['props']['account']  as Me;

    } catch (error) {
        Snackbar.error({
            position: "bottom",
            content: `${error}`
        })
        return {} as Me;
    }
}

export async function getMyFavoriteList(post?: boolean):Promise<ArtistProfile[] | PostContent[]>{
    try {
        let type = 'artist';
        if (post) {
            type = 'post';
        }
        const url = `https://kemono.cr/api/v1/account/favorites?type=${type}`;

        const res = await fetch(
            url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
                credentials: 'include'
        });

        if (!res.ok) {
            if (res.status === 401){
                return [];
            }else{
                Snackbar.error({
                    position: "bottom",
                    content: `HTTP ${res.status}`
                })
                return [];
            }
        }

        const d = await res.json()
        // 4. 请求成功，更新状态和缓存时间
        if(post){
            return d as PostContent[];
        }
        return d as ArtistProfile[];

    } catch (err) {
        Snackbar.error({
            position: "bottom",
            content: `${err}`
        })
        return [];
    }
}

export async function favorite(service: string, id: string, unfavorite: boolean, post?: string):Promise<boolean>{

    try {
        let k = 'creator'
        let pid = ''
        if(post){
            k = 'post'
            pid = post
        }
        const type = unfavorite ? 'unfavorite' : 'favorite'

        const res = await fetch(
            `https://kemono.cr/api/v1/favorites/${k}/${service}/${id}/${pid}`, {
                method: unfavorite? 'DELETE' : 'POST',
                headers: {
                    'Accept': 'text/css',
                    'Origin': 'https://kemono.cr', // 根据 API 要求设置 Origin
                },
                credentials: 'include'
            });

        if (!res.ok) {
            if (res.status === 401){
                Snackbar.error({
                    position: "bottom",
                    content: `${t('login.unAuthorized')}`
                })
                return false;
            }else{
                Snackbar.error({
                    position: "bottom",
                    content: `HTTP ${res.status}`
                })
                return false;
            }
        }else{
            let msg: string;

            if(post){
                msg = t(`${type}.post.success`);
            }else {
                msg = t(`${type}.artist.success`);
            }
            Snackbar.success({
                position: "bottom",
                content: msg
            })
        }

        return await res.text() === 'true';

    } catch (err) {
        Snackbar.error({
            position: "bottom",
            content: `${err}`
        })
        return false;
    }
}

interface PostResult{
    attachments: Attachment[],
    post: PostContent
    previews: Preview[],
    props: object,
    videos: Video[]
}
export async function getPost(service: string, user: string, id: string): Promise<PostResult>{
    try {
        let url = `https://kemono.cr/api/v1/${service}/user/${user}/post/${id}`;

        const c = new Cache(url)
        const data = await c.get()

        if(data.length > 0){
            return JSON.parse(data.toString()) as PostResult
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });
        if (!response.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${response.status}`
            })
            return {} as PostResult;
        }

        const d =  await response.text()

        await c.set(d)

        return JSON.parse(d) as PostResult

    } catch (e) {
        Snackbar.error({
            position: "bottom",
            content: `${e}`
        })
        return {} as PostResult;
    }
}

interface Popular{
    info: {
        date: string,
        min_date: string,
        max_date: string,
        navigation_dates: {
            recent: string[],
            day: string[],
            week: string[],
            month: string[]
        },
        "range_desc": string,
        "scale": string
    },
    posts: Post[],
    props: {
        today: string,
        earliest_date_for_popular: string,
        count: number
    }
}

export async function getPopular(page: number): Promise<Popular>{
    try {
        let url = `https://kemono.cr/api/v1/posts/popular?period=recent`;

        if (page > 1){
            url += '&o=' + (50 * (page -1)).toString();
        }

        const c = new Cache(url)

        const data = await c.get()

        if(data.length > 0){
            return JSON.parse(data.toString())
        }

        // 使用 fetch API，并设置 Header
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });
        if (!response.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${response.status}`
            })
            return {} as Popular
        }

        const d =  await response.text()

        await c.set(d)

        return JSON.parse(d) as Popular

    } catch (e) {
        Snackbar.error({
            position: "bottom",
            content: `${e}`
        })
        return {} as Popular
    }
}

export async function getPosts(service: string, user: string, page: number): Promise<Post[]>{
    try {
        let url = `https://kemono.cr/api/v1/${service}/user/${user}/posts?`;

        if (page> 1){
            url += '&o=' + (50 * (page -1)).toString();
        }

        const c = new Cache(url)

        const data = await c.get()

        if(data.length > 0){
            return JSON.parse(data.toString())
        }

        // 使用 fetch API，并设置 Header
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });
        if (!response.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${response.status}`
            })
            return [] as Post[]
        }

        const res = await response.text()

        await c.set(res)

        return JSON.parse(res) as Post[]

    } catch (e) {
        Snackbar.error({
            position: "bottom",
            content: `${e}`
        })
        return [] as Post[]
    }
}

export async function getAnnouncements(service: Service, user: String):Promise<Announcement[]>{
    try {

        const url = `https://kemono.cr/api/v1/${service}/user/${user}/announcements`;

        const c = new Cache(url)

        const data = await c.get()

        if(data.length > 0){
            return JSON.parse(data.toString()) as Announcement[]
        }

        // 使用 fetch API，并设置 Header
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });
        if (!response.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${response.status}`
            })
            return []
        }

        const res = await response.text()

        await c.set(res)

        return JSON.parse(res)

    } catch (e) {
        Snackbar.error({
            position: "bottom",
            content: `${e}`
        })
        return []
    }
}



export async function getComments(service: string, user: string, id: string):Promise<[]>{
    try {

        const url = `https://kemono.cr/api/v1/${service}/user/${user}/post/${id}/comments`;

        const c = new Cache(url)

        const data = await c.get()

        if(data.length > 0){
            return JSON.parse(data.toString())
        }

        const res = await fetch(
            url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/css',
                    'Origin': 'https://kemono.cr',
                },
                credentials: 'include'
            });

        if (!res.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${res.status}`
            })
            return [];
        }

        const d = await res.text();

        await c.set(d);

        return JSON.parse(d);

    } catch (err) {
        Snackbar.error({
            position: "bottom",
            content: `${err}`
        })
        return [];
    }
}


interface searchResult{
    count: number;
    posts: Post[];
    true_count: number;
}

export async function searchPosts(page: number, keyword: string, tag: boolean): Promise<searchResult>{
    try {
        let url = 'https://kemono.cr/api/v1/posts?'

        if(tag){
            url += 'tag=' + encodeURIComponent(keyword);
        }else{
            url += 'q=' + encodeURIComponent(keyword);
        }


        if (page > 1){
            url += '&o=' + (50 * (page -1)).toString();
        }

        console.log(url)

        const c = new Cache(url)

        const data = await c.get()

        if(data.length > 0){
            return JSON.parse(data.toString())
        }

        // 使用 fetch API，并设置 Header
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });

        if (!res.ok) {
            Snackbar.error({
                position: "bottom",
                content: `HTTP ${res.status}`
            })
            return {} as searchResult;
        }

        const d = await res.text();

        await c.set(d);

        return JSON.parse(d) as searchResult;

    }catch (err){
        Snackbar.error({
            position: "bottom",
            content: `${err}`
        })
        return {} as searchResult;
    }
}


export async function logout():Promise<boolean> {
    try {
        const url = 'https://kemono.cr/api/v1/authentication/logout'

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'text/css',
                'Origin': 'https://kemono.cr',
            },
            credentials: 'include'
        });

        if (!res.ok) {
            Snackbar.error({
                position: "bottom",
                content: `${t('logout.succeeded')}\nHTTP ${res.status}`
            })
            return false;
        } else {
            Snackbar.success({
                position: "bottom",
                content: t('logout.succeeded')
            })
            return true
        }
    } catch (err) {
        Snackbar.error({
            position: "bottom",
            content: `${err}`
        })
        return false
    }
}