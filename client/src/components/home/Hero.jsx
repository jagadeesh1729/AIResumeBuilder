import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

// Navigation links for both desktop and mobile
const NAV_LINKS = [
  { href: '#', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#cta', label: 'Contact' },
]

const Hero = () => {
  const { user } = useSelector(state => state.auth)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <>
      <div className="min-h-screen pb-20 animate-fade-in flex flex-col">
        {/* Navbar */}
        <header className="z-50 w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
          <nav className="flex items-center justify-between">
            <a href="/" aria-label="Resume Builder home" className="inline-flex items-center">
              <img src="/jamicajobZ.png" alt="Resume Builder logo" className="h-12 md:h-14 xl:h-32 w-auto"/>
            </a>

            <ul className="hidden md:flex items-center gap-8 text-slate-800">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-[var(--brand-primary)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:flex gap-2">
              {!user && (
                <>
                  <Link to='/app?state=register' className="px-6 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] active:scale-95 transition-all rounded-full text-white">
                    Get started
                  </Link>
                  <Link to='/app?state=login' className="px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900">
                    Login
                  </Link>
                </>
              )}
              {user && (
                <Link to='/app' className='px-8 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] active:scale-95 transition-all rounded-full text-white'>
                  Dashboard
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden active:scale-90 transition"
              aria-label="Open menu"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                <path d="M4 5h20M4 12h20M4 19h20" />
              </svg>
            </button>
          </nav>
        </header>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ul className="flex flex-col items-center gap-6 ">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className={`transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-4'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <a href={link.href} className="text-white hover:text-[var(--brand-primary)] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="active:ring-2 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] transition text-white rounded-md flex"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-grow flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
          {/* Decorative blobs */}
          <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-[var(--brand-primary)] blur-[100px] opacity-30"></div>
          <div className="absolute flex  -top-6 right-10 -z-10 size-40 sm:size-56 bg-[var(--brand-accent)] blur-[90px] opacity-20"></div>

          {/* Headline + CTA */}
          <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px] animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Land your dream job with{' '}
            <span className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] bg-clip-text text-transparent text-nowrap animate-gradient bg-[200%_auto]">AI-powered</span>{' '}
            resumes.
          </h1>

          <p className="max-w-md text-center text-base my-7 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Create, edit and download professional resumes with AI-powered assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mt-2 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }} >
            <Link to='/app' className="bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-[var(--brand-primary)] flex items-center transition-colors">
              Get started
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 size-4 group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes gradient {
            to {
              background-position: -200% center;
            }
          }
          .animate-gradient {
            animation: gradient 3s linear infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-in-out;
          }
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slide-up 0.5s ease-out;
          }
        `}
      </style>
    </>
  )
}

export default Hero
