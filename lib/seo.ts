const DEFAULT_SITE_URL = "https://www.oliotyaugandasafaris.com";
const DEFAULT_R2_LOGO_PATH = "/nambi-uganda-safaris/images/fox_logo.webp";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getBaseUrl(rawValue: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  const value = rawValue?.trim();
  if (!value) return DEFAULT_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return stripTrailingSlash(new URL(withProtocol).toString());
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function toAbsoluteUrl(pathOrUrl: string, baseUrl: string = getBaseUrl()): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalizedPath, baseUrl).toString();
}

export function getDefaultLogoUrl(baseUrl: string = getBaseUrl()): string {
  const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim();
  if (r2Base) {
    return `${stripTrailingSlash(r2Base)}${DEFAULT_R2_LOGO_PATH}`;
  }
  return toAbsoluteUrl("/opengraph-image", baseUrl);
}

export function getDefaultOgImageUrl(baseUrl: string = getBaseUrl()): string {
  return toAbsoluteUrl("/opengraph-image", baseUrl);
}
