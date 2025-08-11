import { makeAutoObservable } from "mobx";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  lng = "uk";
  userConfirmedLocation = false;
  setLng(lng: string) {
    this.lng = lng;
  }

  setUserConfirmedLocation(state: boolean) {
    this.userConfirmedLocation = state;
  }
}

export const useAppStore = () => {
  return appStore;
};

export const appStore = new AppStore();
