import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'creator-distribution-funnel-sample.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    // Skip header
    const dataLines = lines.slice(1);

    // Aggregators
    let totalImpressions = 0;
    let totalWatchTime = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    const platformTotals: Record<string, number> = {};
    const cohortByDate: Record<string, { date: string, Viewers: number, Builders: number, Allocators: number }> = {};

    dataLines.forEach(line => {
      const cols = line.split(',');
      if (cols.length < 10) return;

      const date = cols[0];
      const platform = cols[2];
      const audience = cols[4];
      const impressions = parseInt(cols[5]) || 0;
      const watchTime = parseInt(cols[6]) || 0;
      const clicks = parseInt(cols[8]) || 0;
      const conversions = parseInt(cols[9]) || 0;

      // Funnel
      totalImpressions += impressions;
      totalWatchTime += watchTime;
      totalClicks += clicks;
      totalConversions += conversions;

      // Platform Split (using impressions as the metric)
      if (!platformTotals[platform]) platformTotals[platform] = 0;
      platformTotals[platform] += impressions;

      // Cohort Trend (group by date, mapping audience to their specific metric)
      // Using impressions as the main engagement metric for trend
      if (!cohortByDate[date]) {
        cohortByDate[date] = { date, Viewers: 0, Builders: 0, Allocators: 0 };
      }
      
      if (audience === 'Everyday viewers') cohortByDate[date].Viewers += impressions;
      else if (audience === 'Builders') cohortByDate[date].Builders += impressions;
      else if (audience === 'Allocators') cohortByDate[date].Allocators += impressions;
    });

    const funnelData = [
      { stage: 'Impressions', count: totalImpressions, fill: '#3b82f6' },
      { stage: 'Watch Time (hrs)', count: totalWatchTime, fill: '#8b5cf6' },
      { stage: 'Clicks (CTR)', count: totalClicks, fill: '#ec4899' },
      { stage: 'Conversions', count: totalConversions, fill: '#10b981' }
    ];

    const platformColors: Record<string, string> = {
      'YouTube': '#ef4444',
      'TikTok': '#06b6d4',
      'Instagram': '#d946ef',
      'X': '#1d4ed8',
      'LinkedIn': '#0284c7'
    };

    const platformData = Object.keys(platformTotals).map(name => ({
      name,
      value: platformTotals[name],
      fill: platformColors[name] || '#64748b'
    }));

    // Sort dates
    const sortedDates = Object.keys(cohortByDate).sort();
    const cohortData = sortedDates.map(date => cohortByDate[date]);

    return NextResponse.json({
      funnelData,
      platformData,
      cohortData,
      totals: {
        viewers: totalImpressions, // roughly
        builders: totalClicks,
        allocators: totalConversions
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}
