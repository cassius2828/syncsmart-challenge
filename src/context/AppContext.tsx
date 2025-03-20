import type { GridCellParams, GridRowSelectionModel } from "@mui/x-data-grid";
import type { AppContextType, Contact } from "coding-challenge/utils/types";
import { createContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const refIndexesToFilterOut = useRef(new Set());
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [numOfContacts, setNumOfContacts] = useState<number>(100);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [indexSetCount, setIndexSetCount] = useState<number>(
    refIndexesToFilterOut.current.size
  );

  const addIndexToSet = (item: GridCellParams, idx: number) => {
    if (!item.value) {
      refIndexesToFilterOut.current.add(idx);
      setIndexSetCount(refIndexesToFilterOut.current.size);
      console.log(refIndexesToFilterOut.current);
    }
  };
  const removeIndexFromSet = (item: GridCellParams, idx: number) => {
    if (item.value) {
      refIndexesToFilterOut.current?.delete(idx);
      setIndexSetCount(refIndexesToFilterOut.current.size);
      console.log(refIndexesToFilterOut.current, " <-- remove from set");
    }
  };

  const handleFilterContacts = (set: Set<unknown>) => {
    const arr: unknown[] = [];
    for (const val of set) {
      arr.push(val);
    }

    const filteredContacts = contacts.filter((_, idx) => !arr.includes(idx));

    setContacts(filteredContacts);
    refIndexesToFilterOut.current = new Set();
    setIndexSetCount(refIndexesToFilterOut.current.size);
    setSelectionModel([]);
  };
  useEffect(() => {
    if (contacts) {
      setNumOfContacts(contacts.length);
      // keeps out filter logic in sync to avoid accessing indexes that are outside the contacts array
      refIndexesToFilterOut.current = new Set();
      setIndexSetCount(refIndexesToFilterOut.current.size);
    }
  }, [contacts]);
  return (
    <AppContext.Provider
      value={{
        addIndexToSet,
        removeIndexFromSet,
        refIndexesToFilterOut,
        indexSetCount,
        contacts,
        setContacts,
        numOfContacts,
        setNumOfContacts,
        handleFilterContacts,
        selectionModel,
        setSelectionModel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
