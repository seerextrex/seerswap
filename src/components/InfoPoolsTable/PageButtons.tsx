import { Arrow, PageButtonsWrapper } from './styled'
import React from 'react'
import { TYPE } from 'theme'

interface PageButtonsProps {
    page: number
    maxPage: number
    setPage: (a: number) => void
}

export default function PageButtons({ page, maxPage, setPage }: PageButtonsProps) {
    return (
        <PageButtonsWrapper>
            <div
                onClick={() => {
                    setPage(page === 1 ? page : page - 1)
                }}
            >
                <Arrow faded={page === 1}>←</Arrow>
            </div>
            <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
            <div
                onClick={() => {
                    setPage(page === maxPage ? page : page + 1)
                }}
            >
                <Arrow faded={page === maxPage}>→</Arrow>
            </div>
        </PageButtonsWrapper>
    )
}
