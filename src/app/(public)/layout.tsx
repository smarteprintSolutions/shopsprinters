'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader =
    pathname?.startsWith('/easy-setup-guide') ||
    pathname?.startsWith('/search-model') ||
    pathname?.startsWith('/complete-setup') ||
    pathname?.startsWith('/installation-failed');
  const hideFooter =
    pathname?.startsWith('/search-model') ||
    pathname?.startsWith('/complete-setup') ||
    pathname?.startsWith('/installation-failed');

  return (
    <>
      <Script
        id="jivochat-deferred"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function loadJivo() {
                var s = document.createElement('script');
                s.src = '//code.jivosite.com/widget/Tt7Z2rjzUJ';
                s.async = true;
                document.body.appendChild(s);
              }

              if ('requestIdleCallback' in window) {
                requestIdleCallback(loadJivo);
              } else {
                setTimeout(loadJivo, 3000);
              }
            })();
          `,
        }}
      />

      {!hideHeader && <Header />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}

