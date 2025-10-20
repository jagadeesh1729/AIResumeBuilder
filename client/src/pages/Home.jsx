import React, { Suspense, lazy } from 'react'
import Hero from '../components/home/Hero'
const Features = lazy(() => import('../components/home/Features'))
const CallToAction = lazy(() => import('../components/home/CallToAction'))
const Footer = lazy(() => import('../components/home/Footer'))

const Home = () => {
  return (
    <main className="relative bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero Section with decorative background */}
      <section aria-label="Hero" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(63,169,245,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(225,37,26,0.10),transparent_55%)]" />
        <Hero />
      </section>

      {/* Lazy-loaded sections for faster initial paint */}
      <Suspense fallback={<div className="py-10 text-center text-slate-400">Loading…</div>}>
        <section id="features">
          <Features />
        </section>
        <section id="cta">
          <CallToAction />
        </section>
        <Footer />
      </Suspense>
    </main>
  )
}

export default Home
