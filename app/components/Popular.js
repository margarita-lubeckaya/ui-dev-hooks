import React, {useReducer, useEffect} from 'react'
import PropTypes from 'prop-types'
import {fetchPopularRepos} from '../utils/api'
import {FaUser, FaStar, FaCodeBranch, FaExclamationTriangle} from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LangaugesNav({selected, onUpdateLanguage}) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

    console.log('nav:', selected)

    return (
        <ul className='flex-center'>
            {languages.map((language) => (
                <li key={language}>
                    <button
                        className='btn-clear nav-link'
                        style={language === selected ? {color: 'rgb(187, 46, 31)'} : null}
                        onClick={() => onUpdateLanguage(language)}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}

LangaugesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({repos}) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const {name, owner, html_url, stargazers_count, forks, open_issues} = repo
                const {login, avatar_url} = owner

                return (
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text="Github username">
                                        <FaUser color='rgb(255, 191, 116)' size={22}/>
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22}/>
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22}/>
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}/>
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}


function popularReducer(state, action) {
    switch (action.type) {
        case 'selectLanguage' :
            return {
                ...state,
                selectedLanguage: action.language,
                error: null,
            }

        case 'loading' :
            console.log('start loading...')
            return {
                ...state,
                isLoading: true,
                error: null,
            }

        case 'updateRepos' :
            console.log('updating..', state)

            return {
                ...state,
                isLoading: false,
                error: null,
                repos: {
                    ...state.repos,
                    ...action.repos
                }
            }

        case 'error' :
            return {
                ...state,
                isLoading: false,
                error: action.error,
            }

        default:
            console.warn('Error default action: ')
    }

}

function Popular() {

    const initState = {
        selectedLanguage: 'All',
        repos: {},
        error: null,
        isLoading: false
    }

    const [{selectedLanguage, repos, error, isLoading}, dispatch] = useReducer(popularReducer, initState);


    useEffect(() => {
        updateLanguage(selectedLanguage)
    }, [])


    const updateLanguage = (language) => {

        dispatch({type: 'selectLanguage', language: language})

        if (!repos[language]) {

            dispatch({type: 'loading', language})

            fetchPopularRepos(language)
                .then((data) => {
                    dispatch({type: 'updateRepos', repos: {[language]: data}})

                })
                .catch(() => {
                    console.warn('Error fetching repos: ', error)
                    dispatch({type: 'error', error: `There was an error fetching the repositories.`})

                })
        }


    }

    return (
        <React.Fragment>
            <LangaugesNav
                selected={selectedLanguage}
                onUpdateLanguage={updateLanguage}
            />

            {isLoading && <Loading text='Fetching Repos'/>}

            {error && <p className='center-text error'>{error}</p>}

            {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]}/>}
        </React.Fragment>
    )

}

export default Popular