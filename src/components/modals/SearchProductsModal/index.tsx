import React, { useLayoutEffect, useRef, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";

import {
  Input,
  Modal,
  ModalCloseButton,
  ModalContent as BaseModalContent,
} from "~components";
import * as S from "./styled";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_PRODUCTS_LIMIT,
  productsQuery,
} from "~domains/product/products.query";
import { cartQuery } from "~domains/cart/cart.query";
import { useTranslation } from "react-i18next";
import { CategorySlug } from "~domains/category/constants";
import { useModal as useNiceModal } from "~modal";
import { media } from "~common/custom-media";
import { fuzzySearch } from "~utils/fuzzySearch";
import { ProductCard } from "./components/ProductCard";

export const SearchProductsModal = NiceModal.create(() => {
  const modal = useNiceModal();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery(
    productsQuery({
      category_slug: CategorySlug.Menu,
      limit: DEFAULT_PRODUCTS_LIMIT,
    })
  );

  const products =
    search.length > 2
      ? fuzzySearch(data?.data || [], search, (el) => el.name, {
          maxAllowedModifications: 1,
        })
      : [];

  const handleSearch = (e) => {
    setSearch(e.currentTarget.value);
  };

  const { data: cart, isLoading: isCartLoading } = useQuery(cartQuery);

  const closeModal = () => {
    modal.remove();
  };

  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    if (mounted) {
      inputRef.current?.focus();
    }
  }, [mounted]);

  const renderResults = () => {
    if (search.length < 3) {
      return null;
    }

    return (
      <S.Results>
        {products.map((product) => {
          const cartItem = cart.items.find(
            (item) => item.product.id === product.id
          );

          return <ProductCard product={product} cartItem={cartItem} />;
        })}
      </S.Results>
    );
  };

  const renderFeedback = () => {
    const getLetters = (length: number) => {
      if (length === 1) {
        return `${length} символ`;
      }

      return `${length} символа`;
    };

    if (search.length === 0) {
      return "Почніть шукати";
    }
    if (search.length < 3) {
      return `Введіть на ${getLetters(3 - search.length)} більше`;
    }
    if (products.length === 0) {
      return `Нічого не знайдено`;
    }
    return `Результати пошуку (${products.length}):`;
  };

  const renderContent = () => {
    if (isLoading || isCartLoading) {
      return <div>...loading</div>;
    }

    return (
      <S.Wrapper>
        <Input
          ref={inputRef}
          value={search}
          onChange={handleSearch}
          light
          placeholder={"Пошук"}
        />
        <div
          style={{
            marginTop: 10,
          }}
        >
          {renderFeedback()}
        </div>

        {renderResults()}
      </S.Wrapper>
    );
  };

  return (
    <Modal open={modal.visible} onClose={closeModal}>
      <ModalContent>
        <ModalCloseButton />
        {renderContent()}
      </ModalContent>
    </Modal>
  );
});

const ModalContent = styled(BaseModalContent)`
  ${media.lessThan("tablet")`
    border-radius: 0;
  `}
`;
