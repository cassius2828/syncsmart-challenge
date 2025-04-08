import { useEffect, useState } from "react";
import { DataTable } from "..";
import { type Contact } from "coding-challenge/utils/types";
import { api } from "coding-challenge/utils/api";
import {
  Box,
  Container,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
const Beta = () => {
  const [betaContacts, setBetaContacts] = useState<Contact[]>([]);
  const pullContactsQuery = api.hubspot.pullFromAlpha.useQuery(
    { accountType: "beta" },
    {
      enabled: false,
    }
  );
  const fetchBetaContacts = async () => {
    try {
      await pullContactsQuery.refetch();
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    setBetaContacts(
      (
        pullContactsQuery.data?.hubspotResponse as
          | { results: Contact[] }
          | undefined
      )?.results ?? []
    );
  }, [pullContactsQuery.data]);

  useEffect(() => {
    void fetchBetaContacts();
  }, []);
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Contacts from Beta Portal
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Total Contacts: {betaContacts?.length}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Main Content */}
        {pullContactsQuery.isFetching ? (
          <Skeleton
            sx={{ bgcolor: "grey.200", height: "50vh" }}
            variant="rectangular"
          />
        ) : (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ overflow: "auto" }}>
              <DataTable contacts={betaContacts} />
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
};
export default Beta;
