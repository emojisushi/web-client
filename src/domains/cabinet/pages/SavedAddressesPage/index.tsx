import * as S from "./styled";
import { HeartSvg, CloseSvg, Input, SvgIcon } from "~components";
import { IAddress, IUser } from "@layerok/emojisushi-js-sdk";
import { useTranslation } from "react-i18next";
import { Form } from "react-router-dom";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { useUser } from "~hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTHENTICATED_USER_QUERY_KEY } from "~common/constants";
import { arrImmutableDeleteAt } from "~utils/arr.utils";
import { useTheme } from "styled-components";
import { Button } from "~common/ui-components/Button/Button";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

const Address = ({ address, user }: { address: IAddress; user: IUser }) => {
  const isDefault = user.customer.default_shipping_address_id === address.id;
  const queryClient = useQueryClient();

  const makeAddressDefaultMutation = useMutation({
    mutationFn: (id: number) => {
      return EmojisushiAgent.makeAddressDefault({
        id,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(AUTHENTICATED_USER_QUERY_KEY);
    },
    onMutate: () => {
      queryClient.cancelQueries(AUTHENTICATED_USER_QUERY_KEY);
      queryClient.setQueryData(
        AUTHENTICATED_USER_QUERY_KEY,
        (oldUser: IUser) => {
          return {
            ...oldUser,
            customer: {
              ...oldUser.customer,
              default_shipping_address_id: address.id,
            },
          };
        }
      );
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => {
      return EmojisushiAgent.deleteAddress({
        id,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(AUTHENTICATED_USER_QUERY_KEY);
    },
    onMutate: () => {
      queryClient.cancelQueries(AUTHENTICATED_USER_QUERY_KEY);
      queryClient.setQueryData(
        AUTHENTICATED_USER_QUERY_KEY,
        (oldUser: IUser) => {
          const deleteAddress = oldUser.customer.addresses.find(
            (a) => a.id === address.id
          );
          if (deleteAddress) {
            const index = oldUser.customer.addresses.indexOf(deleteAddress);
            const optimisticAddresses = arrImmutableDeleteAt(
              oldUser.customer.addresses,
              index
            );
            return {
              ...oldUser,
              customer: {
                ...oldUser.customer,
                addresses: optimisticAddresses,
              },
            };
          }
          return oldUser;
        }
      );
    },
  });

  const theme = useTheme();

  return (
    <S.AddressWrapper>
      <Input
        disabled={true}
        name={"address"}
        value={address.lines}
        width={"350px"}
      />
      <S.IconWrapper>
        <SvgIcon
          clickable={true}
          width={"25px"}
          color={isDefault ? theme.colors.brand : "white"}
          hoverColor={theme.colors.brand}
          style={{ marginLeft: "10px" }}
          onClick={() => {
            if (!isDefault) {
              makeAddressDefaultMutation.mutate(address.id);
            }
          }}
        >
          <HeartSvg />
        </SvgIcon>
        <SvgIcon
          width={"25px"}
          clickable={true}
          hoverColor={theme.colors.danger.canvas}
          style={{ marginLeft: "10px" }}
          onClick={() => {
            deleteAddressMutation.mutate(address.id);
          }}
        >
          <CloseSvg />
        </SvgIcon>
      </S.IconWrapper>
    </S.AddressWrapper>
  );
};

export const SavedAddressesPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const inputRef = useRef(null);

  const [errors, setErrors] = useState<{
    name?: string[];
    lines?: string[];
    zip?: string[];
    city?: string[];
    two_letters_country_code?: string[];
  }>();

  const { data: user } = useUser();

  const addMutation = useMutation({
    mutationFn: (data: {
      name: string;
      lines: string;
      zip: string;
      city: string;
      two_letters_country_code: string;
    }) => {
      return EmojisushiAgent.addAddress(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries(AUTHENTICATED_USER_QUERY_KEY);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(
        AUTHENTICATED_USER_QUERY_KEY,
        (oldUser: IUser) => {
          return {
            ...oldUser,
            customer: {
              ...oldUser.customer,
              addresses: [...oldUser.customer.addresses, res.data],
            },
          };
        }
      );
    },
    onError: (e) => {
      if (e instanceof AxiosError && e.response.status === 422) {
        setErrors(e.response.data?.errors || {});
      }
    },
  });

  return (
    <>
      {user.customer.addresses.map((address) => {
        return <Address user={user} key={address.id} address={address} />;
      })}

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name") + "";
          const lines = formData.get("lines") + "";
          const zip = formData.get("zip") + "";
          const city = formData.get("city") + "";
          const two_letters_country_code =
            formData.get("two_letters_country_code") + "";

          const data = {
            name,
            lines,
            zip,
            city,
            two_letters_country_code,
          };

          addMutation.mutate(data, {
            onSuccess: () => {
              inputRef.current.value = "";
            },
          });
        }}
        method="post"
      >
        <input
          name="name"
          value={user.name + " " + user.surname}
          type="hidden"
        />
        <input name="zip" value="65125" type="hidden" />
        <input name="city" value="Одеса" type="hidden" />
        <input name="two_letters_country_code" value="UA" type="hidden" />
        <S.AddressWrapper>
          <Input
            ref={inputRef}
            placeholder={t("account.addresses.typeAddress")}
            error={errors?.lines[0]}
            width={"350px"}
            name="lines"
          />
        </S.AddressWrapper>
        <S.ButtonWrapper>
          <Button loading={addMutation.isLoading} type="submit">
            {t("account.addresses.addAddress")}
          </Button>
        </S.ButtonWrapper>
      </Form>
    </>
  );
};

export const Component = SavedAddressesPage;

Object.assign(Component, {
  displayName: "LazySavedAddressesPage",
});
