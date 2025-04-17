import { useMemo } from "react";


export type PageTopology = {
  pageIndex: number;
  offsetX: number;
  offsetY: number;
};

export type StackTopology = {
  firstPageTopology: {offsetX: number, offsetY: number};
  backPagesTopologies: PageTopology[];
};


export function useStackConfiguration(pagesCount: number):StackTopology {
  return useMemo(() => {
    const stackPageCount = Math.min(pagesCount, maxBackPages);

    const pagesTopologies = Array
      .from({ length: stackPageCount })
      .map((_, index) => ({
        pageIndex: index,
        offsetX: -offsetX * index,
        offsetY: -offsetY * index,
      }))
      .reverse();

    const [firstPageTopology, ...backPagesTopologies] = pagesTopologies;
    backPagesTopologies.reverse()

    return { firstPageTopology, backPagesTopologies };
  }, [pagesCount]);
}

// Limit the number of back pages to show
const maxBackPages = 10;
const offsetX = 2;
const offsetY = 2;