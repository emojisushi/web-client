import { ICategory } from "@layerok/emojisushi-js-sdk";
import { SidebarMenu, Socials } from "./components";
import { useTheme } from "styled-components";
import { MouseEventHandler, useRef } from "react";
import {
  Form,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDebounce } from "~common/hooks";
import { HeartSvg, MagnifierSvg, SkeletonWrap, SvgIcon } from "~components";
import { EndAdornment } from "~common/ui-components/EndAdornment";
import { ROUTES } from "~routes";
import * as S from "~components/Sidebar/styled";
import Skeleton from "react-loading-skeleton";
import {
  SEARCH_QUERY_SEARCH_PARAM,
  STICKY_SIDEBAR_CONTAINER_OFFSET,
} from "~components/Sidebar/constants";

type SidebarProps = { loading?: boolean; categories?: ICategory[] };

export const Sidebar = ({ loading = false, categories = [] }: SidebarProps) => {
  const rootRef = useRef<null | HTMLDivElement>(null);
  const stickyContainerRef = useRef<null | HTMLDivElement>(null);
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();

  const [searchParams] = useSearchParams();
  const q = searchParams.get(SEARCH_QUERY_SEARCH_PARAM);

  const goUp = () => {
    const isUp =
      rootRef.current.offsetTop >= stickyContainerRef.current.offsetTop;

    if (isUp) {
      return;
    }

    let top = rootRef.current.offsetTop - STICKY_SIDEBAR_CONTAINER_OFFSET;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const [debouncedFetch] = useDebounce((form) => {
    const isFirstSearch = q == null;
    submit(form, {
      replace: !isFirstSearch,
      preventScrollReset: true,
    });
    // don't scroll up immediately, wait for the products to update and then scroll up
    setTimeout(() => {
      goUp();
    });
  }, 200);

  const handleChange = (event) => {
    debouncedFetch(event.currentTarget.form);
  };

  const handleCategoryChange = (category: ICategory) => {
    const to = ROUTES.CATEGORY.SHOW.buildPath({
      categorySlug: category.slug,
    });
    navigate(to, {
      preventScrollReset: true,
    });
    setTimeout(() => {
      goUp();
    }, 200);
  };

  const handleFavoritesClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    navigate(ROUTES.CATEGORY.WISHLIST.path, {
      preventScrollReset: true,
    });
    setTimeout(() => {
      goUp();
    });
  };

  const searchParamsInputs = Array.from(searchParams.entries())
    .filter(([k]) => k !== SEARCH_QUERY_SEARCH_PARAM)
    .map(([k, v], idx) => (
      <input type="hidden" name={k} defaultValue={v} key={idx} />
    ));

  return (
    <S.Root ref={rootRef}>
      <S.StickyContainer ref={stickyContainerRef}>
        <S.SearchBarContainer>
          <Form role="search" action={location.pathname}>
            {searchParamsInputs}
            <S.Input
              // I'm changing key to reset input value
              key={location.pathname}
              onChange={handleChange}
              name={SEARCH_QUERY_SEARCH_PARAM}
              defaultValue={q}
              loading={loading}
              endAdornment={
                <EndAdornment>
                  <SvgIcon color={"white"} width={"25px"} height={"25px"}>
                    <MagnifierSvg />
                  </SvgIcon>
                </EndAdornment>
              }
              placeholder={t("search.input_search")}
            />
          </Form>
        </S.SearchBarContainer>
        <SidebarMenu
          onNavigate={handleCategoryChange}
          categories={categories}
          loading={loading}
        />
        <NavLink
          style={{
            textDecoration: "none",
          }}
          onClick={handleFavoritesClick}
          end
          preventScrollReset
          to={ROUTES.CATEGORY.WISHLIST.path}
        >
          {({ isActive }) => (
            <S.Favorite
              style={{
                color: isActive ? theme.colors.brand : "white",
              }}
            >
              {loading ? (
                <Skeleton height={26} width={120} />
              ) : (
                t("common.favorite")
              )}
              <div
                style={{
                  width: 25,
                }}
              >
                <SkeletonWrap loading={loading}>
                  <SvgIcon
                    clickable={true}
                    width={"100%"}
                    color={theme.colors.brand}
                  >
                    <HeartSvg />
                  </SvgIcon>
                </SkeletonWrap>
              </div>
            </S.Favorite>
          )}
        </NavLink>
        <Socials loading={loading} />
      </S.StickyContainer>
    </S.Root>
  );
};
