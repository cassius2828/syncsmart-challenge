import Head from "next/head";
import { Button, Container, Input } from "@mui/material";
import { faker } from "@faker-js/faker";
import { api } from "coding-challenge/utils/api";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import type { Contact } from "coding-challenge/utils/types";
import type { GridCellParams } from "@mui/x-data-grid";
export default function Home() {
  const { contacts, setContacts, numOfContacts, setNumOfContacts } =
    useAppContext();
  const addContactsMutation = api.hubspot.addContacts.useMutation();
  const pullContactsQuery = api.hubspot.pullFromAlpha.useQuery(
    { accountType: "alpha" },
    {
      enabled: false,
    }
  );

  const handlePullContactsFromAlpha = async () => {
    const result = await pullContactsQuery.refetch();
    const hubspotResponse = result.data?.hubspotResponse as { results: Contact[] };
    console.log(
      hubspotResponse.results,
      " <-- RESULT \n ===========\n==========="
    );
    if (result.data?.success) {
      console.log("Contacts:", result.data.hubspotResponse);
      addContactsMutation.mutate({
        contacts: ((result.data?.hubspotResponse as { results: Contact[] })?.results || []),
        accountType: "beta",
      });
    } else {
      console.error("Failed to fetch contacts:", result.data?.error);
    }
  };

  const fetchContactsFromFaker = () => {
    const emptyContacts = Array.from({ length: numOfContacts || 100 });
    console.log("ran faker =======\n===========\n==========\n");
    return emptyContacts.map((_, idx) => {
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();
      const phone = faker.phone.number({ style: "international" });
      const obj = {
        properties: {
          firstname,
          lastname,
          email: `${firstname}.${lastname}@gmail.com`,
          phone,
          id: idx + 1,
        },
      };
      return obj;
    });
  };
  // i want to only create contacts when clicking the button, but I also want to
  // be able to change the size of the array in sync
  const setNewAmountOfContacts = () => {
    setContacts(fetchContactsFromFaker());
  };

  useEffect(() => {
    console.log(contacts);
  }, [contacts]);

  useEffect(() => {
    if (!contacts[3]) setContacts(fetchContactsFromFaker());
  }, []);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            SyncSmart Integration Coding Challenge
          </h1>

          <div className={styles.showcaseContainer}>
            <ActionBtnContainer
              setNewAmountOfContacts={setNewAmountOfContacts}
              handlePullContactsFromAlpha={handlePullContactsFromAlpha}
              isPending={addContactsMutation.isPending}
              handleAddContactsToAlpha={() => {
                addContactsMutation.mutate({
                  contacts,
                  accountType: "alpha",
                });
                // since state is batched, this will reset the contacts to a new 100
                setContacts(fetchContactsFromFaker());
                setNumOfContacts(100);
              }}
            />
            <div style={{ marginTop: "4rem" }}>{/* <AuthShowcase /> */}</div>
          </div>
        </div>
        <ContactsModal />
      </main>
    </>
  );
}

export const ActionBtnContainer = ({
  setNewAmountOfContacts,

  handleAddContactsToAlpha,
  handlePullContactsFromAlpha,
  isPending,
}: {
  setNewAmountOfContacts: () => void;
  handleAddContactsToAlpha: () => void;
  handlePullContactsFromAlpha: () => void;
  isPending: boolean;
}) => {
  const { numOfContacts, setNumOfContacts } = useAppContext();
  const [areContactsSet, setAreContactsSet] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("test");
  const [error, setError] = useState<string>("gfssa");
  const handleSetContacts = () => {
    setNewAmountOfContacts();
    setAreContactsSet(true);
  };
  return (
    <>
      <Container className={styles.actionBtnContainer}>
        <Container
          sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <Button
            onClick={() => {
              handleAddContactsToAlpha();
              // reset emoji state
              if (areContactsSet) setAreContactsSet(false);
            }}
            variant="contained"
            className="md-rounded-1"
            sx={{ color: "#fff", backgroundColor: "#e36537" }}
            size="small"
          >
            {isPending ? "Handling Your Data..." : "Generate Accounts in Alpha"}
          </Button>
          <label className={styles.numberInputLabel}>
            select how many contacts you want to upload
          </label>
          <div style={{ position: "relative" }}>
            <Input
              type="number"
              inputProps={{ max: 100, min: 1 }}
              onChange={(e) => {
                setNumOfContacts(Number(e.target.value));
                if (areContactsSet) setAreContactsSet(false);
              }}
              value={numOfContacts}
              sx={{ height: "3rem", border: "black", width: "4rem" }}
            />
            {areContactsSet && (
              <span className={styles.checkContactsEmoji}>✅</span>
            )}
          </div>
          <Button
            onClick={handleSetContacts}
            variant="text"
            size="small"
            sx={{ color: "white", width: "100%" }}
          >
            {" "}
            set number of contacts
          </Button>
        </Container>
        <Container>
          <Button
            onClick={handlePullContactsFromAlpha}
            variant="outlined"
            sx={{ color: "white", width: "100%", borderColor: "white" }}
            size="small"
          >
            {isPending
              ? "Handling Your Data..."
              : " Pull From Alpha and Create in Beta"}
          </Button>
        </Container>
      </Container>
      {/* {(success || error) && (
        <StatusModal
          setSuccess={setSuccess}
          error={error}
          setError={setError}
          success={success}
        />
      )} */}
    </>
  );
};

