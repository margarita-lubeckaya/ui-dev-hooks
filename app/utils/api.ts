import {PlayerRepo, PlayerProfile, Player} from '../types'

const id = "YOUR_CLIENT_ID"
const sec = "YOUR_SECRET_ID"
const params = `?client_id=${id}&client_secret=${sec}`

function getErrorMsg(message: string, username: string) {
    if (message === 'Not Found') {
        return `${username} doesn't exist`
    }

    return message
}

function getProfile(username: string): Promise<PlayerProfile> {
    return fetch(`https://api.github.com/users/${username}${params}`)
        .then((res) => res.json())
        .then((profile) => {
            if (profile.message) {
                throw new Error(getErrorMsg(profile.message, username))
            }

            return profile
        })
}

function getRepos(username: string): Promise<PlayerRepo[]> {
    return fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
        .then((res) => res.json())
        .then((repos) => {
            if (repos.message) {
                throw new Error(getErrorMsg(repos.message, username))
            }

            return repos
        })
}

function getStarCount(repos: PlayerRepo[]) : number {
    return repos.reduce((count, {stargazers_count}) => count + stargazers_count, 0)
}

function calculateScore(followers: number, repos: PlayerRepo[]) {
    return (followers * 3) + getStarCount(repos)
}

function getUserData(playerID: string): Promise<Player> {
    return Promise.all([getProfile(playerID), getRepos(playerID)])
        .then(([profile, repos]) => ({
            profile,
            score: calculateScore(profile.followers, repos)
        }))
}

function sortPlayers(players: [Player, Player]): [Player, Player] {
    return players.sort((a, b) => (b.score && a.score) ? b.score - a.score : 0)
}

export function battle(playersId: [string, string]) : Promise<[Player, Player]> {
    return Promise.all([
        getUserData(playersId[0]),
        getUserData(playersId[1])
    ]).then((results) => sortPlayers(results))
}

export function fetchPopularRepos(language: string) : Promise<PlayerRepo[]> {
    const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

    return fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
            if (!data.items) {
                throw new Error(data.message)
            }

            return data.items
        })
}