'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  className?: string;
}

export function MobileLayout({ children, showNavigation = true, className }: MobileLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-dark-900",
      "max-w-md mx-auto relative",
      "flex flex-col",
      className
    )}>
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-2 text-sm font-medium text-text-primary bg-dark-900 sticky top-0 z-40">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
          <div className="w-4 h-2 bg-white rounded-sm ml-1"></div>
          <div className="w-6 h-3 bg-white rounded-sm ml-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className={cn(
        "flex-1",
        showNavigation && "pb-20"
      )}>
        {children}
      </main>
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'md'
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      "w-full mx-auto px-4",
      maxWidthClasses[maxWidth],
      // Responsive padding
      "sm:px-6 md:px-8 lg:px-12",
      className
    )}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBack,
  onBack,
  rightElement,
  className
}: PageHeaderProps) {
  return (
    <header className={cn(
      "sticky top-12 z-30 bg-dark-900/95 backdrop-blur-xl",
      "border-b border-white/10",
      "px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            {title && (
              <h1 className="text-xl font-bold text-text-primary">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-tertiary">{subtitle}</p>
            )}
          </div>
        </div>
        {rightElement && (
          <div className="flex items-center gap-2">
            {rightElement}
          </div>
        )}
      </div>
    </header>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong';
}

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  const variants = {
    default: 'bg-white/5 border-white/10',
    subtle: 'bg-white/[0.02] border-white/5',
    strong: 'bg-white/10 border-white/20'
  };

  return (
    <div className={cn(
      "backdrop-blur-xl border rounded-2xl p-6",
      "shadow-glass",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6 | 8;
  className?: string;
}

export function GridLayout({ children, columns = 2, gap = 4, className }: GridLayoutProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const gridGap = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div className={cn(
      'grid',
      gridCols[columns],
      gridGap[gap],
      className
    )}>
      {children}
    </div>
  );
}