import Skeleton from "react-loading-skeleton";
import { ICategory } from "@layerok/emojisushi-js-sdk";
import { SvgIcon, LogoSvg } from "~components";
import * as S from "./styled";
import { ROUTES } from "~routes";

const Image = ({ category }: { category?: ICategory }) => {
  const imageElement = category?.image?.path ? (
    <img src={category.image.path} alt="" />
  ) : (
    <SvgIcon color={"white"} width={"80%"}>
      <LogoSvg />
    </SvgIcon>
  );
  return imageElement;
};

export const Category = ({ category }: { category?: ICategory }) => {
  return (
    <S.Item>
      <S.Link
        to={
          category
            ? ROUTES.CATEGORY.SHOW.buildPath({
                categorySlug: category.slug,
              })
            : undefined
        }
      >
        <S.Image>
          {category ? (
            <Image category={category} />
          ) : (
            <Skeleton width={80} height={80} />
          )}
        </S.Image>
        <span>{category?.name ?? <Skeleton />}</span>
      </S.Link>
    </S.Item>
  );
};
