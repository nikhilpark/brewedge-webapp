import Link from 'next/link';
import {AuthRedirect} from '@/components/AuthRedirect';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default async function Home() {

  const cookieStore = await cookies();

  if (cookieStore.has('accessToken')) {
    redirect('/dashboard');
  }

  return (
    <>
    {/* <AuthRedirect/> */}
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">☕</span>
              </div>
              <span className="font-serif font-bold text-xl hidden sm:inline">Brew Edge</span>
            </Link>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-muted">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6 text-balance">
            Document Your Coffee Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance leading-relaxed">
            Brew Edge is a specialty coffee recipe logging and community platform. Track your brewing variables, tasting notes, and share your discoveries with fellow coffee enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 text-lg">
                Start logging
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-muted font-medium px-8 py-3 text-lg">
                See community recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Why Brew Edge?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-xl font-serif font-bold mb-3">Log Recipes</h3>
              <p className="text-muted-foreground">
                Track all your brewing variables: grind size, water temperature, brew time, coffee-to-water ratio, and more.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-serif font-bold mb-3">Community</h3>
              <p className="text-muted-foreground">
                Share your recipes with other coffee enthusiasts. Rate and discover brewing methods from around the world.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="text-xl font-serif font-bold mb-3">Perfect Your Craft</h3>
              <p className="text-muted-foreground">
                Learn from ratings, tasting notes, and techniques shared by the specialty coffee community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brewing Methods Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Track All Brewing Methods</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['V60', 'AeroPress', 'Chemex', 'French Press', 'Espresso', 'Cold Brew', 'Moka Pot', 'Turkish'].map(
              (method) => (
                <div
                  key={method}
                  className="bg-muted rounded-lg p-6 text-center border border-border hover:border-primary transition"
                >
                  <p className="font-medium text-foreground">{method}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 text-primary-foreground">
            Ready to brew smarter?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Join the Brew Edge community today and start documenting your coffee journey.
          </p>
          <Link href="/signup">
            <Button className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-medium px-8 py-3 text-lg">
              Create account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Brew Edge. A specialty coffee recipe platform.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
