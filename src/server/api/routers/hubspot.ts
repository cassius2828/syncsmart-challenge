import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import axios from "axios";
import { type Contact } from "coding-challenge/utils/types";

// batching causes an issue when some of the data has already been transferred
// may be better to either do iterate and do every one, or have a fall back of iteration, or
// lastly try removing ids that fail and try again

// * Batch = 1 call, all data in or none in
// * Single = allows succeeding data to prevail and failed to stay out, also allows for optional fields to be included
const batchContactsCreateURL = `https://api.hubapi.com/crm/v3/objects/contacts/batch/create`;
const readObjectContactsURL = `https://api.hubapi.com/crm/v3/objects/contacts?properties=phone&properties=firstname&properties=lastname&properties=email`;

const contactInputSchema = z.array(
  z.object({
    properties: z.object({
      firstname: z.string(),
      lastname: z.string(),
      phone: z.string(),
      email: z.string().email(),
    }),
  })
);

export const hubspotRouter = createTRPCRouter({
  addContacts: publicProcedure
    .input(
      z.object({
        contacts: contactInputSchema,
        accountType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const contacts: Contact[] = input.contacts;

      const batchBody = {
        inputs: contacts.map((contact) => {
          const { firstname, lastname, email, phone } =
            contact.properties;
          return {
            properties: {
              firstname,
              lastname,
              phone,
              email,
            },
          };
        }),
      };

      try {
        const token =
          input.accountType === "alpha"
            ? process.env.NEXT_PUBLIC_ALPHA_HUBSPOT_API_TOKEN
            : process.env.NEXT_PUBLIC_BETA_HUBSPOT_API_TOKEN;
        console.log(token, "token");
        const res = await axios.post(batchContactsCreateURL, batchBody, {
          headers: {
            Authorization: `Bearer ${token}`,
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
  pullFromAlpha: publicProcedure.query(async () => {
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
