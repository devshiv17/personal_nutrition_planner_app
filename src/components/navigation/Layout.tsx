import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { useAuth } from '../../hooks/useAuth';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`;

const AppContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show sidebar/header on auth pages
  const isAuthPage = ['/login', '/register', '/', '/onboarding'].includes(location.pathname);
  const showNavigation = isAuthenticated && !isAuthPage;

  if (!showNavigation) {
    // Simple layout for auth pages and landing page
    return (
      <LayoutContainer>
        <MainContent style={{ maxWidth: 'none', padding: 0 }}>
          <Outlet />
        </MainContent>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <Header fixed />
      <AppContainer style={{ paddingTop: '64px' }}> {/* Account for fixed header height */}
        <SidebarContainer collapsed={sidebarCollapsed}>
          <Sidebar 
            collapsed={sidebarCollapsed}
            onCollapseChange={setSidebarCollapsed}
            width="md"
          />
        </SidebarContainer>
        <MainContainer>
          <MainContent>
            <Outlet />
          </MainContent>
        </MainContainer>
      </AppContainer>
    </LayoutContainer>
  );
};

export default Layout;