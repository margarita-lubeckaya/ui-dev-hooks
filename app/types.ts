

export interface PlayerRepo {
    id: string
    stargazers_count: number
}

export interface PlayerProfile {
    followers: number
}


export interface Player {
    profile: PlayerProfile
    score?: number
}


//
// export interface PlayerProfile {
//
// }