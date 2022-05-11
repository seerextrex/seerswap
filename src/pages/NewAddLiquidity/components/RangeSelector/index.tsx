import "./index.scss";

interface IRangeSelector {
    priceHandler: () => void;
}

export function RangeSelector({ priceHandler }: IRangeSelector) {
    return (
        <div className="f">
            <div>
                <div className="mb-05">Min price</div>
                <RangePart />
            </div>
            <div className="f" style={{ width: "240px" }}>
                <div className="f c" style={{ width: "100%" }}>
                    <div className="mt-a f c" style={{ height: "24px" }}>
                        <div style={{ height: "100%", borderBottom: "2px dashed black" }}></div>
                        <div style={{ height: "100%" }}></div>
                    </div>
                </div>
                <div>
                    <div className="mb-05" style={{ whiteSpace: "nowrap" }}>
                        Current price
                    </div>
                    <div className="ta-c" style={{ padding: "4px", borderRadius: "4px", backgroundColor: "orange" }}>
                        0.5
                    </div>
                </div>
                <div className="f c" style={{ width: "100%" }}>
                    <div className="mt-a f c" style={{ height: "24px" }}>
                        <div style={{ height: "100%", borderBottom: "2px dashed black" }}></div>
                        <div style={{ height: "100%" }}></div>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-05 ta-r">Max price</div>
                <RangePart />
            </div>
        </div>
    );
}

function RangePart() {
    return <input style={{ width: "80px" }} width={"80px"} placeholder="0.00" />;
}
