import type {
  LayoutBanner,
  LayoutData,
  LayoutShortcut,
  ProductType,
} from "../api/home";

/** Browser-facing prefix. Dev proxy strips `/api` before the local backend. */
const BASE = String(import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);

/**
 * Backend image fields are only the tail (`uploads/a.png` or `/uploads/a.png`).
 * A full http(s) address is kept. Anything already under the API prefix is kept.
 */
export function assetUrl(value?: string | null): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (raw.startsWith("//")) {
    const protocol =
      typeof location !== "undefined" ? location.protocol : "https:";
    return `${protocol}${raw}`;
  }
  if (raw === BASE || raw.startsWith(`${BASE}/`)) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${BASE}${path}`;
}

function banners(list?: LayoutBanner[]) {
  return (list || []).map((item) => ({
    ...item,
    picPath: assetUrl(item.picPath),
  }));
}

function shortcuts(list?: LayoutShortcut[]) {
  return (list || []).map((item) => ({
    ...item,
    showImg: assetUrl(item.showImg),
  }));
}

function productTypes(list?: ProductType[]) {
  return (list || []).map((item) => ({
    ...item,
    topIcon: assetUrl(item.topIcon),
    subIcon: assetUrl(item.subIcon),
    bgImg: assetUrl(item.bgImg),
  }));
}

/** Fill every image field on a layout payload. */
export function resolveLayoutImages(data: LayoutData): LayoutData {
  return {
    ...data,
    productTypeList: productTypes(data.productTypeList),
    bannerList: banners(data.bannerList),
    popUpBannerList: banners(data.popUpBannerList),
    adverBannerList: banners(data.adverBannerList),
    rightShortcutIconList: shortcuts(data.rightShortcutIconList),
    leftShortcutIconList: shortcuts(data.leftShortcutIconList),
    bottomShortcutIconList: shortcuts(data.bottomShortcutIconList),
  };
}
