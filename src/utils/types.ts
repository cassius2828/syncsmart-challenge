import type { GridCellParams, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

export type Contact = {
  properties: {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
  };
};

export type AppContextType = {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  numOfContacts: number;
  setNumOfContacts: Dispatch<SetStateAction<number>>;
  indexSetCount: number;
  addIndexToSet: (cell: GridCellParams, index: number) => void;
  removeIndexFromSet: (cell: GridCellParams, index: number) => void;
  handleFilterContacts: (set: Set<unknown>) => void;
  selectionModel: GridRowSelectionModel;
  setSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>;
  refIndexesToFilterOut: MutableRefObject<Set<unknown>>;
};
