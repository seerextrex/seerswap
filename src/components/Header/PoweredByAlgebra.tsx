import "./index.scss";
import PoweredBy from "../../assets/images/powered-by-algebra.svg";

export function PoweredByAlgebra() {
    return (
        <div>
            <a href={"https://algebra.finance"} rel={"noopener noreferrer"} target={"_blank"}>
                <img src={PoweredBy} />
            </a>
        </div>
    );
}
