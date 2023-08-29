'use client';

import { UrlStatsSchema } from '@/app/api/_lib/url-stats/dtos/url-stats.dto';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartData = Array<{
	x: string;
	y: number;
}>;

function createChartData(stats: UrlStatsSchema): ChartData {
	return stats.visits.map((date, index) => ({ x: date, y: index + 1 }));
}

type Props = {
	stats?: UrlStatsSchema;
};

export default function UrlStatsChart({ stats }: Props) {
	const chartData = useMemo(() => (stats ? createChartData(stats) : []), [stats]);

	return (
		<Chart
			type='area'
			options={{
				theme: { mode: 'dark' },
				chart: {
					id: 'visits',
					background: 'transparent',
				},
				xaxis: {
					type: 'datetime',
				},
				yaxis: {
					labels: {
						formatter: (value) => value.toFixed(0),
					},
				},
				fill: {
					gradient: {
						shade: 'dark',
						opacityFrom: 0.6,
						opacityTo: 0,
						stops: [0, 90],
					},
				},
				dataLabels: { enabled: false },
				grid: {
					yaxis: {
						lines: {
							show: true,
						},
					},
					strokeDashArray: 4,
				},
			}}
			series={[
				{
					name: 'Visits',
					data: chartData,
					color: '#9B77FF',
				},
			]}
		/>
	);
}
