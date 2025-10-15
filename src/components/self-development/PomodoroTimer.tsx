
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Play, Pause, Square, Settings, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export const PomodoroTimer = () => {
  const {
    currentSession,
    timeLeft,
    isRunning,
    settings,
    setTimeLeft,
    setIsRunning,
    startSession,
    completeSession,
    stopSession,
    saveSettings,
    getStats
  } = usePomodoro();

  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            completeSession();
            toast.success(
              currentSession?.type === 'focus' 
                ? 'Sesi fokus selesai! Saatnya istirahat.' 
                : 'Istirahat selesai! Siap untuk sesi berikutnya.'
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, currentSession, completeSession, setTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!currentSession) return 0;
    const totalTime = currentSession.duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const handleStart = (type: 'focus' | 'break') => {
    startSession(type);
    toast.info(`Memulai sesi ${type === 'focus' ? 'fokus' : 'istirahat'}`);
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
    toast.info(isRunning ? 'Timer dijeda' : 'Timer dilanjutkan');
  };

  const handleStop = () => {
    stopSession();
    toast.info('Timer dihentikan');
  };

  const handleSaveSettings = () => {
    saveSettings(localSettings);
    setShowSettings(false);
    toast.success('Pengaturan disimpan!');
  };

  const handleFocusDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setLocalSettings(prev => ({
      ...prev,
      focusDuration: Math.max(1, Math.min(120, value)) // Min 1, max 120 minutes
    }));
  };

  const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setLocalSettings(prev => ({
      ...prev,
      breakDuration: Math.max(1, Math.min(60, value)) // Min 1, max 60 minutes
    }));
  };

  const stats = getStats();

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pengaturan Pomodoro</h3>
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="focus">Durasi Fokus (menit)</Label>
            <Input
              id="focus"
              type="number"
              min="1"
              max="120"
              value={localSettings.focusDuration}
              onChange={handleFocusDurationChange}
              placeholder="Masukkan durasi fokus"
            />
            <p className="text-xs text-muted-foreground">
              Antara 1-120 menit
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="break">Durasi Istirahat (menit)</Label>
            <Input
              id="break"
              type="number"
              min="1"
              max="60"
              value={localSettings.breakDuration}
              onChange={handleBreakDurationChange}
              placeholder="Masukkan durasi istirahat"
            />
            <p className="text-xs text-muted-foreground">
              Antara 1-60 menit
            </p>
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Simpan Pengaturan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Sesi hari ini: {stats.todaySessions}
        </div>
      </div>

      <Card className="text-center">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-6xl font-mono font-bold">
              {currentSession ? formatTime(timeLeft) : '00:00'}
            </div>
            
            {currentSession && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground capitalize">
                  Sesi {currentSession.type === 'focus' ? 'Fokus' : 'Istirahat'}
                </div>
                <Progress value={getProgress()} className="w-full" />
              </div>
            )}

            <div className="flex justify-center gap-2">
              {!currentSession ? (
                <>
                  <Button onClick={() => handleStart('focus')} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Mulai Fokus
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleStart('break')}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Istirahat
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handlePause} variant="outline">
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button onClick={handleStop} variant="destructive">
                    <Square className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.todaySessions}</div>
            <div className="text-sm text-muted-foreground">Hari Ini</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.weekSessions}</div>
            <div className="text-sm text-muted-foreground">Minggu Ini</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{Math.round(stats.totalFocusTime / 60)}h</div>
            <div className="text-sm text-muted-foreground">Total Fokus</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
