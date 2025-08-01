import Polling from "components/Header/Polling";
import "./index.scss";

export default function Footer() {
    return (
        <footer className={"footer-wrapper f f-jb mt-1"}>
            <div className={"f w-100 f-jb f-ac"} style={{ justifyContent: "flex-end" }}>
                <Polling />
            </div>
        </footer>
    );
}
