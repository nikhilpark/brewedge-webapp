'use client';

import { useState } from 'react';
import { GRINDER_MODELS } from '@/lib/api';
import { convertGrinderSetting } from '@/lib/grinderConversion';
import Link from 'next/link';

export default function GrindConverterPage() {
  const [fromGrinderId, setFromGrinderId] = useState('comandante-c40');
  const [fromSetting, setFromSetting] = useState(22);
  const [toGrinderId, setToGrinderId] = useState('timemore-c3');
  const [result, setResult] = useState<number | null>(null);

  const fromGrinder = GRINDER_MODELS.find(g => g.id === fromGrinderId);
  const toGrinder = GRINDER_MODELS.find(g => g.id === toGrinderId);

  const handleConvert = () => {
    if (!fromGrinder || !toGrinder || !fromSetting) return;
    const converted = convertGrinderSetting(fromGrinderId, fromSetting, toGrinderId);
    setResult(converted);
  };

  const handleSwap = () => {
    setFromGrinderId(toGrinderId);
    setToGrinderId(fromGrinderId);
    if (result !== null) {
      setFromSetting(result);
      setResult(null);
    }
  };

  const unitLabel = (grinder: typeof fromGrinder) =>
    grinder?.settingType === 'clicks' ? 'clicks' : 'dial';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/explore" className="text-sm text-primary hover:underline">
          ← Back to Explore
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Grind Setting Converter</h1>
        <p className="text-muted-foreground">
          Convert your grind setting from one grinder to another. Remember: conversions are approximate — always taste and adjust!
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        {/* From Grinder */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            From Grinder
          </label>
          <select
            value={fromGrinderId}
            onChange={(e) => setFromGrinderId(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {GRINDER_MODELS.map((grinder) => (
              <option key={grinder.id} value={grinder.id}>
                {grinder.name}
              </option>
            ))}
          </select>
        </div>

        {/* From Setting */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Your Current Setting
          </label>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="number"
                value={fromSetting}
                onChange={(e) => setFromSetting(Number(e.target.value))}
                min={fromGrinder?.minSetting}
                max={fromGrinder?.maxSetting}
                className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter setting"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Range: {fromGrinder?.minSetting} - {fromGrinder?.maxSetting} {unitLabel(fromGrinder)}
              </p>
            </div>
            <button
              onClick={handleConvert}
              className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition whitespace-nowrap"
            >
              Convert
            </button>
          </div>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-muted/30 rounded-md p-4 border-l-4 border-accent">
            <p className="text-sm text-muted-foreground mb-2">Approximate equivalent:</p>
            <p className="text-2xl font-bold text-foreground">
              {result} {unitLabel(toGrinder)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Always taste and adjust to your preference!
            </p>
          </div>
        )}

        {/* Swap Button */}
        {result !== null && (
          <button
            onClick={handleSwap}
            className="w-full py-2 px-3 text-sm font-medium bg-muted text-foreground hover:bg-muted/80 rounded-md transition"
          >
            ↔ Swap Grinders & Convert Back
          </button>
        )}

        {/* To Grinder */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label className="block text-sm font-semibold text-foreground">
            To Grinder
          </label>
          <select
            value={toGrinderId}
            onChange={(e) => setToGrinderId(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {GRINDER_MODELS.map((grinder) => (
              <option key={grinder.id} value={grinder.id}>
                {grinder.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Range: {toGrinder?.minSetting} - {toGrinder?.maxSetting} {unitLabel(toGrinder)}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-muted/30 rounded-lg border border-border p-6">
        <h2 className="font-semibold text-foreground mb-3">How It Works</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This converter normalizes your setting as a percentage of your grinder's total range, then applies that percentage to the target grinder's range. It's a good starting point, but every grinder has different burr geometry.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Pro tip:</strong> Use this as a reference, then adjust up or down based on your taste. A few clicks difference can significantly impact extraction.
        </p>
      </div>
    </div>
  );
}
