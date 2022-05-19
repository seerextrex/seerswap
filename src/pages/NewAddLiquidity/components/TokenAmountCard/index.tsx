import { Lock } from "react-feather";
import "./index.scss";

interface ITokenAmountCard {
    token: string;
    approved: boolean;
    disabled: boolean;
}

export function TokenAmountCard({ token, approved, disabled }: ITokenAmountCard) {
    return (
        <div style={{ position: "relative" }}>
            {disabled && (
                <div className="w-100 full-h f f-ac f-jc" style={{ position: "absolute", left: 0, top: 0, color: "black", zIndex: 999999 }}>
                    <Lock />
                    <div className="ml-05">Locked</div>
                </div>
            )}
            <div className="p-1 f c" style={{ color: "black", filter: disabled ? "blur(4px)" : "", position: "relative", backgroundColor: "yellow", borderRadius: "8px", width: "330px" }}>
                <div className="f f-ac mb-1">
                    <div style={{ width: "35px", height: "35px", background: "green", borderRadius: "50%" }} className="token-amount-card"></div>
                    <div className="ml-1">USDC</div>
                    <div className="ml-a">{approved ? <div>Approved</div> : <button>Approve</button>}</div>
                </div>
                <div style={{ position: "relative" }}>
                    <input className="mb-05" style={{ width: "100%" }} placeholder="" />
                    <div style={{ position: "absolute", right: 0, top: 0, background: "red", padding: "4px" }}>Not enough</div>
                </div>
                <div>~ $3</div>
            </div>
        </div>
    );
}
