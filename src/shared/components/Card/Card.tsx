import React from 'react'
import './index.scss'

interface CardProps {
    classes: string
    children?: any
}

const Card = ({ classes }: CardProps) => {
    return (
        <div className={`card-wrapper ${classes}`}>

        </div>
    )
}

export default Card
