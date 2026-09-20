"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { Vo2MaxCard } from '@/components/ui/progress';

export const Vo2MaxCardDemo = () => {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center bg-background p-4">
      <Vo2MaxCard
        title="Vo2 Max"
        value={51}
        status="Excellent"
        progress={51}
        icon={<Heart size={20} />}
        description={
          <>
            Your Vo2 Max is in the{' '}
            <span className="font-semibold text-primary">Top 15%</span>
            <br />
            for your age and gender
          </>
        }
      />
    </div>
  );
};

export default Vo2MaxCardDemo;
