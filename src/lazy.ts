import { isChunkLoadError } from "~utils/error.utils";
import NiceModal from "@ebay/nice-modal-react";
import { ModalIDEnum } from "~common/modal.constants";

type ImportFn<V> = () => Promise<V>;

const createLazy = <V>(wrapper: (promise: Promise<V>) => Promise<V>) => {
  return (importFn: ImportFn<V>) => {
    return () => wrapper(importFn());
  };
};

const isProbablyOutdatedChunk = (e: unknown) => {
  // if a chunk failed to load while online, then it is most probably a user has an outdated application
  return isChunkLoadError(e) && navigator.onLine;
};

let loadId = 0;

//  possible infinite refresh loop
export const forceRefreshImpl = <V>(promise: Promise<V>) => {
  loadId++;
  const alreadyRefreshedKey = `retry-lazy-refreshed-${loadId}`;
  const hasRefreshed = JSON.parse(
    window.localStorage.getItem(alreadyRefreshedKey) || "false"
  );
  window.localStorage.setItem(alreadyRefreshedKey, "false");

  return promise.catch((e) => {
    if (isProbablyOutdatedChunk(e) && !hasRefreshed) {
      window.localStorage.setItem(alreadyRefreshedKey, "true");
      window.location.reload();
    }
    throw e;
  });
};

const manualRefreshImpl = <V>(promise: Promise<V>) => {
  return promise.catch((e) => {
    if (isProbablyOutdatedChunk(e)) {
      NiceModal.show(ModalIDEnum.OutdatedAppWarning);
    }
    throw e;
  });
};

const noRefreshImpl = <V>(promise: Promise<V>) => {
  return promise;
};

const manualRefresh = createLazy(manualRefreshImpl);
const forceRefresh = createLazy(forceRefreshImpl);
const noRefresh = createLazy(noRefreshImpl);

export const lazy = manualRefresh;
