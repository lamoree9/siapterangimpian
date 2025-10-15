import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare, Calendar, Star, TrendingUp, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Review {
  id: string;
  week: string;
  wins: string;
  challenges: string;
  lessons: string;
  nextWeek: string;
  rating: number;
  createdAt: string;
}

const WeeklyReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentReview, setCurrentReview] = useState({
    wins: '',
    challenges: '',
    lessons: '',
    nextWeek: '',
    rating: 3
  });

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  const saveReview = () => {
    if (currentReview.wins || currentReview.challenges || currentReview.lessons) {
      const review: Review = {
        id: Date.now().toString(),
        week: `Week ${getWeekNumber()}, ${new Date().getFullYear()}`,
        ...currentReview,
        createdAt: new Date().toISOString()
      };
      setReviews([review, ...reviews]);
      setCurrentReview({ wins: '', challenges: '', lessons: '', nextWeek: '', rating: 3 });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="w-8 h-8" />
            Weekly Review
          </h1>
          <p className="text-muted-foreground mt-1">
            Evaluasi mingguan untuk refleksi dan perencanaan
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Review Minggu Ini</TabsTrigger>
            <TabsTrigger value="history">Riwayat Review</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Week {getWeekNumber()}, {new Date().getFullYear()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold">Pencapaian & Wins</h3>
                  </div>
                  <Textarea
                    placeholder="Apa pencapaian terbaik minggu ini?"
                    value={currentReview.wins}
                    onChange={(e) => setCurrentReview({ ...currentReview, wins: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold">Tantangan & Hambatan</h3>
                  </div>
                  <Textarea
                    placeholder="Apa tantangan yang dihadapi?"
                    value={currentReview.challenges}
                    onChange={(e) => setCurrentReview({ ...currentReview, challenges: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Pelajaran & Insights</h3>
                  </div>
                  <Textarea
                    placeholder="Apa yang dipelajari minggu ini?"
                    value={currentReview.lessons}
                    onChange={(e) => setCurrentReview({ ...currentReview, lessons: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Rencana Minggu Depan</h3>
                  </div>
                  <Textarea
                    placeholder="Apa yang ingin dicapai minggu depan?"
                    value={currentReview.nextWeek}
                    onChange={(e) => setCurrentReview({ ...currentReview, nextWeek: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Rating Minggu Ini</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Button
                        key={rating}
                        variant={currentReview.rating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentReview({ ...currentReview, rating })}
                      >
                        <Star className={`w-4 h-4 ${currentReview.rating >= rating ? 'fill-current' : ''}`} />
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={saveReview} className="w-full">
                  Simpan Review
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Tips Weekly Review</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Lakukan review di akhir minggu atau awal minggu baru</li>
                  <li>Jujur dengan diri sendiri tentang pencapaian dan kegagalan</li>
                  <li>Fokus pada progress, bukan kesempurnaan</li>
                  <li>Gunakan insights untuk improve minggu depan</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Belum ada review tersimpan. Mulai dengan mengisi review minggu ini!
                </CardContent>
              </Card>
            ) : (
              reviews.map(review => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{review.week}</CardTitle>
                      <Badge>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {review.rating}/5
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {review.wins && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Wins
                        </h4>
                        <p className="text-sm text-muted-foreground">{review.wins}</p>
                      </div>
                    )}
                    {review.challenges && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-orange-500" />
                          Challenges
                        </h4>
                        <p className="text-sm text-muted-foreground">{review.challenges}</p>
                      </div>
                    )}
                    {review.lessons && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4 text-blue-500" />
                          Lessons
                        </h4>
                        <p className="text-sm text-muted-foreground">{review.lessons}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WeeklyReview;
