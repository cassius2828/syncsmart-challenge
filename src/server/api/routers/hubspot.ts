import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import axios from "axios";
import { type Contact } from "coding-challenge/utils/types";

const batchContactsCreateURL = `https://api.hubapi.com/crm/v3/objects/contacts/batch/create`;
const readObjectContactsURL = `https://api.hubapi.com/crm/v3/objects/contacts`;

const contactInputSchema = z.array(
  z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
  })
);

export const hubspotRouter = createTRPCRouter({
  addContactsToAlpha: publicProcedure
    .input(z.object({ contacts: contactInputSchema }))
    .mutation(async ({ input }) => {
      const contacts: Contact[] = input.contacts;

      const batchBody = {
        inputs: contacts.map((contact) => ({
          properties: {
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email,
          },
        })),
      };

      try {
        const res = await axios.post(batchContactsCreateURL, batchBody, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALPHA_HUBSPOT_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        console.log("HubSpot Batch Response:", res.data);

        return {
          success: true,
          message: `Successfully added ${contacts.length} contacts.`,
          hubspotResponse: res.data,
        };
      } catch (err: any) {
        console.error(
          "Batch create failed:",
          err.response?.data || err.message
        );
        return {
          success: false,
          message: "Failed to batch add contacts.",
          error: err.response?.data || err.message,
        };
      }
    }),
  pullFromAlpha: publicProcedure
  .query(async () => {
      try {
        const options = {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALPHA_HUBSPOT_API_TOKEN}`,
          },
        };
        const res = await axios.get(readObjectContactsURL, options);

        return {
            success: true,
            message: `Successfully fetched ${res.data?.length} contacts from Portal Alpha.`,
            hubspotResponse: res.data,
          };
      } catch (err) {
        console.error("Error: Unable to fetch contacts from alpha.", err);
        return {
          success: false,
          message: "Unable to fetch contacts from alpha",
          error: err.response?.data || err.message,
        };
      }
    }),
});
