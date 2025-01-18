

export default function Cards() {
    return (
        <div className="grid grid-cols-4 w-full gap-4">
            <div className="rounded-md h-20 border p-4">
                <div>Total collateral Value</div>
                <div>$ 1 234 567.89 USD</div>
            </div>

            <div className="rounded-md h-20 border p-4">
                <div>Total borrowed value</div>
                <div>$ 234 567.89 USD</div>
            </div>

            <div className="rounded-md h-20 border p-4">
                <div>Current health factor (HF)</div>
                <div>1.8</div>
            </div>

            <div className="rounded-md h-20 border p-4">
                <div>Average Lending Pool Risk Score</div>
                <div>71</div>
            </div>
        </div>
    )
}