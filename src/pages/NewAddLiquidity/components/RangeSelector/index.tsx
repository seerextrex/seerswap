import "./index.scss";

interface IRangeSelector {}

export function RangeSelector({}: IRangeSelector) {
    return (
        <div>
            <div>
                <div>Min price</div>
                <RangePart />
            </div>
            <div></div>
            <div>
                <div>Max price</div>
                <RangePart />
            </div>
        </div>
    );
}

function RangePart() {
    return <input placeholder="0.00" />;
}
