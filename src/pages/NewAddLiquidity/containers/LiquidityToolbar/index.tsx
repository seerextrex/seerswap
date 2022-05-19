import "./index.scss";

export function LiquidityToolbar() {
    return (
        <div className="liquidity-toolbar-wrapper f">
            <div>
                <div className="mb-05">Price in</div>
                <div className="f">
                    <div>USDC</div>
                    <div className="ml-05">WETH</div>
                    <div className="ml-05">$</div>
                </div>
            </div>
            <div className="ml-a">
                <div>Settings</div>
            </div>
        </div>
    );
}
