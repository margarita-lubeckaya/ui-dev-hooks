import React, {useState, useEffect, CSSProperties} from 'react'
import PropTypes from 'prop-types'

const styles = {
    content: {
        fontSize: '35px',
        position: 'absolute',
        left: '0',
        right: '0',
        marginTop: '20px',
        textAlign: 'center',
    } as CSSProperties
}

function Loading({speed = 300, text = 'Loading'}: {
    speed?: number,
    text: string
}) {

    const [content, setContent] = useState(text)

    useEffect(() => {

        const interval = window.setInterval(() => {
            setContent((current) =>
                current === `${text}...` ? text : `${current}.`
            )

        }, speed)

        return () => {
            window.clearInterval(interval)
        }

    }, [])

    return (
        <p style={styles.content}>
            {content}
        </p>
    )

}

Loading.propTypes = {
    text: PropTypes.string,
    speed: PropTypes.number,
}

export default Loading