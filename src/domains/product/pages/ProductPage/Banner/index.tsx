import * as S from "./styled";
import React, { useState } from "react";
import { useTransitionCarousel } from "react-spring-carousel";
import { useBreakpoint2 } from "~common/hooks";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "styled-components";
import { CaretDownSvg, FlexBox, SvgIcon } from "~components";

const SLIDE_CHANGE_INTERVAL = 2500;

type BannerItem = {
  id: string;
  desktop_image: string;
  mobile_image: string;
  onClick?: () => void;
  clickable: boolean;
};

enum BannerIdEnum {
  LoadingSlide = "loading_slide",
}

export const Banner = (props: { items: BannerItem[]; loading?: boolean }) => {
  const { items, loading = false } = props;

  const { isTablet, isDesktop } = useBreakpoint2();

  const [activeItem, setActiveItem] = useState<string>(
    loading ? BannerIdEnum.LoadingSlide : items[0]?.id
  );

  const theme = useTheme();
  const MAX_THUMBS = 5;

  useEffect(() => {
    setActiveItem(items[0]?.id);
  }, [loading]);

  const loadingSlides = [
    {
      id: BannerIdEnum.LoadingSlide,
      renderItem: (
        <Skeleton
          borderRadius={theme.borderRadius.default}
          width={"100%"}
          height={"100%"}
        />
      ),
      renderThumb: (
        <FlexBox
          style={{
            gap: 5,
          }}
        >
          {[...Array(MAX_THUMBS)].map((index) => (
            <Skeleton
              key={index}
              width={10}
              height={10}
              borderRadius={"100%"}
            />
          ))}
        </FlexBox>
      ),
    },
  ];

  const actualSlides = items.map((item, index) => {
    const imageSrc =
      item[isTablet || isDesktop ? "desktop_image" : "mobile_image"];

    return {
      id: item.id,
      renderItem: (
        <S.Slide
          key={item.id}
          style={{ cursor: item.clickable ? "pointer" : "default" }}
          onClick={item.onClick}
          $imageSrc={imageSrc}
        />
      ),
      renderThumb: (
        <S.Dot
          key={item.id}
          $isActive={item.id === activeItem}
          onClick={() => slideToItem(item.id)}
        />
      ),
    };
  });

  const slides = loading ? loadingSlides : actualSlides;

  const {
    carouselFragment,
    thumbsFragment,
    useListenToCustomEvent,
    slideToItem,
  } = useTransitionCarousel({
    withLoop: true,
    withThumbs: true,
    items: slides,
  });

  const slideToNextItem = () => {
    const currentIndex = items.findIndex((item) => item.id === activeItem);
    const nextIndex = (currentIndex + 1) % items.length;

    slideToItem(items[nextIndex].id);
  };

  const slideToPrevItem = () => {
    const currentIndex = items.findIndex((item) => item.id === activeItem);
    const nextIndex = (currentIndex - 1 + items.length) % items.length;

    slideToItem(items[nextIndex].id);
  };

  useListenToCustomEvent((event) => {
    if (event.eventName === "onSlideStartChange") {
      setActiveItem(event.nextItem.id);
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      slideToNextItem();
    }, SLIDE_CHANGE_INTERVAL);
    return () => {
      window.clearInterval(timer);
    };
  }, [slideToNextItem]);

  return (
    <S.Container>
      {carouselFragment}

      <S.NextSlideBtnOverlay />
      <S.PrevSlideBtnOverlay />

      <S.PrevSlideBtn
        onClick={(e) => {
          e.stopPropagation();
          slideToPrevItem();
        }}
      >
        <SvgIcon
          clickable
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
          }}
          width={"30px"}
        >
          <CaretDownSvg strokeWidth={"1"} />
        </SvgIcon>
      </S.PrevSlideBtn>

      <S.NextSlideBtn
        onClick={(e) => {
          e.stopPropagation();
          slideToNextItem();
        }}
      >
        <SvgIcon
          clickable
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          width={"30px"}
        >
          <CaretDownSvg strokeWidth={"1"} />
        </SvgIcon>
      </S.NextSlideBtn>

      <S.ThumbsContainer>{thumbsFragment}</S.ThumbsContainer>
    </S.Container>
  );
};
