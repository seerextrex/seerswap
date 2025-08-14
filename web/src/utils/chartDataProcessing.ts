import { MarketDataPoint } from "../pages/MarketInfoPage/types";

export interface ProcessedDataPoint {
    timestamp: number;
    estimate: number;
    upPrice: number;
    downPrice: number;
    isInterpolated: boolean;
}

export interface MarketEstimate {
    current: number;
    lower: number;
    upper: number;
    range: number;
    upIndex: number;
    downIndex: number;
}

/**
 * Process price history data with forward-filling for missing values
 * This handles sparse data where UP and DOWN tokens may trade at different times
 * 
 * @param priceData - Raw price data points from the API
 * @param currentEstimate - Current market estimate with bounds and indices
 * @returns Processed data points with forward-filled prices and interpolation flags
 */
export function processPriceHistory(
    priceData: MarketDataPoint[], 
    currentEstimate: MarketEstimate
): ProcessedDataPoint[] {
    // Group data points by timestamp and track prices for each outcome
    const timestampMap = new Map<number, { 
        upPrice?: number; 
        downPrice?: number; 
        hasData: boolean 
    }>();
    
    // Process all data points
    priceData.forEach((point) => {
        const timestamp = point.periodStartUnix;
        if (!timestamp) return;
        
        if (!timestampMap.has(timestamp)) {
            timestampMap.set(timestamp, { hasData: false });
        }
        
        const entry = timestampMap.get(timestamp)!;
        
        // Check if this is UP or DOWN outcome data
        if (point.outcomeIndex === currentEstimate.upIndex && point.price !== undefined) {
            entry.upPrice = point.price;
            entry.hasData = true;
        } else if (point.outcomeIndex === currentEstimate.downIndex && point.price !== undefined) {
            entry.downPrice = point.price;
            entry.hasData = true;
        }
    });
    
    // Convert to array and sort by timestamp
    const sortedTimestamps = Array.from(timestampMap.keys()).sort((a, b) => a - b);
    
    // Track last known prices for forward-filling
    let lastUpPrice = 0.5; // Default to 50% if no initial price
    let lastDownPrice = 0.5;
    let lastDataPoint = -1;
    
    // Build estimates array with forward-filled prices
    const estimates = sortedTimestamps.map((timestamp, index) => {
        const entry = timestampMap.get(timestamp)!;
        const hasNewData = entry.hasData;
        
        // Update last known prices if available
        if (entry.upPrice !== undefined) {
            lastUpPrice = entry.upPrice;
            lastDataPoint = index;
        }
        if (entry.downPrice !== undefined) {
            lastDownPrice = entry.downPrice;
            lastDataPoint = index;
        }
        
        // Calculate market estimate from UP price
        const estimate = currentEstimate.lower + (currentEstimate.range * lastUpPrice);
        
        return {
            timestamp,
            estimate,
            upPrice: lastUpPrice * 100, // Convert to percentage
            downPrice: lastDownPrice * 100,
            isInterpolated: !hasNewData && lastDataPoint >= 0
        };
    });
    
    return estimates;
}

/**
 * Split processed data into real and interpolated datasets for chart display
 * This allows showing interpolated data with different styling (e.g., dashed lines)
 * 
 * @param estimates - Processed data points with interpolation flags
 * @returns Two arrays: one for real data points, one for interpolated data
 */
export function splitDataByInterpolation(estimates: ProcessedDataPoint[]): {
    realData: (number | null)[];
    interpolatedData: (number | null)[];
} {
    const realData: (number | null)[] = [];
    const interpolatedData: (number | null)[] = [];
    
    estimates.forEach((point, index) => {
        if (!point.isInterpolated) {
            realData.push(point.estimate);
            // Add null to interpolated to maintain alignment
            interpolatedData.push(null);
        } else {
            // For interpolated points, add to both datasets to connect lines
            if (index > 0 && !estimates[index - 1].isInterpolated) {
                // First interpolated point - add to both for connection
                realData.push(point.estimate);
                interpolatedData.push(point.estimate);
            } else if (index < estimates.length - 1 && !estimates[index + 1].isInterpolated) {
                // Last interpolated point - add to both for connection
                realData.push(point.estimate);
                interpolatedData.push(point.estimate);
            } else {
                // Middle interpolated points
                realData.push(null);
                interpolatedData.push(point.estimate);
            }
        }
    });
    
    return { realData, interpolatedData };
}

/**
 * Format timestamp for chart display based on time range
 * 
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatChartTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return '';
    }
    
    // Format based on time range
    const now = Date.now();
    const diff = now - (timestamp * 1000);
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
        // Within 24 hours, show time
        return date.toLocaleTimeString(undefined, { 
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (hours < 168) { // 7 days
        // Within a week, show day and time
        return date.toLocaleDateString(undefined, { 
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        // Older than a week, show date
        return date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric'
        });
    }
}