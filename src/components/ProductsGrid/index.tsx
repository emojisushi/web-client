import { useBreakpoint, useDebounce } from "~common/hooks";
import { EqualHeight } from "react-equal-height";

import { IGetWishlistRes, IProduct, SortKey } from "@layerok/emojisushi-js-sdk";
import { useSearchParams, useSubmit } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PRODUCTS_LIMIT_STEP } from "~domains/category/constants";
import {
  DropdownPopover,
  ProductCard,
  SkeletonWrap,
  SortOrderSvg,
} from "~components";
import * as S from "~components/ProductsGrid/styled";
import {
  SEARCH_QUERY_SEARCH_PARAM,
  SORT_MODE_KEYS,
  SORT_MODE_SEARCH_PARAM,
  SortModeEnum,
} from "~common/constants";
import Skeleton from "react-loading-skeleton";
import { UIButton } from "~common/ui-components/UIButton/UIButton";
import { Cart } from "~domains/cart/cart.query";

export const ProductsGrid = ({
  title = "Меню",
  items = [],
  loading = false,
  cart,
  wishlists,
}: {
  title?: string;
  items?: IProduct[];
  loading?: boolean;
  cart?: Cart;
  wishlists?: IGetWishlistRes;
}) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const breakpoint = useBreakpoint();

  const [debouncedBreakpoint] = useDebounce(() => {
    return breakpoint;
  }, 300);

  const query = searchParams.get(SEARCH_QUERY_SEARCH_PARAM);

  const titleOrSearch = query ? `${t("search.everywhere")}: "${query}"` : title;

  const sorters = SORT_MODE_KEYS.map((key) => ({
    name: t(`sort.${key}`),
    id: key,
  }));

  const sortFromUrl = searchParams.get(SORT_MODE_SEARCH_PARAM) as SortKey;

  // todo: validate provided search params from url
  const initialSelectedIndex = SORT_MODE_KEYS.indexOf(
    sortFromUrl ? sortFromUrl : SortModeEnum.Default
  );

  const handleSorterChange = ({ option, index }) => {
    const formData = new FormData();

    Array.from(searchParams.entries())
      .filter(([key]) => key !== SORT_MODE_SEARCH_PARAM)
      .forEach(([key, val]) => {
        formData.append(key, val);
      });

    formData.append(SORT_MODE_SEARCH_PARAM, option.id);

    submit(formData, {
      preventScrollReset: true,
    });
  };

  const renderItems = () => {
    if (loading) {
      return (
        <S.Grid>
          {new Array(PRODUCTS_LIMIT_STEP).fill(null).map((_, i) => (
            <ProductCard key={i} loading />
          ))}
        </S.Grid>
      );
    }

    if (items.length === 0) {
      return <div>{t("common.not_found")}</div>;
    }

    return (
      <S.Grid>
        {items.map((product) => (
          <ProductCard
            wishlists={wishlists}
            cart={cart}
            key={product.id}
            product={product}
          />
        ))}
      </S.Grid>
    );
  };

  const renderDropdown = () => {
    return (
      <DropdownPopover
        options={sorters}
        selectedIndex={initialSelectedIndex}
        onSelect={handleSorterChange}
      >
        {({ selectedOption }) => (
          <SkeletonWrap loading={loading}>
            <UIButton text={selectedOption.name}>
              <SortOrderSvg />
            </UIButton>
          </SkeletonWrap>
        )}
      </DropdownPopover>
    );
  };

  return (
    <S.Root>
      <S.Header>
        <S.Title>
          {loading ? <Skeleton width={260} height={22} /> : titleOrSearch}
        </S.Title>
        <S.Controls style={{ marginLeft: "67px" }}>
          {renderDropdown()}
        </S.Controls>
      </S.Header>
      <EqualHeight updateOnChange={debouncedBreakpoint}>
        {renderItems()}
      </EqualHeight>
    </S.Root>
  );
};
