import { FlexBox, Input } from "src/components";
import { Button } from "~common/ui-components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useUser } from "~hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AUTHENTICATED_USER_QUERY_KEY } from "~common/constants";
import { IUser } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const EditProfilePage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [errors, setErrors] = useState<{
    name?: string[];
    surname?: string[];
    phone?: string[];
  }>({});

  const mutation = useMutation({
    mutationFn: ({
      name,
      surname,
      phone,
    }: {
      name: string;
      surname: string;
      phone: string;
    }) => {
      return EmojisushiAgent.updateUser({
        name,
        surname,
        phone,
      });
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response.status === 422) {
          setErrors(e.response.data.errors);
        }
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(
        AUTHENTICATED_USER_QUERY_KEY,
        (oldUser: IUser) => {
          return {
            ...oldUser,
            ...res.data,
          };
        }
      );
      navigate("./../");
    },
    onSettled: () => {
      queryClient.invalidateQueries(AUTHENTICATED_USER_QUERY_KEY);
    },
  });

  return (
    <form
      style={{
        marginTop: 20,
      }}
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const surname = formData.get("surname");
        const phone = formData.get("phone");

        mutation.mutate({
          name: name + "",
          surname: surname + "",
          phone: phone + "",
        });
      }}
    >
      <FlexBox justifyContent={"space-between"}>
        <Input
          style={{ width: "calc(50% - 10px)" }}
          label={t("common.first_name")}
          defaultValue={user.name}
          name="name"
          error={errors?.name?.[0]}
        />
        <Input
          style={{ width: "calc(50% - 10px)" }}
          label={t("common.last_name")}
          defaultValue={user.surname}
          name="surname"
          error={errors?.surname?.[0]}
        />
      </FlexBox>
      <FlexBox
        justifyContent={"space-between"}
        style={{
          marginTop: "10px",
        }}
      >
        <Input
          style={{ width: "calc(50% - 10px)" }}
          label={t("common.email")}
          name={"email"}
          value={user.email}
          disabled={true}
        />
        <Input
          style={{ width: "calc(50% - 10px)" }}
          label={t("common.phone")}
          defaultValue={user.phone}
          error={errors?.phone?.[0]}
          name="phone"
        />
      </FlexBox>

      <FlexBox
        style={{
          marginTop: "30px",
        }}
      >
        <Button
          loading={mutation.isLoading}
          style={{
            marginRight: 16,
          }}
        >
          {t("common.save")}
        </Button>
        <Button
          skin={"grey"}
          style={{
            marginLeft: 20,
          }}
          type="button"
          onClick={() => navigate("./../")}
        >
          {t("common.cancel")}
        </Button>
      </FlexBox>
    </form>
  );
};

export const Component = EditProfilePage;
Object.assign(Component, {
  displayName: "LazyEditProfilePage",
});
