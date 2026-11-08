import type {
  LayoutBanner,
  LayoutData,
  LayoutShortcut,
  ProductType,
} from "../api/home";

/**
 * Upload fields come back as `/uploads/a.png`. The page needs a full address:
 * the site origin in front of that path (`http://localhost:5173/uploads/a.png`).
 * A full http(s) address is kept.
 */
export function fileUrl(value?: string | null): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (raw.startsWith("//")) {
    const protocol =
      typeof location !== "undefined" ? location.protocol : "https:";
    return `${protocol}${raw}`;
  }
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const origin = typeof location !== "undefined" ? location.origin : "";
  return `${origin}${path}`;
}

/** Same as `fileUrl`. Image fields from the backend all use this. */
export function assetUrl(value?: string | null): string {
  return fileUrl(value);
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
