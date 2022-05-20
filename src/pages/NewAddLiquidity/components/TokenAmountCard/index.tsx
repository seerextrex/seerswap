import { Check, Lock } from "react-feather";
import "./index.scss";

interface ITokenAmountCard {
    token: string;
    approved: boolean;
    disabled: boolean;
    error: string | null;
}

export function TokenAmountCard({ token, approved, disabled, error }: ITokenAmountCard) {
    return (
        <div className="token-amount-card-wrapper p-1 f c">
            <div className="f f-ac mb-1">
                <div className="token-amount-card__logo"></div>
                <div className="ml-1">
                    <div>Balance: 123 USDC</div>
                    <div>
                        <button className="token-amount-card__max-btn">MAX</button>
                    </div>
                </div>
                <div className="ml-a">
                    {approved ? (
                        <div className="token-amount-card__approved f f-ac">
                            <span>
                                <Check size={16} />
                            </span>
                            <span className="fs-085" style={{ marginLeft: "3px" }}>
                                Approved
                            </span>
                        </div>
                    ) : (
                        <button className="token-amount-card__approve-btn">Approve</button>
                    )}
                </div>
            </div>
            <div>
                <input className="token-amount-card__input mb-05 w-100" placeholder="Enter an amount" />
                {error && <div className="token-amount-card__error mb-05">Not enough</div>}
            </div>
            <div className="token-amount-card__usd-price">~ $3</div>
        </div>
    );
}
