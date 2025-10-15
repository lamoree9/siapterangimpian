import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EnergyProgressRingProps {
  label: string;
  description: string;
  icon: LucideIcon;
  value: number;
  color: string;
  onChange: (value: number) => void;
}

const ENERGY_COLORS: Record<number, string> = {
  1: 'from-red-500 to-red-600',
  2: 'from-orange-500 to-orange-600',
  3: 'from-yellow-500 to-yellow-600',
  4: 'from-green-500 to-green-600',
  5: 'from-blue-500 to-blue-600'
};

const ENERGY_LABELS: Record<number, string> = {
  1: 'Sangat Rendah',
  2: 'Rendah',
  3: 'Sedang',
  4: 'Tinggi',
  5: 'Sangat Tinggi'
};

export const EnergyProgressRing: React.FC<EnergyProgressRingProps> = ({
  label,
  description,
  icon: Icon,
  value,
  color,
  onChange
}) => {
  const percentage = (value / 5) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="group relative p-6 rounded-xl bg-gradient-to-br from-background to-muted/30 border hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-4">
        <div className="relative">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke={`url(#gradient-${label})`}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={ENERGY_COLORS[value].split(' ')[0].replace('from-', 'stop-color-')} />
                <stop offset="100%" className={ENERGY_COLORS[value].split(' ')[1].replace('to-', 'stop-color-')} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className={`w-8 h-8 mb-1 ${color}`} />
            <span className="text-2xl font-bold">{value}</span>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-1">{label}</h4>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="text-xs font-medium text-primary mb-2">
            {ENERGY_LABELS[value]}
          </div>
          
          {/* Interactive buttons */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => onChange(level)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  value >= level
                    ? `bg-gradient-to-br ${ENERGY_COLORS[level]} border-transparent text-white scale-110`
                    : 'border-muted-foreground/20 hover:border-primary/50 hover:scale-105'
                }`}
                aria-label={`Set ${label} to ${level}`}
              >
                <span className="text-xs font-medium">{level}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
