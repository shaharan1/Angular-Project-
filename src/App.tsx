/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './features/auth/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <MainLayout />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </ThemeProvider>
  );
}
