import { SegmentedControl } from "~components";
import { getProductModGroups } from "~domains/product/product.utils";
import { IProduct } from "@layerok/emojisushi-js-sdk";

type TModificatorsProps = {
  product?: IProduct;
  modificators: any;
  setModificators: any;
  loading?: boolean;
};

export const Modificators = ({
  product,
  modificators,
  setModificators,
  loading = false,
}: TModificatorsProps) => {
  if (loading) {
    return null;
  }

  return (
    <>
      {((product && getProductModGroups(product)) || []).map((group) => (
        <SegmentedControl
          key={group.id}
          style={{ marginTop: "12px" }}
          onChange={(e) => {
            setModificators((state) => {
              return {
                ...state,
                [group.property.id]: e.target.value,
              };
            });
          }}
          name={"modificator_" + group.property.id}
          items={group.property.options.map((option) => ({
            value: +option.poster_id,
            label: option.value,
          }))}
          value={+modificators[group.property.id]}
        />
      ))}
    </>
  );
};
