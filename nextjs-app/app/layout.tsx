// @ts-expect-error - CSS imports are not typed in TypeScript
import './globals.css';
import React from 'react';

type RootLayoutProps = {
  children: React.ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Next.js + React App',
  description: 'Estructura base para Next.js',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
