// src/types/artist.ts
export interface Artist {
    id: string;
    name: string;
    service: string;
    indexed: string;
    updated: string;
    favorited: number;
}

export interface ArtistProfile {
    id: string,
    name: string,
    service: string,
    indexed: string,
    updated: string,
    public_id: string,
    relation_id: null | string,
    faved_seq: number,
    last_imported: string
}