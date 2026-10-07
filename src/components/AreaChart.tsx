interface AreaChartProps {
  data: { date: string; cost: number }[];
  height?: number;
  color?: string;
}

export function AreaChart({ data, height = 200, color = '#3b82f6' }: AreaChartProps) {
  if (data.length === 0) {
    return <div style={{ height }} className="flex items-center justify-center text-slate-400 text-sm">No data</div>;
  }

  const width = 800;
  const padLeft = 50;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const values = data.map((d) => d.cost);
  const maxVal = Math.max(...values, 1) * 1.15;
  const minVal = 0;

  const xFor = (i: number) => padLeft + (i / Math.max(data.length - 1, 1)) * chartW;
  const yFor = (v: number) => padTop + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(d.cost).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${xFor(data.length - 1).toFixed(1)} ${padTop + chartH} L ${xFor(0).toFixed(1)} ${padTop + chartH} Z`;

  const yTicks = 4;
  const tickVals: number[] = [];
  for (let i = 0; i <= yTicks; i++) {
    tickVals.push((maxVal / yTicks) * i);
  }

  const labelEvery = Math.ceil(data.length / 8);
  const gridId = `area-grad-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gridId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {tickVals.map((v, i) => {
        const y = yFor(v);
        return (
          <g key={i}>
            <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
            <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
              {v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill={`url(#${gridId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {data.map((d, i) => {
        if (i % labelEvery !== 0 && i !== data.length - 1) return null;
        return (
          <text key={i} x={xFor(i)} y={height - 8} textAnchor="middle" fontSize={10} fill="#94a3b8">
            {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </text>
        );
      })}
    </svg>
  );
}
