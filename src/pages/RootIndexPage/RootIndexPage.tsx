import { redirect } from "react-router-dom";
import { ROUTES } from "~routes";
import { queryClient } from "~lib/query-client";
import { IGetCatalogRes } from "@layerok/emojisushi-js-sdk";
import { catalogQuery } from "~domains/catalog/catalog.query";

export const Component = () => {
  return null;
};

export const loader = async () => {
  const data =
    queryClient.getQueryData<IGetCatalogRes>(catalogQuery.queryKey) ??
    (await queryClient.fetchQuery<IGetCatalogRes>(catalogQuery));

  return redirect(
    ROUTES.CATEGORY.SHOW.buildPath({
      categorySlug: data.categories[0].slug,
    })
  );
};
