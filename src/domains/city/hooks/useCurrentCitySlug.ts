import { CitySlug } from "~common/constants";

export const useCurrentCitySlug = () => {
  const allowed = [CitySlug.Odesa, CitySlug.Chornomorsk] as string[];
  const citySlugFromDomain = window.location.hostname.split(".")[0];
  if (!allowed.includes(citySlugFromDomain)) {
    return CitySlug.Odesa;
  }
  return citySlugFromDomain;
};
