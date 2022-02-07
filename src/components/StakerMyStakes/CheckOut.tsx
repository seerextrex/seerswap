import { CheckOutLink } from './styled'

export function CheckOut({ link }: { link: string }) {
    return (
        <CheckOutLink to={`/farming/${link}`}>
            <span>Check out available farms →</span>
        </CheckOutLink>
    )
}
