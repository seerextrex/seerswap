import "./index.scss";

interface IStepper {
    step: number;
}

export function Stepper({ step }: IStepper) {
    return (
        <div className="f">
            <div className="f c f-ac">
                <div className="stepper__circle done mb-05"></div>
                <div>{`Select pair`}</div>
            </div>
            <div className="f" style={{ width: "35px", height: "40px" }}>
                <div className="full-w"></div>
                <div className="full-w" style={{ borderLeft: "2px dashed black" }}></div>
            </div>
            <div className="f c f-ac">
                <div className="stepper__circle mb-05"></div>
                <div>{`Select range`}</div>
            </div>
            <div className="f" style={{ width: "35px", height: "40px" }}>
                <div className="full-w"></div>
                <div className="full-w" style={{ borderLeft: "2px dashed black" }}></div>
            </div>
            <div className="f c f-ac">
                <div className="stepper__circle mb-05"></div>
                <div>{`Enter an amount`}</div>
            </div>
            <div className="f" style={{ width: "35px", height: "40px" }}>
                <div className="full-w"></div>
                <div className="full-w" style={{ borderLeft: "2px dashed black" }}></div>
            </div>
            <div className="f c f-ac">
                <div className="stepper__circle mb-05"></div>
                <div>{`Approve ALGB`}</div>
            </div>
            <div className="f" style={{ width: "35px", height: "40px" }}>
                <div className="full-w"></div>
                <div className="full-w" style={{ borderLeft: "2px dashed black" }}></div>
            </div>
            <div className="f c f-ac">
                <div className="stepper__circle mb-05"></div>
                <div>{`Approve USDC`}</div>
            </div>
        </div>
    );
}
