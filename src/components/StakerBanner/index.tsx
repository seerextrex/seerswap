import {
    Banner,
    BannerButton,
    BannerDescription,
    BannerPart,
    BannerSubtitle,
    BannerTime,
    BannerTitle
} from './styled'

export function StakingBanner() {
    return (
        <Banner>
            <BannerPart>
                <BannerTitle>Year-long deposit</BannerTitle>
                <BannerDescription>
                    Deposit your NFT-s in 100 different pools for more then 100 different rewards
                </BannerDescription>
            </BannerPart>
            <BannerPart style={{ textAlign: 'right' }}>
                <BannerSubtitle>Starts in</BannerSubtitle>
                <BannerTime>10 days 12:21:03</BannerTime>
                <BannerButton>View pools</BannerButton>
            </BannerPart>
        </Banner>
    )
}
