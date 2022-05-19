import "./index.scss";

interface IStepper {
    step: number;
}

export function Stepper({ step }: IStepper) {
    return (
        <div>
            <div className="f f-ac">
                <div className="stepper__circle done mr-1"></div>
                <div>{`Step 1`}</div>
            </div>
            <div className="f" style={{ width: "35px", height: "40px" }}>
                <div className="full-w"></div>
                <div className="full-w" style={{ borderLeft: "2px dashed black" }}></div>
            </div>
            <div className="f f-ac">
                <div className="stepper__circle mr-1"></div>
                <div>{`Step 2`}</div>
            </div>
            <div className="f" style={{ width: "35px", height: "40px" }}>
                <div className="full-w"></div>
                <div className="full-w" style={{ borderLeft: "2px dashed black" }}></div>
            </div>
            <div className="f f-ac">
                <div className="stepper__circle mr-1"></div>
                <div>{`Step 3`}</div>
            </div>
        </div>
    );
}
