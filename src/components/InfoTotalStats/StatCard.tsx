import Loader from "../Loader";
import { formatDollarAmount } from "../../utils/numbers";
import Card from "../../shared/components/Card/Card";

interface StatCardProps {
    isLoading: boolean;
    title: string;
    data: number;
    style: string;
    format?: boolean;
}

export function StatCard({ isLoading, title, data, style, format }: StatCardProps) {
    const shouldShowLoader = isLoading && (data === undefined || data === null);
    const displayData = data === undefined || data === null ? "-" : (format ? formatDollarAmount(data) : data);

    return (
        <Card classes={`w-100 pa-1 br-12 ${style}`} isDark={false}>
            <div className={"c-lg mb-1"}>{title}</div>
            <div className={"fs-2 b"}>
                {shouldShowLoader ? (
                    <span>
                        <Loader size={"2rem"} stroke="white" />
                    </span>
                ) : (
                    displayData
                )}
            </div>
        </Card>
    );
}
