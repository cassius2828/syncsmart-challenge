import { type Contact } from "coding-challenge/utils/types";
import { createContext, useRef, useState } from "react";

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const refIndexesToFilterOut = useRef(new Set());
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [numOfContacts, setNumOfContacts] = useState<number>(100);

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

  const handleFilterContacts = (set: Set<number>) => {
    let arr = [];
    for(const val of set){
        arr.push(val)
    }

    const filteredContacts = contacts.filter((contact, idx) =>
      !arr.includes(idx)
    );
    console.log(filteredContacts);
    console.log(arr);
    setContacts(filteredContacts);
    refIndexesToFilterOut.current = {}
    setIndexSetCount(refIndexesToFilterOut.current.size)
    console.log(refIndexesToFilterOut)
  };
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
