"use client";

import Script from "next/script";
import { CONSENT_STORAGE_KEY } from "@/lib/meta-pixel";

const META_PIXEL_ID = "716102357728118";

export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          // Hold all events until the visitor consents. PageView and any later
          // events (e.g. Lead) are queued and only sent once consent is granted.
          fbq('consent', 'revoke');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
          // Returning visitors who already accepted: grant immediately.
          try {
            if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted') {
              fbq('consent', 'grant');
            }
          } catch (e) {}
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
