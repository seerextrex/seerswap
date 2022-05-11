import "./index.scss";

interface ITokenAmountCard {
    token: string;
}

export function TokenAmountCard({ token }: ITokenAmountCard) {
    return (
        <div className="p-1 f c" style={{ color: "black", backgroundColor: "yellow", borderRadius: "8px", width: "330px" }}>
            <div className="f f-ac mb-1">
                <div style={{ width: "35px", height: "35px", background: "green", borderRadius: "50%" }} className="token-amount-card"></div>
                <div className="ml-1">USDC</div>
            </div>
            <input className="mb-05" style={{ width: "100%" }} placeholder="" />
            <div>~ $3</div>
        </div>
    );
}
