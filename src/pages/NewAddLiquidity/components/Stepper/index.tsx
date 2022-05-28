import "./index.scss";

interface IStepper {
    completedSteps: number[];
}

export function Stepper({ completedSteps }: IStepper) {
    const steps = ["Select a pair", "Select a range", "Enter an amount"];

    return (
        <div className="f w-100" style={{ justifyContent: "space-between" }}>
            {steps.map((el, i) => (
                <div className="f f-ac">
                    <div className={`stepper__circle mr-1 f f-ac f-jc ${completedSteps.length - 1 >= i ? "done" : ""} `}>{i + 1}</div>
                    <div>{el}</div>
                </div>
            ))}
        </div>
    );
}
