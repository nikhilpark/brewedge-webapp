'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const METHODS = ['V60', 'AeroPress', 'Chemex', 'French Press', 'Espresso', 'Cold Brew', 'Other'] as const;

export default function RecipeForm({ initialRecipe, onSubmit, isLoading = false }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: initialRecipe?.title || '',
    method: (initialRecipe?.method || 'V60') as typeof METHODS[number],
    grindSize: initialRecipe?.grindSize || '',
    waterTempCelsius: initialRecipe?.waterTempCelsius || 195,
    coffeeGrams: initialRecipe?.coffeeGrams || 20,
    waterGrams: initialRecipe?.waterGrams || 300,
    bloomTimeSeconds: initialRecipe?.bloomTimeSeconds || 45,
    totalBrewTimeSeconds: initialRecipe?.totalBrewTimeSeconds || 210,
    tastingNotes: initialRecipe?.tastingNotes || '',
    personalRating: initialRecipe?.personalRating || 3,
    isPublic: initialRecipe?.isPublic ?? true,
    roaster: initialRecipe?.roaster || '',
    beanName: initialRecipe?.beanName || '',
    originNote: initialRecipe?.originNote || '',
  });

  const ratio = formData.coffeeGrams > 0 ? (formData.waterGrams / formData.coffeeGrams).toFixed(2) : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Recipe Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Morning V60 - Ethiopian Yirgacheffe"
          className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      {/* Method */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Brewing Method
        </label>
        <select
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value as typeof METHODS[number] })}
          className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        >
          {METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      {/* Grind Size */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Grind Size
        </label>
        <input
          type="text"
          value={formData.grindSize}
          onChange={(e) => setFormData({ ...formData, grindSize: e.target.value })}
          placeholder="e.g., Medium, Fine, Coarse"
          className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      {/* Coffee & Water */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Coffee (g)
          </label>
          <input
            type="number"
            value={formData.coffeeGrams}
            onChange={(e) => setFormData({ ...formData, coffeeGrams: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Water (g)
          </label>
          <input
            type="number"
            value={formData.waterGrams}
            onChange={(e) => setFormData({ ...formData, waterGrams: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Ratio Display */}
      <div className="bg-muted rounded-md p-4">
        <p className="text-sm text-muted-foreground">Water : Coffee Ratio</p>
        <p className="text-2xl font-serif font-bold text-foreground">1:{ratio}</p>
      </div>

      {/* Temperature & Times */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Water Temp (°C)
          </label>
          <input
            type="number"
            value={formData.waterTempCelsius}
            onChange={(e) => setFormData({ ...formData, waterTempCelsius: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bloom Time (s)
          </label>
          <input
            type="number"
            value={formData.bloomTimeSeconds}
            onChange={(e) => setFormData({ ...formData, bloomTimeSeconds: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Total Brew Time */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Total Brew Time (s)
        </label>
        <input
          type="number"
          value={formData.totalBrewTimeSeconds}
          onChange={(e) => setFormData({ ...formData, totalBrewTimeSeconds: parseFloat(e.target.value) })}
          className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      {/* Coffee Used Section */}
      <div className="bg-muted/30 rounded-md p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Coffee Used (Optional)</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Roaster
            </label>
            <input
              type="text"
              value={formData.roaster}
              onChange={(e) => setFormData({ ...formData, roaster: e.target.value })}
              placeholder="e.g., Onyx Coffee Lab"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bean Name
            </label>
            <input
              type="text"
              value={formData.beanName}
              onChange={(e) => setFormData({ ...formData, beanName: e.target.value })}
              placeholder="e.g., Ethiopia Gedeb"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Origin Notes
            </label>
            <input
              type="text"
              value={formData.originNote}
              onChange={(e) => setFormData({ ...formData, originNote: e.target.value })}
              placeholder="e.g., Ethiopian natural, floral and fruity"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Tasting Notes */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tasting Notes
        </label>
        <textarea
          value={formData.tastingNotes}
          onChange={(e) => setFormData({ ...formData, tastingNotes: e.target.value })}
          placeholder="Describe the flavor profile, aroma, mouthfeel..."
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      {/* Personal Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setFormData({ ...formData, personalRating: rating })}
              className={`text-2xl transition ${
                rating <= formData.personalRating ? 'text-accent' : 'text-muted opacity-30'
              }`}
              disabled={isLoading}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Public Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          className="w-4 h-4 rounded border-border cursor-pointer"
          disabled={isLoading}
        />
        <label htmlFor="isPublic" className="text-sm font-medium text-foreground cursor-pointer">
          Share to community
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
      >
        {isLoading ? 'Saving...' : initialRecipe ? 'Update Recipe' : 'Create Recipe'}
      </Button>
    </form>
  );
}
