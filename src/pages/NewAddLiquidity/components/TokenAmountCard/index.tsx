import { Lock } from "react-feather";
import "./index.scss";

interface ITokenAmountCard {
    token: string;
    approved: boolean;
    disabled: boolean;
}

export function TokenAmountCard({ token, approved, disabled }: ITokenAmountCard) {
    return (
        <div className="token-amount-card-wrapper p-1 f c">
            <div className="f f-ac mb-1">
                <div className="token-amount-card__logo"></div>
                <div className="ml-1">Balance: 123 USDC</div>
                <div className="ml-a">
                    <button>Max</button>
                </div>
                <div className="ml-1">{approved ? <div>Approved</div> : <button>Approve</button>}</div>
            </div>
            <div>
                <input className="token-amount-card__input mb-05 w-100" placeholder="Enter an amount" />
                <div className="token-amount-card__error mb-05">Not enough</div>
            </div>
            <div>~ $3</div>
        </div>
    );
}
