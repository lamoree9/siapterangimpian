
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Target, Clock, TrendingUp } from 'lucide-react';

export const SelfManagement = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Self Management Tools</h3>
        <p className="text-sm text-muted-foreground">
          Kumpulan alat untuk membantu mengelola diri dan produktivitas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/goal-setting" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-blue-500" />
                Goal Setting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tetapkan dan lacak tujuan jangka pendek dan panjang
              </p>
            </CardContent>
          </Card>
        </a>

        <a href="/time-blocking" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-green-500" />
                Time Blocking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rencanakan waktu Anda dengan metode time blocking
              </p>
            </CardContent>
          </Card>
        </a>

        <a href="/progress-tracking" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pantau kemajuan dalam berbagai aspek kehidupan
              </p>
            </CardContent>
          </Card>
        </a>

        <a href="/weekly-review" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="w-5 h-5 text-orange-500" />
                Weekly Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Evaluasi mingguan untuk refleksi dan perencanaan
              </p>
            </CardContent>
          </Card>
        </a>
      </div>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold">Fitur dalam Pengembangan</h4>
            <p className="text-sm text-muted-foreground">
              Fitur-fitur self management sedang dalam tahap pengembangan. 
              Saat ini Anda dapat menggunakan fitur Niat Harian, Pomodoro, dan Energy Check-in.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
