import { AEM_GRAPHQL_ENDPOINT } from "../config/aem";

export async function getBundleOffers() {
  const response = await fetch(AEM_GRAPHQL_ENDPOINT);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bundle offers: ${response.status}`
    );
  }

  const result = await response.json();

  return result?.data?.bundleOfferList?.items || [];
}