'use client';

import { useParams } from 'next/navigation';
import { AppFallback, type AppBrand } from './AppFallback';

/**
 * Client wrapper that reads the dynamic URL segment at runtime and feeds it into
 * the (otherwise static) AppFallback skeleton. Used by every dynamic deep-link
 * route (/orders/[id]/..., /restaurant/[id], /promo/[code], /merchant/orders/[id]).
 *
 * Static export emits one HTML file per route via the parent server page's
 * generateStaticParams placeholder; the real id is whatever is in the URL, read
 * here on the client, and resolved by the Cloudflare Pages _redirects fallback.
 *
 * {segment} in the templates is replaced with the captured param value.
 */
export function AppFallbackClient({
  brand,
  title,
  subtitle,
  paramKey,
  deepLinkTemplate,
  detailTemplate,
}: {
  brand: AppBrand;
  title: string;
  subtitle: string;
  /** Which dynamic segment to read, e.g. "id" or "code". */
  paramKey: string;
  /** e.g. "taeam://orders/{segment}/track" */
  deepLinkTemplate: string;
  /** e.g. "Order {segment}" — omit to show no detail line. */
  detailTemplate?: string;
}) {
  const params = useParams();
  const raw = params[paramKey];
  const segment = (Array.isArray(raw) ? raw[0] : raw) ?? '';

  const deepLink = deepLinkTemplate.replace('{segment}', segment);
  const detail =
    detailTemplate && segment ? detailTemplate.replace('{segment}', segment) : undefined;

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
