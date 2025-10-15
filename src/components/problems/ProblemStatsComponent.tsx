
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProblemStats } from '@/types/problem';
import { BarChart3, TrendingUp, Heart, Target } from 'lucide-react';

interface ProblemStatsComponentProps {
  stats: ProblemStats;
}

export const ProblemStatsComponent = ({ stats }: ProblemStatsComponentProps) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProblems}</div>
            <p className="text-sm text-muted-foreground">Total Masalah</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.activeProblems}</div>
            <p className="text-sm text-muted-foreground">Belum Diatasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolvedProblems}</div>
            <p className="text-sm text-muted-foreground">Sudah Tuntas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageDifficulty.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Rata-rata Kesulitan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribusi per Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.categoryDistribution.length > 0 ? (
              <div className="space-y-3">
                {stats.categoryDistribution.map(item => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ 
                            width: `${(item.count / Math.max(...stats.categoryDistribution.map(c => c.count))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Belum ada data kategori</p>
            )}
          </CardContent>
        </Card>

        {/* Most Common Emotions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Emosi Paling Sering
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.mostCommonEmotions.length > 0 ? (
              <div className="space-y-3">
                {stats.mostCommonEmotions.map(item => (
                  <div key={item.emotion} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{item.emotion}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-400"
                          style={{ 
                            width: `${(item.count / Math.max(...stats.mostCommonEmotions.map(e => e.count))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Belum ada data emosi</p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Insight Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.weeklyInsights.newProblems}
                </div>
                <p className="text-sm text-muted-foreground">Masalah Baru Minggu Ini</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.weeklyInsights.resolvedProblems}
                </div>
                <p className="text-sm text-muted-foreground">Masalah Diselesaikan</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600 capitalize">
                  {stats.weeklyInsights.mostActiveCategory}
                </div>
                <p className="text-sm text-muted-foreground">Kategori Paling Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resolution Rate */}
      {stats.totalProblems > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Tingkat Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Progress Keseluruhan</span>
              <span className="text-sm font-medium">
                {Math.round((stats.resolvedProblems / stats.totalProblems) * 100)}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ 
                  width: `${(stats.resolvedProblems / stats.totalProblems) * 100}%` 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.resolvedProblems} dari {stats.totalProblems} masalah telah diselesaikan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
