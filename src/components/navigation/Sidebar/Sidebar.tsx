import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { BaseComponentProps } from '../../../types';
import { ROUTES } from '../../../constants';

export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onCollapseChange,
  position = 'left',
  width = 'md',
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const location = useLocation();

  const widthClasses = {
    sm: collapsed ? 'w-16' : 'w-48',
    md: collapsed ? 'w-16' : 'w-64',
    lg: collapsed ? 'w-16' : 'w-80',
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      current: location.pathname === ROUTES.DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      name: 'Meal Planning',
      href: ROUTES.MEAL_PLANNING,
      current: location.pathname.startsWith('/meal-planning'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m9-9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-9-9v2m0 0V9a2 2 0 012-2h6a2 2 0 012 2v2M7 19h10" />
        </svg>
      ),
      children: [
        { name: 'Generator', href: ROUTES.MEAL_PLANNING_GENERATOR, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'Calendar', href: ROUTES.MEAL_PLANNING_CALENDAR, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'Current Plan', href: ROUTES.MEAL_PLANNING_CURRENT, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'History', href: ROUTES.MEAL_PLANNING_HISTORY, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'Grocery List', href: ROUTES.MEAL_PLANNING_GROCERY, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
      ],
    },
    {
      name: 'Food Logging',
      href: ROUTES.FOOD_LOGGING,
      current: location.pathname.startsWith('/food-logging'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      children: [
        { name: 'Add Food', href: ROUTES.FOOD_LOGGING_ADD, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'History', href: ROUTES.FOOD_LOGGING_HISTORY, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
      ],
    },
    {
      name: 'Voice Logging',
      href: ROUTES.VOICE_LOGGING,
      current: location.pathname.startsWith('/voice-logging'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      badge: 'Beta',
    },
    {
      name: 'Progress',
      href: ROUTES.PROGRESS,
      current: location.pathname.startsWith('/progress'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      children: [
        { name: 'Weight', href: ROUTES.PROGRESS_WEIGHT, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'Nutrition', href: ROUTES.PROGRESS_NUTRITION, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
        { name: 'Achievements', href: ROUTES.PROGRESS_ACHIEVEMENTS, icon: <div className="w-2 h-2 bg-current rounded-full" /> },
      ],
    },
  ];

  const bottomNavigation: NavigationItem[] = [
    {
      name: 'Settings',
      href: ROUTES.SETTINGS,
      current: location.pathname.startsWith('/settings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: ROUTES.PROFILE,
      current: location.pathname.startsWith('/profile'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const ChevronRightIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const CollapseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const depth = isChild ? 'pl-12' : 'pl-6';

    return (
      <div key={item.name}>
        {hasChildren && !collapsed ? (
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`w-full flex items-center justify-between nav-link ${depth} ${item.current ? 'nav-link-active' : ''}`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
            {!collapsed && (
              <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                <ChevronRightIcon />
              </div>
            )}
          </button>
        ) : (
          <Link
            to={item.href}
            className={`flex items-center nav-link ${depth} ${item.current ? 'nav-link-active' : ''}`}
            title={collapsed ? item.name : undefined}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
            {item.badge && !collapsed && (
              <span className="ml-auto badge badge-accent badge-sm">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = [
    'flex',
    'flex-col',
    'h-full',
    'bg-white',
    'border-r',
    'border-neutral-200',
    'transition-all',
    'duration-300',
    widthClasses[width],
    position === 'right' ? 'border-l border-r-0' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200">
        {!collapsed && (
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gradient">NutriPlan</span>
          </Link>
        )}
        
        {onCollapseChange && (
          <button
            onClick={() => onCollapseChange(!collapsed)}
            className="btn btn-ghost p-2"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`}>
              <CollapseIcon />
            </div>
          </button>
        )}
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user.name || `${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6 space-y-1">
          {navigation.map(item => renderNavigationItem(item))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-neutral-200">
        <nav className="px-4 py-4 space-y-1">
          {bottomNavigation.map(item => renderNavigationItem(item))}
          
          <button
            onClick={logout}
            className="w-full flex items-center nav-link pl-6 text-error-600"
            title={collapsed ? 'Sign out' : undefined}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!collapsed && <span>Sign out</span>}
            </div>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;