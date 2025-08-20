import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { BaseComponentProps } from '../../../types';
import { ROUTES } from '../../../constants';

export interface HeaderProps extends BaseComponentProps {
  fixed?: boolean;
  transparent?: boolean;
  shadow?: boolean;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  fixed = false,
  transparent = false,
  shadow = true,
  logo,
  actions,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, current: location.pathname === ROUTES.DASHBOARD },
    { name: 'Meal Planning', href: ROUTES.MEAL_PLANNING, current: location.pathname.startsWith('/meal-planning') },
    { name: 'Food Logging', href: ROUTES.FOOD_LOGGING, current: location.pathname.startsWith('/food-logging') },
    { name: 'Progress', href: ROUTES.PROGRESS, current: location.pathname.startsWith('/progress') },
  ];

  const userNavigation = [
    { name: 'Profile', href: ROUTES.PROFILE },
    { name: 'Settings', href: ROUTES.SETTINGS },
  ];

  const baseClasses = [
    'w-full',
    'transition-all',
    'duration-200',
    'z-40',
  ];

  if (fixed) {
    baseClasses.push('fixed', 'top-0', 'left-0', 'right-0');
  }

  if (transparent) {
    baseClasses.push('bg-transparent');
  } else {
    baseClasses.push('bg-white', 'border-b', 'border-neutral-200');
  }

  if (shadow && !transparent) {
    baseClasses.push('shadow-sm');
  }

  const MenuIcon = ({ open }: { open: boolean }) => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );

  const defaultLogo = (
    <Link to={ROUTES.HOME} className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">N</span>
      </div>
      <span className="text-xl font-bold text-gradient">NutriPlan</span>
    </Link>
  );

  return (
    <header className={[...baseClasses, className].filter(Boolean).join(' ')}>
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo || defaultLogo}
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${item.current ? 'nav-link-active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {actions}
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 btn btn-ghost p-2">
                  <UserIcon />
                  <span className="text-sm font-medium">
                    {user?.firstName || 'User'}
                  </span>
                  <ChevronDownIcon />
                </button>

                {/* User Dropdown */}
                <div className="dropdown-menu opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.name || `${user?.firstName} ${user?.lastName}`}
                    </p>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                  
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-neutral-100">
                    <button
                      onClick={logout}
                      className="dropdown-item text-error-600 w-full text-left flex items-center space-x-2"
                    >
                      <LogoutIcon />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to={ROUTES.LOGIN} className="btn btn-ghost">
                  Sign in
                </Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary">
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost p-2"
              aria-label="Toggle mobile menu"
            >
              <MenuIcon open={isMobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            {isAuthenticated && (
              <nav className="space-y-2 mb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block nav-link ${item.current ? 'nav-link-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-neutral-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.name || `${user?.firstName} ${user?.lastName}`}
                    </p>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                  
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left nav-link text-error-600"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="block nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="block nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;