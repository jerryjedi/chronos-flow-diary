
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { mockEvents } from '@/data/mockData';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get categories and their counts
  const categoriesWithCount = useMemo(() => {
    const counts = mockEvents.reduce<Record<string, number>>((acc, event) => {
      if (event.category) {
        acc[event.category] = (acc[event.category] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([category, count]) => ({
        name: category,
        count
      }));
  }, []);

  // Get top 10 categories
  const topCategories = categoriesWithCount.slice(0, 10);
  const hasMoreCategories = categoriesWithCount.length > 10;

  // Get events for selected category
  const categoryEvents = useMemo(() => {
    if (!selectedCategory) return [];
    return mockEvents
      .filter(event => event.category === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedCategory]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-purple-500">Categories</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {topCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex gap-2"
                >
                  {category.name}
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </Button>
              ))}
            </div>

            {hasMoreCategories && (
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="More categories..." />
                </SelectTrigger>
                <SelectContent>
                  {categoriesWithCount.slice(10).map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {selectedCategory && (
          <Card>
            <CardHeader>
              <CardTitle>Events in {selectedCategory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), 'PPP')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
