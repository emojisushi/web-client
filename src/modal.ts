import NiceModal, {
  NiceModalContext,
  useModal as useNiceModal,
} from "@ebay/nice-modal-react";
import { useContext } from "react";

let adding = [];

export const useShowModal = () => {
  const modals = useContext(NiceModalContext);

  return <T extends any>(key: string, args?: Record<string, unknown>) => {
    // only one modal can be open
    if (
      Object.keys(modals).find((key) => modals[key].visible) ||
      adding.length > 0
    ) {
      return Promise.resolve();
    }

    adding.push(key);

    return NiceModal.show(key, args).then(() => {
      adding.splice(adding.indexOf(key), 1);
    });
  };
};

export const useHideModal = (): typeof NiceModal.hide => {
  return NiceModal.hide;
};

export const useRemoveModal = (): typeof NiceModal.remove => {
  return NiceModal.remove;
};

export const useModal: typeof useNiceModal = (modal?: any, args?: any) => {
  const niceModal = useNiceModal(modal, args);
  if (!modal) {
    // we are most probably rendering our modal
    niceModal.resolve();
  }
  const remove = useRemoveModal();
  const show = useShowModal();
  const hide = useHideModal();
  return {
    ...niceModal,
    remove: () => remove(niceModal.id),
    hide: () => hide(niceModal.id),
    show: (args) => show(niceModal.id, args),
  };
};
