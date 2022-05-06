import "./index.scss";

interface IStepper {
    step: number;
}

export function Stepper({ step }: IStepper) {
    return (
        <div>
            <span>Step</span>
            <span>{step}</span>
        </div>
    );
}
