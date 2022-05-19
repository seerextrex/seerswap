import "./index.scss";

interface IPoolStats {
    fee: number;
    apr: number;
}

export function PoolStats({ fee, apr }: IPoolStats) {
    return (
        <div className="f f-jb w-100" style={{ backgroundColor: "black" }}>
            <div className="pool-stats__title">Pool stats</div>
            <div className="f">
                <div className="pool-stats__fee">
                    <span>{`${fee}% fee`}</span>
                </div>
                <div className="pool-stats__apr">
                    <span>{`${apr}% APR`}</span>
                </div>
            </div>
        </div>
    );
}
