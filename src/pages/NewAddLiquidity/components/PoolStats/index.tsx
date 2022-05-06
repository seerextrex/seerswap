import "./index.scss";

interface IPoolStats {
    fee: number;
    apr: number;
}

export function PoolStats({ fee, apr }: IPoolStats) {
    return (
        <div>
            <div>
                <span>Fee:</span>
                <span>{fee}</span>
            </div>
            <div>
                <span>APR</span>
                <span>{`${apr}%`}</span>
            </div>
        </div>
    );
}
