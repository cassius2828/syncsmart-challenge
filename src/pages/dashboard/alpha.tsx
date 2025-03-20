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
const Alpha = () => {
  const [alphaContacts, setAlphaContacts] = useState<Contact[]>([]);
  const pullContactsQuery = api.hubspot.pullFromAlpha.useQuery(
    { accountType: "alpha" },
    {
      enabled: false,
    }
  );
  const fetchAlphaContacts = async () => {
    try {
      await pullContactsQuery.refetch();
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    setAlphaContacts(pullContactsQuery.data?.hubspotResponse.results || []);
  }, [pullContactsQuery.data]);

  useEffect(() => {
    fetchAlphaContacts();
  }, []);
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Contacts from Alpha Portal
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Total Contacts: {alphaContacts?.length}
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
              <DataTable contacts={alphaContacts} />
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
};
export default Alpha;
