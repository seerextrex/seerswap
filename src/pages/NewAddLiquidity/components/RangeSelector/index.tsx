import "./index.scss";

interface IRangeSelector {
    priceHandler: () => void;
}

export function RangeSelector({ priceHandler }: IRangeSelector) {
    return (
        <div className="f f-jb">
            <div>
                <div className="mb-05">Min price</div>
                <RangePart />
            </div>
            <div className="f c f-ac">
                <div className="mb-05" style={{ whiteSpace: "nowrap" }}>
                    Current price
                </div>
                <div className="current-price-tip ta-c">0.5</div>
            </div>
            <div>
                <div className="mb-05 ta-r">Max price</div>
                <RangePart />
            </div>
        </div>
    );
}

function RangePart() {
    return <input className="range-input" placeholder="0.00" />;
}
