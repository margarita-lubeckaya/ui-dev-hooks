

export interface PlayerRepo {
    id: string
    stargazers_count: number
    owner : {
        login : string
        avatar_url : string
    },
    html_url: string
    forks: number
    open_issues : number
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