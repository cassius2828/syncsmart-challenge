import { GridInputRowSelectionModel } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";

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
  addIndexToSet: (cell: any, index: number) => void;
  removeIndexFromSet: (cell: any, index: number) => void;
  handleFilterContacts: () => void;
  selectionModel: GridInputRowSelectionModel;
  setSelectionModel: Dispatch<SetStateAction<GridInputRowSelectionModel>>;
};
