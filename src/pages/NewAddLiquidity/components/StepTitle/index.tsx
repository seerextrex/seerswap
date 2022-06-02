import { Check } from 'react-feather';
import './index.scss'

interface IStepTitle {
    title: string,
    isCompleted: boolean;
    step: number
}

export function StepTitle ({title, isCompleted, step}: IStepTitle) {
    return  <div className="f f-ac mb-2">
        <div className={`step-title__circle ${isCompleted ? "done" : ""} f f-ac f-jc`}>{isCompleted ? <Check stroke={"white"} strokeWidth={3} size={15} /> : step}</div>
        <div className="step-title__text ml-1">{title}</div>
    </div> 

}