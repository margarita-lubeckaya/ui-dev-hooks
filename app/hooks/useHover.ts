import {useState} from 'react'

function useHover ():[boolean, {}] {
    const [isHover, setIsHover] = useState(false)

    const onMouseOver = () => setIsHover( true )
    const onMouseOut = () => setIsHover(false )

    return [
        isHover,
        {
            onMouseOver,
            onMouseOut
        }
    ]

}

export default useHover