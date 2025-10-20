import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const logoutUser = () => {
    navigate('/')
    dispatch(logout())
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className='shadow-sm bg-white sticky top-0 z-50'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-slate-800'>
        <Link to='/'>
          <img src="/jamicajobZ.png" alt="logo" className="h-12 xl:h-24 w-auto" />
        </Link>
        <div className='relative' ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='flex items-center gap-2 text-sm p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-primary)]'
          >
            <span className='max-sm:hidden font-medium text-slate-700'>Hi, {user?.name}</span>
            <div className='size-9 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] rounded-full flex items-center justify-center text-white font-bold'>
              {user?.name?.[0]?.toUpperCase() || <User size={20} />}
            </div>
          </button>

          {isMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 origin-top-right animate-fade-in-down'>
              <div className='px-4 py-2 text-xs text-slate-500 border-b'>
                <p className='font-semibold text-slate-700'>{user?.name}</p>
                <p>{user?.email}</p>
              </div>
              <button onClick={logoutUser} className='w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors'>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
