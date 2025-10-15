
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Timer, Battery, CheckSquare, Target } from "lucide-react";
import { IntentionForm } from "@/components/self-development/IntentionForm";
import { PomodoroTimer } from "@/components/self-development/PomodoroTimer";
import { EnergyCheckIn } from "@/components/self-development/EnergyCheckIn";
import { SelfManagement } from "@/components/self-development/SelfManagement";
import { SpiritualDashboard } from "@/components/self-development/SpiritualDashboard";

const SelfDevelopment = () => {
  const [activeTab, setActiveTab] = useState("intention");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Pengembangan Diri</h1>
          <p className="text-muted-foreground">
            Kelola niat harian, fokus, energi, dan spiritualitas untuk kehidupan yang lebih bermakna.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="intention" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Niat Harian</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <Battery className="w-4 h-4" />
              <span className="hidden sm:inline">Energi</span>
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Management</span>
            </TabsTrigger>
            <TabsTrigger value="spiritual" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Spiritual</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intention" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Niat Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IntentionForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Pomodoro Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PomodoroTimer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="w-5 h-5" />
                  Check-in Energi Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnergyCheckIn />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Self Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SelfManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spiritual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Dashboard Spiritual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpiritualDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SelfDevelopment;
