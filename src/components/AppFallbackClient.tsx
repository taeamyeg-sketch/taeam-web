'use client';

import { useEffect, useState } from 'react';
import { AppFallback, type AppBrand } from './AppFallback';

/**
 * Client wrapper that builds the "open in app" deep link from the REAL URL.
 *
 * Static export bakes a placeholder param into each dynamic route (e.g.
 * generateStaticParams → id: 'order'), and Cloudflare Pages 200-rewrites the
 * real URL (/orders/<uuid>/track) onto that placeholder page. Crucially,
 * `useParams()` then returns the build-time placeholder ('order'), NOT the real
 * id — which is why the deep link used to be `taeam://orders/order/track` and
 * the app showed "order not found". So we read the actual id from
 * `window.location.pathname` on the client and rebuild the deep link from it.
 *
 * The deep link is reconstructed from the full pathname so it works regardless
 * of where the id sits (/orders/<id>/track, /merchant/orders/<id>, …). The app
 * folds the custom-scheme host back into its path, so scheme:// + pathname
 * parses identically to the https form.
 */
export function AppFallbackClient({
  brand,
  title,
  subtitle,
  deepLinkTemplate,
  detailTemplate,
}: {
  brand: AppBrand;
  title: string;
  subtitle: string;
  /** (unused) retained for call-site compatibility. */
  paramKey?: string;
  /** e.g. "taeam://orders/{segment}/track" — only the scheme + shape is used. */
  deepLinkTemplate: string;
  /** e.g. "Order {segment}" — omit to show no detail line. */
  detailTemplate?: string;
}) {
  const scheme = deepLinkTemplate.split('://')[0];
  const templateBody = deepLinkTemplate.split('://')[1] ?? '';

  // Start with the scheme only; corrected to the real deep link on the client
  // once window.location is readable (this component never runs meaningfully
  // during static export).
  const [deepLink, setDeepLink] = useState(`${scheme}://`);
  const [detail, setDetail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const pathSegs = window.location.pathname.split('/').filter(Boolean);
    setDeepLink(`${scheme}://${pathSegs.join('/')}${window.location.search}`);

    if (detailTemplate) {
      // The template body (host + path, e.g. "orders/{segment}/track") aligns
      // 1:1 with the real pathname segments, so the placeholder's index gives
      // us the real id to display.
      const tplSegs = templateBody.split('/');
      const i = tplSegs.indexOf('{segment}');
      const id = i >= 0 ? pathSegs[i] : undefined;
      if (id) setDetail(detailTemplate.replace('{segment}', id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppFallback
      brand={brand}
      title={title}
      subtitle={subtitle}
      deepLink={deepLink}
      detail={detail}
    />
  );
}