// from material ui library ⬇️
import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const drawerBleeding = 56;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: grey[100],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
  }),
}));

export const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}));

export function ContactsModal(props: Props) {
  const { window } = props;
  const { contacts, handleFilterContacts, refIndexesToFilterOut } =
    useAppContext();
  const [open, setOpen] = React.useState(false);
  const { indexSetCount } = useAppContext();
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <Button
        variant="contained"
        sx={{
          color: "white",
          outline: "solid 1px white",
          backgroundColor: "#e36537",
        }}
        size="small"
        onClick={toggleDrawer(true)}
      >
        Open
      </Button>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            {contacts?.length} contacts ready
            {indexSetCount > 0 && (
              <Button
                variant="contained"
                size="small"
                color="error"
                sx={{ marginLeft: "1rem" }}
                onClick={() =>
                  handleFilterContacts(refIndexesToFilterOut.current)
                }
              >
                remove selected contacts
              </Button>
            )}
          </Typography>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: "100%", overflow: "auto" }}>
          <DataTable contacts={contacts} />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

// export const StatusModal = ({ success, setSuccess, error, setError }) => {
//   // useEffect(() => {
//   //   setTimeout(() => {
//   //     setSuccess("");
//   //     setError("");
//   //   }, 3000);
//   // }, []);
//   const title = success ? "Success!" : error ? "Error" : "";
//   const message = success || error;
//   return (
//     <Modal
//       onClose={() => {
//         setSuccess("");
//         setError("");
//       }}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box>
//         <Typography id="modal-modal-title" variant="h6" component="h2">
//           {title}
//         </Typography>
//         <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//           {message}
//         </Typography>
//       </Box>
//     </Modal>
//   );
// };

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useAppContext } from "coding-challenge/context/useAppContext";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstname", headerName: "First name", width: 150 },
  { field: "lastname", headerName: "Last name", width: 150 },
  {
    field: "phone",
    headerName: "phone",
    type: "string",
    width: 150,
  },
];

// const rows = [
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },
//   { id: 1, lastname: "Snow", firstname: "Jon", phone: "+14486989603" },

// ];

const paginationModel = { page: 0, pageSize: 25 };

export function DataTable({ contacts }: { contacts: Contact[] }) {
  const {
    removeIndexFromSet,
    addIndexToSet,
    selectionModel,
    setSelectionModel,
  } = useAppContext();
  const rows = contacts.map((contact, idx) => {
    const { firstname, lastname, email, phone } = contact.properties;
    return {
      id: idx + 1,
      firstname,
      lastname,
      email,
      phone,
    };
  });

  const handleSetInsertionAndDeletion = (cell: GridCellParams) => {
    addIndexToSet(cell, Number(cell.id) - 1);
    removeIndexFromSet(cell, Number(cell.id) - 1);
  };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        className="disable-select-all"
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[25, 100]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={selectionModel}
        onCellClick={(cell) => {
          handleSetInsertionAndDeletion(cell);
          console.log(cell);
        }}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
