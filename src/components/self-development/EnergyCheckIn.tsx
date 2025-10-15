import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEnergy } from '@/hooks/useEnergy';
import { Battery, Flame, TrendingUp, TrendingDown, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { EnergyProgressRing } from './EnergyProgressRing';
import { EnergyTrendChart } from './EnergyTrendChart';
import { EnergyRadarChart } from './EnergyRadarChart';

const ENERGY_TYPES = [
  { key: 'physical' as const, label: 'Fisik', icon: Battery, description: 'Energi tubuh dan stamina', color: 'text-red-500', gradient: 'from-red-500 to-red-600' },
  { key: 'mental' as const, label: 'Mental', icon: Battery, description: 'Fokus dan kejernihan pikiran', color: 'text-blue-500', gradient: 'from-blue-500 to-blue-600' },
  { key: 'emotional' as const, label: 'Emosional', icon: Battery, description: 'Perasaan dan mood', color: 'text-pink-500', gradient: 'from-pink-500 to-pink-600' },
  { key: 'social' as const, label: 'Sosial', icon: Battery, description: 'Koneksi dengan orang lain', color: 'text-purple-500', gradient: 'from-purple-500 to-purple-600' },
  { key: 'spiritual' as const, label: 'Spiritual', icon: Battery, description: 'Hubungan dengan yang Ilahi', color: 'text-amber-500', gradient: 'from-amber-500 to-amber-600' }
];

export const EnergyCheckIn = () => {
  const { addCheckIn, getCheckInByDate, getSuggestions, getStats } = useEnergy();
  const [scores, setScores] = useState({
    physical: 3,
    mental: 3,
    emotional: 3,
    social: 3,
    spiritual: 3
  });
  const [notes, setNotes] = useState('');
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const existing = getCheckInByDate(today);
    if (existing) {
      setTodayCheckIn(existing);
      setScores({
        physical: existing.physical,
        mental: existing.mental,
        emotional: existing.emotional,
        social: existing.social,
        spiritual: existing.spiritual
      });
      setNotes(existing.notes || '');
    }
  }, [today, getCheckInByDate]);

  const handleScoreChange = (type: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [type]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCheckIn(today, scores, notes.trim() || undefined);
    setTodayCheckIn({ ...scores, notes: notes.trim() });
    setShowSuccess(true);
    toast.success('Check-in energi berhasil disimpan!');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const suggestions = getSuggestions(scores);
  const stats = getStats();

  const totalScore = scores.physical + scores.mental + scores.emotional + scores.social + scores.spiritual;
  const averageScore = (totalScore / 5).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Check-in Energi Harian
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Evaluasi tingkat energi Anda di berbagai aspek kehidupan untuk memahami pola dan meningkatkan keseimbangan hidup
        </p>
      </div>

      {/* Quick Stats Cards */}
      {stats.streak > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Hari Beruntun</div>
            </CardContent>
          </Card>

          {stats.comparison && (
            <Card className={`bg-gradient-to-br ${stats.comparison.trend === 'up' ? 'from-green-500/10 to-green-500/5 border-green-500/20' : 'from-orange-500/10 to-orange-500/5 border-orange-500/20'}`}>
              <CardContent className="p-4 text-center">
                {stats.comparison.trend === 'up' ? (
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                )}
                <div className={`text-2xl font-bold ${stats.comparison.trend === 'up' ? 'text-green-500' : 'text-orange-500'}`}>
                  {stats.comparison.percentageChange > 0 ? '+' : ''}{stats.comparison.percentageChange}%
                </div>
                <div className="text-xs text-muted-foreground">vs Minggu Lalu</div>
              </CardContent>
            </Card>
          )}

          {stats.quickStats && (
            <>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-blue-500">{stats.quickStats.bestDay.total}</div>
                  <div className="text-xs text-muted-foreground">Energi Tertinggi</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-xl font-bold text-purple-500 capitalize">
                    {ENERGY_TYPES.find(t => t.key === stats.quickStats?.mostConsistentCategory)?.label}
                  </div>
                  <div className="text-xs text-muted-foreground">Paling Konsisten</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Main Content - 2 Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Input Section */}
        <div className="space-y-6">
          <Card className="border-2 hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-primary" />
                Bagaimana energi Anda hari ini?
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Geser atau klik angka untuk mengatur level energi (1 = sangat rendah, 5 = sangat tinggi)
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {ENERGY_TYPES.map(({ key, label, icon, description, color }) => (
                    <EnergyProgressRing
                      key={key}
                      label={label}
                      description={description}
                      icon={icon}
                      value={scores[key]}
                      color={color}
                      onChange={(value) => handleScoreChange(key, value)}
                    />
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <span>Catatan Harian</span>
                    <span className="text-xs text-muted-foreground font-normal">(opsional)</span>
                  </label>
                  <Textarea
                    placeholder="Bagaimana perasaan Anda hari ini? Ada hal yang mempengaruhi energi Anda?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden"
                  size="lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    {todayCheckIn ? 'Update Check-in' : 'Simpan Check-in'}
                  </span>
                  {showSuccess && (
                    <span className="absolute inset-0 bg-green-500 animate-pulse"></span>
                  )}
                </Button>

                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="text-3xl font-bold text-primary mb-1">{averageScore}</div>
                  <div className="text-sm text-muted-foreground">Rata-rata Energi Hari Ini</div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Battery className="w-5 h-5 text-orange-600" />
                  Saran untuk Meningkatkan Energi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-white rounded-lg border border-orange-200 hover:shadow-md transition-shadow duration-200 hover:scale-105 transform"
                  >
                    <div className="font-medium text-sm capitalize mb-2 text-orange-700 flex items-center gap-2">
                      {ENERGY_TYPES.find(t => t.key === suggestion.type)?.icon && 
                        React.createElement(ENERGY_TYPES.find(t => t.key === suggestion.type)!.icon, { className: "w-4 h-4" })
                      }
                      {ENERGY_TYPES.find(t => t.key === suggestion.type)?.label}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Visualization Section */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="animate-fade-in">
            <EnergyRadarChart scores={scores} averageScores={stats.averageScores} />
          </div>

          {/* Trend Chart */}
          {stats.weeklyTrends.some(t => t.physical > 0) && (
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <EnergyTrendChart weeklyTrends={stats.weeklyTrends} />
            </div>
          )}

          {/* Average Scores Card */}
          {stats.averageScores.physical > 0 && (
            <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Rata-rata Energi Historis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {ENERGY_TYPES.map(({ key, label, icon: Icon, color, gradient }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="font-medium">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                            style={{ width: `${(stats.averageScores[key] / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold min-w-[2rem] text-right">
                          {stats.averageScores[key].toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
