import { MarketDataPoint, ChartData } from './types';

// Premium color palette inspired by Apple and modern fintech
export const OUTCOME_COLORS = [
    { 
        main: "#00C896", 
        gradient: "rgba(0, 200, 150, 0.1)",
        glow: "rgba(0, 200, 150, 0.4)",
        hover: "#00E5A8"
    }, // Teal
    { 
        main: "#FF6B6B", 
        gradient: "rgba(255, 107, 107, 0.1)",
        glow: "rgba(255, 107, 107, 0.4)",
        hover: "#FF8585"
    }, // Coral
    { 
        main: "#4ECDC4", 
        gradient: "rgba(78, 205, 196, 0.1)",
        glow: "rgba(78, 205, 196, 0.4)",
        hover: "#6EDDD5"
    }, // Mint
    { 
        main: "#FFD93D", 
        gradient: "rgba(255, 217, 61, 0.1)",
        glow: "rgba(255, 217, 61, 0.4)",
        hover: "#FFE366"
    }, // Gold
    { 
        main: "#6C5CE7", 
        gradient: "rgba(108, 92, 231, 0.1)",
        glow: "rgba(108, 92, 231, 0.4)",
        hover: "#8577FF"
    }, // Purple
    { 
        main: "#00B4D8", 
        gradient: "rgba(0, 180, 216, 0.1)",
        glow: "rgba(0, 180, 216, 0.4)",
        hover: "#00D4FF"
    }, // Sky Blue
    { 
        main: "#F72585", 
        gradient: "rgba(247, 37, 133, 0.1)",
        glow: "rgba(247, 37, 133, 0.4)",
        hover: "#FF4D9A"
    }, // Pink
    { 
        main: "#20BF55", 
        gradient: "rgba(32, 191, 85, 0.1)",
        glow: "rgba(32, 191, 85, 0.4)",
        hover: "#3DDB72"
    }, // Green
];

export function processChartData(
    data: MarketDataPoint[] | null | undefined,
    outcomes: string[],
    span: number,
    selectedOutcome?: number
): ChartData | null {
    // Even if no data, we should still show all outcomes in the legend
    if (!outcomes || outcomes.length === 0) {
        return null;
    }
    
    // If no data yet, create empty datasets for all outcomes
    if (!data || data.length === 0) {
        const emptyDatasets = outcomes.map((outcome, index) => {
            const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
            return {
                label: outcome,
                data: [],
                borderColor: colorSet.main,
                backgroundColor: colorSet.gradient,
                tension: 0.1,
                borderWidth: 3,
                pointRadius: 3,
                pointHoverRadius: 3,
                pointHoverBorderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: colorSet.main,
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colorSet.main,
                fill: false,
                cubicInterpolationMode: 'monotone' as const,
                order: index + 1,
                spanGaps: true,
            };
        });
        return {
            labels: [],
            datasets: emptyDatasets,
        };
    }

    // Group data by timestamp and round to nearest hour for day view
    const groupedData: { [key: string]: any } = {};
    const roundToHour = span === 0; // Round to hour for day view
    
    data.forEach((item) => {
        let timestamp = item.periodStartUnix * 1000;
        
        // Round to nearest hour for day view to group nearby data points
        if (roundToHour) {
            timestamp = Math.floor(timestamp / 3600000) * 3600000;
        }
        
        const dateKey = new Date(timestamp).toISOString();
        
        if (!groupedData[dateKey]) {
            groupedData[dateKey] = {
                timestamp,
                outcomes: {},
            };
        }
        
        if (item.outcomeIndex !== undefined) {
            // Keep the most recent price for each outcome at this timestamp
            // Prefer non-synthetic data over synthetic
            const existing = groupedData[dateKey].outcomes[item.outcomeIndex];
            const shouldUpdate = !existing || 
                (!item.synthetic && existing.synthetic) || 
                (item.synthetic === existing.synthetic && item.periodStartUnix > existing.originalTimestamp);
                
            if (shouldUpdate) {
                groupedData[dateKey].outcomes[item.outcomeIndex] = {
                    price: item.price || 0,
                    originalTimestamp: item.periodStartUnix,
                    synthetic: item.synthetic
                };
            }
        }
    });

    // Sort timestamps
    const sortedEntries = Object.entries(groupedData).sort(
        ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    const labels = sortedEntries.map(([_, data]) => {
        const date = new Date(data.timestamp);
        if (span === 0) { // Day
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (span === 1) { // Week
            return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
        } else { // Month
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    });

    // Check which outcomes have data
    const outcomesWithData = new Set<number>();
    data.forEach(item => {
        if (item.outcomeIndex !== undefined) {
            outcomesWithData.add(item.outcomeIndex);
        }
    });
    
    const datasets = outcomes.map((outcome, index) => {
        // Data should already be complete from the hook
        const hasData = outcomesWithData.has(index);
        const isSelected = selectedOutcome === index;
        
        const dataPoints = hasData ? sortedEntries.map(([_, groupData]) => {
            // Simply return the price, gaps should already be filled by the hook
            return groupData.outcomes[index]?.price || null;
        }) : [];

        const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];

        return {
            label: outcome,
            data: dataPoints,
            borderColor: isSelected ? colorSet.hover : colorSet.main,
            backgroundColor: isSelected ? colorSet.glow : colorSet.gradient,
            tension: 0.1,
            borderWidth: isSelected ? 4 : 2,
            pointRadius: isSelected ? 4 : 2,
            pointHoverRadius: isSelected ? 6 : 4,
            pointHoverBorderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: isSelected ? colorSet.hover : colorSet.main,
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: isSelected ? colorSet.hover : colorSet.main,
            fill: isSelected, // Fill only the selected outcome
            cubicInterpolationMode: 'monotone' as const,
            order: isSelected ? 0 : index + 1, // Bring selected to front
            spanGaps: true, // Connect line across null/undefined values
            hidden: false, // Always show in legend even if no data
        };
    });

    return {
        labels,
        datasets,
    };
}