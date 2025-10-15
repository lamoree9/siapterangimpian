import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EnergyTrendChartProps {
  weeklyTrends: {
    date: string;
    physical: number;
    mental: number;
    emotional: number;
    social: number;
    spiritual: number;
  }[];
}

const ENERGY_COLORS = {
  physical: '#ef4444',
  mental: '#3b82f6',
  emotional: '#ec4899',
  social: '#8b5cf6',
  spiritual: '#f59e0b'
};

export const EnergyTrendChart: React.FC<EnergyTrendChartProps> = ({ weeklyTrends }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trend Energi 7 Hari Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrends}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip 
              labelFormatter={formatDate}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="physical" 
              stroke={ENERGY_COLORS.physical}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Fisik"
            />
            <Line 
              type="monotone" 
              dataKey="mental" 
              stroke={ENERGY_COLORS.mental}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Mental"
            />
            <Line 
              type="monotone" 
              dataKey="emotional" 
              stroke={ENERGY_COLORS.emotional}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Emosional"
            />
            <Line 
              type="monotone" 
              dataKey="social" 
              stroke={ENERGY_COLORS.social}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Sosial"
            />
            <Line 
              type="monotone" 
              dataKey="spiritual" 
              stroke={ENERGY_COLORS.spiritual}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Spiritual"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
