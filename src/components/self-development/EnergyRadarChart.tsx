import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

interface EnergyRadarChartProps {
  scores: {
    physical: number;
    mental: number;
    emotional: number;
    social: number;
    spiritual: number;
  };
  averageScores: {
    physical: number;
    mental: number;
    emotional: number;
    social: number;
    spiritual: number;
  };
}

export const EnergyRadarChart: React.FC<EnergyRadarChartProps> = ({ scores, averageScores }) => {
  const data = [
    { dimension: 'Fisik', current: scores.physical, average: averageScores.physical },
    { dimension: 'Mental', current: scores.mental, average: averageScores.mental },
    { dimension: 'Emosional', current: scores.emotional, average: averageScores.emotional },
    { dimension: 'Sosial', current: scores.social, average: averageScores.social },
    { dimension: 'Spiritual', current: scores.spiritual, average: averageScores.spiritual }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          Profil Energi Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="dimension" 
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Radar 
              name="Hari Ini" 
              dataKey="current" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.6}
              strokeWidth={2}
            />
            {averageScores.physical > 0 && (
              <Radar 
                name="Rata-rata" 
                dataKey="average" 
                stroke="hsl(var(--muted-foreground))" 
                fill="hsl(var(--muted-foreground))" 
                fillOpacity={0.3}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-center mt-4 text-sm text-muted-foreground">
          {averageScores.physical > 0 ? 'Garis putus-putus = rata-rata historis' : 'Lakukan check-in lebih banyak untuk melihat perbandingan'}
        </div>
      </CardContent>
    </Card>
  );
};
