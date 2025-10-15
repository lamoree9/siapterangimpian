
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DreamStats } from '@/types/dream';
import { Target, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DreamStatsComponentProps {
  stats: DreamStats;
}

const CATEGORY_LABELS = {
  house: 'Rumah',
  car: 'Kendaraan',
  career: 'Karier',
  worship: 'Ibadah',
  education: 'Pendidikan',
  health: 'Kesehatan',
  travel: 'Perjalanan',
  business: 'Bisnis',
  family: 'Keluarga',
  other: 'Lainnya',
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88', '#ff0088'];

export const DreamStatsComponent = ({ stats }: DreamStatsComponentProps) => {
  const categoryData = stats.categoryCounts.map(item => ({
    name: CATEGORY_LABELS[item.category],
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{stats.totalDreams}</div>
            <p className="text-sm text-muted-foreground">Total Impian</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{stats.completedSteps}</div>
            <p className="text-sm text-muted-foreground">Langkah Selesai</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-8 w-8 text-orange-600 mb-2" />
            <div className="text-2xl font-bold">{stats.totalSteps}</div>
            <p className="text-sm text-muted-foreground">Total Langkah</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{Math.round(stats.averageProgress)}%</div>
            <p className="text-sm text-muted-foreground">Rata-rata Progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori Impian</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                Belum ada data untuk ditampilkan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Count Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Impian per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                Belum ada data untuk ditampilkan
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Deadline Terdekat</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingDeadlines.map((item) => (
                  <div key={item.dreamId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.dreamName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.deadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      {Math.ceil((new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Belum ada deadline yang ditetapkan
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recently Updated */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentlyUpdated.length > 0 ? (
              <div className="space-y-3">
                {stats.recentlyUpdated.map((item) => (
                  <div key={item.dreamId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.dreamName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      Diperbarui
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Belum ada aktivitas terbaru
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress Keseluruhan</span>
                <span>{Math.round(stats.averageProgress)}%</span>
              </div>
              <Progress value={stats.averageProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {stats.totalSteps > 0 ? Math.round((stats.completedSteps / stats.totalSteps) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Langkah Terselesaikan</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {stats.totalSteps - stats.completedSteps}
                </div>
                <p className="text-xs text-muted-foreground">Langkah Tersisa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
