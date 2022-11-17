
export interface PlayerProfile {
    followers: number
    following: number
    login : string
    avatar_url : string
    html_url: string
    name: string
    location?: string
    company?: string
}

export interface PlayerRepo {
    id: string
    stargazers_count: number
    owner : PlayerProfile,
    html_url: string
    forks: number
    open_issues : number
}


export interface Player {
    profile: PlayerProfile
    score: number
}
