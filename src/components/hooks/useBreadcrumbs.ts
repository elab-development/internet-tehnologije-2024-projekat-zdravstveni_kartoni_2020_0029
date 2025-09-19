// import { create } from "zustand";

// export type Crumb = { label: string; view?: string };

// type BreadcrumbState = {
//   crumbs: Crumb[];
//   pushCrumb: (crumb: Crumb) => void;
//   popCrumb: () => void;
//   resetCrumbs: (initial?: Crumb[]) => void;
// };

// export const useBreadcrumbs = create<BreadcrumbState>((set) => ({
//   crumbs: [],
//   pushCrumb: (crumb) =>
//     set((state) => ({ crumbs: [...state.crumbs, crumb] })),
//   popCrumb: () =>
//     set((state) => ({ crumbs: state.crumbs.slice(0, -1) })),
//   resetCrumbs: (initial = []) => set({ crumbs: initial }),
// }));
