import dynamic from 'next/dynamic';
const HeatMapGrid = dynamic(() => import('react-grid-heatmap').then(mod => mod.HeatMapGrid), { ssr: false });

export default function PoolsHeatmap() {

    const xLabels = new Array(24).fill(0).map((_, i) => `${i}`)
    const yLabels = ['Sol1', 'Sol2', 'Sol3', 'Sol4', 'Sol5', 'Sol6']
    const data = new Array(yLabels.length)
      .fill(0)
      .map(() =>
        new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 50 + 50))
    )

    const getColor = (ratio : number) => {
        if (ratio <= 0.5) {
          // Interpolate between red (1, 0, 0) and yellow (1, 1, 0)
          const green = Math.round(255 * (ratio / 0.5)); // Green increases
          return `rgb(255, ${green}, 0)`;
        } else {
          // Interpolate between yellow (1, 1, 0) and green (0, 1, 0)
          const red = Math.round(255 * (1 - (ratio - 0.5) / 0.5)); // Red decreases
          return `rgb(${red}, 255, 0)`;
        }
      }

    return (
        <div>
            <HeatMapGrid
                data={data}
                xLabels={xLabels}
                yLabels={yLabels}
                // Render cell with tooltip
                cellRender={(x, y, value) => (
                    <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
                )}
                xLabelsStyle={(index) => ({
                    color: index % 2 ? 'transparent' : '#777',
                    fontSize: '1rem'
                })}
                yLabelsStyle={() => ({
                    fontSize: '.7rem',
                    textTransform: 'uppercase',
                    color: '#777'
                })}
                cellStyle={(_x, _y, ratio) => ({
                    background: getColor(ratio),
                    fontSize: '.8rem',
                    color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
                })}
                cellHeight='2rem'
                xLabelsPos='bottom'
                onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
                yLabelsPos='left'
                square
            />
        </div>
    )
}