import { createContext, useRef, useState } from "react";

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const refIndexesToFilterOut = useRef(new Set());
  const [indexSetCount, setIndexSetCount] = useState<number>(
    refIndexesToFilterOut.current.size
  );

  const addIndexToSet = (item: any, idx: number) => {
    if (!item.value) {
      refIndexesToFilterOut.current.add(idx);
      setIndexSetCount(refIndexesToFilterOut.current.size);
      console.log(refIndexesToFilterOut.current);
    }
  };
  const removeIndexFromSet = (item: any, idx: number) => {
    if (item.value) {
      refIndexesToFilterOut.current?.delete(idx);
      setIndexSetCount(refIndexesToFilterOut.current.size);
      console.log(refIndexesToFilterOut.current, " <-- remove from set");
    }
  };
  return (
    <AppContext.Provider
      value={{
        addIndexToSet,
        removeIndexFromSet,
        refIndexesToFilterOut,
        indexSetCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
