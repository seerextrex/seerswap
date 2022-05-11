import "./index.scss";

interface IPoolStats {
    fee: number;
    apr: number;
}

export function PoolStats({ fee, apr }: IPoolStats) {
    return (
        <div className="f">
            <div className="pool-stats__fee">
                <span>Fee: </span>
                <span>{fee}</span>
            </div>
            <div className="pool-stats__apr ml-1">
                <span>APR: </span>
                <span>{`${apr}%`}</span>
            </div>
        </div>
    );
}
