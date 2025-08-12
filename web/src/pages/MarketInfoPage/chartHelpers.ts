import { MarketDataPoint, ChartData } from './types';

// Premium color palette inspired by Apple's vibrant gradients and modern fintech interfaces
export const OUTCOME_COLORS = [
    { 
        main: "#00D4AA", 
        gradient: "linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(0, 212, 170, 0.05))",
        glow: "rgba(0, 212, 170, 0.3)",
        hover: "#00FFD1"
    }, // Mint Green - Primary winner
    { 
        main: "#FF6B9D", 
        gradient: "linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(255, 107, 157, 0.05))",
        glow: "rgba(255, 107, 157, 0.3)",
        hover: "#FF85B3"
    }, // Rose Pink - Contrasting option
    { 
        main: "#7B68EE", 
        gradient: "linear-gradient(135deg, rgba(123, 104, 238, 0.15), rgba(123, 104, 238, 0.05))",
        glow: "rgba(123, 104, 238, 0.3)",
        hover: "#9B88FF"
    }, // Medium Slate Blue - Trustworthy
    { 
        main: "#FFB347", 
        gradient: "linear-gradient(135deg, rgba(255, 179, 71, 0.15), rgba(255, 179, 71, 0.05))",
        glow: "rgba(255, 179, 71, 0.3)",
        hover: "#FFC466"
    }, // Peach Orange - Warm alternative
    { 
        main: "#00CED1", 
        gradient: "linear-gradient(135deg, rgba(0, 206, 209, 0.15), rgba(0, 206, 209, 0.05))",
        glow: "rgba(0, 206, 209, 0.3)",
        hover: "#00E7EA"
    }, // Dark Turquoise - Cool confidence
    { 
        main: "#FF69B4", 
        gradient: "linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(255, 105, 180, 0.05))",
        glow: "rgba(255, 105, 180, 0.3)",
        hover: "#FF85C7"
    }, // Hot Pink - Bold choice
    { 
        main: "#48D1CC", 
        gradient: "linear-gradient(135deg, rgba(72, 209, 204, 0.15), rgba(72, 209, 204, 0.05))",
        glow: "rgba(72, 209, 204, 0.3)",
        hover: "#5FE8E3"
    }, // Medium Turquoise - Balanced
    { 
        main: "#DDA0DD", 
        gradient: "linear-gradient(135deg, rgba(221, 160, 221, 0.15), rgba(221, 160, 221, 0.05))",
        glow: "rgba(221, 160, 221, 0.3)",
        hover: "#E6B8E6"
    }, // Plum - Sophisticated
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
        
        if (item.outcomeIndex !== undefined && item.price !== null && item.price !== undefined) {
            // Simply keep the most recent price for each outcome at this timestamp
            const existing = groupedData[dateKey].outcomes[item.outcomeIndex];
            
            // Always take the latest data point for this time bucket
            if (!existing || item.periodStartUnix >= existing.originalTimestamp) {
                groupedData[dateKey].outcomes[item.outcomeIndex] = {
                    price: item.price,
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
        const hasData = outcomesWithData.has(index);
        const isSelected = selectedOutcome === index;
        
        // Build data points with proper gap filling
        const dataPoints = hasData ? sortedEntries.map(([_, groupData], timeIndex) => {
            // Check if we have a price for this outcome at this timestamp
            const currentPrice = groupData.outcomes[index]?.price;
            
            if (currentPrice !== undefined && currentPrice !== null) {
                return currentPrice;
            }
            
            // If no price at this timestamp, carry forward the last known price
            // Look backwards through previous timestamps
            for (let i = timeIndex - 1; i >= 0; i--) {
                const prevPrice = sortedEntries[i][1].outcomes[index]?.price;
                if (prevPrice !== undefined && prevPrice !== null) {
                    return prevPrice;
                }
            }
            
            // No previous price found, return null
            return null;
        }) : [];

        const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];

        // Implement ghost lines: show unselected outcomes at low opacity
        const isGhost = selectedOutcome !== undefined && selectedOutcome !== index && hasData;
        const opacity = isGhost ? 0.15 : 1;
        
        return {
            label: outcome,
            data: dataPoints,
            borderColor: isSelected ? colorSet.hover : `${colorSet.main}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
            tension: 0.35,
            borderWidth: isSelected ? 3 : isGhost ? 1.5 : 2,
            pointRadius: 0,
            pointHoverRadius: isSelected ? 6 : isGhost ? 3 : 5,
            pointHoverBorderWidth: 2,
            pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderColor: isSelected ? colorSet.hover : colorSet.main,
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointHoverBorderColor: isSelected ? colorSet.hover : colorSet.main,
            fill: isSelected, // Add gradient fill for selected outcome
            backgroundColor: isSelected 
                ? `${colorSet.main}20` // 20 = 12.5% opacity in hex for gradient fill
                : isGhost ? `${colorSet.main}26` : colorSet.gradient, // Ghost lines are more transparent
            cubicInterpolationMode: 'monotone' as const,
            order: isSelected ? 0 : isGhost ? index + 10 : index + 1, // Ghost lines go to back
            spanGaps: true,
            hidden: false,
            segment: {
                borderColor: (ctx: any) => {
                    // Create gradient effect along the line - ctx type from Chart.js internals
                    const prev = ctx.p0?.parsed?.y;
                    const cur = ctx.p1?.parsed?.y;
                    const baseColor = isSelected ? colorSet.hover : colorSet.main;
                    if (cur > prev) {
                        return isGhost ? `${baseColor}26` : baseColor; // 26 = 15% opacity in hex
                    }
                    return isGhost ? `${baseColor}26` : baseColor;
                },
            }
        };
    });

    return {
        labels,
        datasets,
    };
}