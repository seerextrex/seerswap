import React from 'react'
import { TYPE } from 'theme'
import './index.scss'

interface PageButtonsProps {
    page: number
    maxPage: number
    setPage: (a: number) => void
}

export default function PageButtons({ page, maxPage, setPage }: PageButtonsProps) {
    return (
        <div className={'table-page-buttons-wrapper'}>
            <div
                onClick={() => {
                    setPage(page === 1 ? page : page - 1)
                }}
            >
                <div className={'table-page-button'}>←</div>
            </div>
            <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
            <div
                onClick={() => {
                    setPage(page === maxPage ? page : page + 1)
                }}
            >
                <div className={'table-page-button'}>→</div>
            </div>
        </div>
    )
}
