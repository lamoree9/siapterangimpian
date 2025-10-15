
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const SpiritualDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Dashboard Spiritual</h3>
        <p className="text-sm text-muted-foreground">
          Pantau dan tingkatkan praktik spiritual harian Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/dzikir-doa" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Dzikir & Doa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Timer dzikir dan koleksi doa harian
              </p>
            </CardContent>
          </Card>
        </a>
      </div>

      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold">Fitur Spiritual dalam Pengembangan</h4>
            <p className="text-sm text-muted-foreground">
              Fitur-fitur spiritual dashboard sedang dalam tahap pengembangan. 
              Sementara ini, Anda dapat menggunakan komponen spiritual yang tersedia di aplikasi ini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
