import { create } from "zustand";

interface InterfaceState {
  vertical: boolean;
  // setVertical: (value: boolean) => void;
}

export const useInterfaceStore = create<InterfaceState>((set) => ({
  //   bears: 0,
  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
  vertical: false,
}));
