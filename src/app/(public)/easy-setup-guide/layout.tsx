import React from 'react';
import Script from 'next/script';

export default function EasySetupGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="brilliantlocco-script"
        strategy="beforeInteractive"
        src="https://ob.brilliantlocco.com/i/9d88900ee9cb1b2061004fe1a4f02a18.js"
        className="ct_clicktrue"
      />
      <Script
        id="gtag-script"
        strategy="beforeInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17904808678"
      />
      <Script
        id="gtag-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17904808678');`,
        }}
      />
      <noscript>
        <iframe
          src="https://ob.brilliantlocco.com/ns/9d88900ee9cb1b2061004fe1a4f02a18.html?ch="
          width="0"
          height="0"
          style={{ display: 'none' }}
        />
      </noscript>
      {children}
    </>
  );
}
