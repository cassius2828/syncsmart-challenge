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
const singleContactCreateURL = `https://api.hubapi.com/crm/v3/objects/contacts/`;
const readObjectContactsURL = `https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=phone&properties=firstname&properties=lastname&properties=email`;

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

      // initial approach -- batch all contact creation post
      return await batchCreateContactsPost({
        contacts,
        accountType: input.accountType,
      });
    }),

  // PULL FROM ALPHA PORTAL
  pullFromAlpha: publicProcedure
    .input(
      z.object({
        accountType: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await pullFromAlphaServiceFn(input.accountType);
    }),
});

///////////////////////////
// * Service Functions
///////////////////////////

// fallback single create contact post
async function fallBackCreateContactPosts({
  contacts,
  accountType,
  err,
}: {
  contacts: Contact[];
  accountType: string;
  err: unknown;
}) {
  if (typeof err === "object" && err !== null) {
    const errorObj = err as { message?: string; response?: object };
    const isConflict =
      errorObj.message === "BATCH_CONFLICT" ||
      errorObj.response?.data?.category === "CONFLICT";

    if (isConflict) {
      console.warn(`Batch conflict -- falling back to individual POSTs`);
    }
  }
  const successes: Contact[] = [];
  const failures: { contact: Contact; error: string }[] = [];

  const token =
    accountType === "alpha"
      ? process.env.NEXT_PUBLIC_ALPHA_HUBSPOT_API_TOKEN
      : process.env.NEXT_PUBLIC_BETA_HUBSPOT_API_TOKEN;
  // * create arr of Promises to run all concurrently
  const contactPromises = contacts.map(async (contact) => {
    const { firstname, lastname, email, phone } = contact.properties;
    const singleBody = {
      properties: {
        firstname,
        lastname,
        phone,
        email,
      },
    };
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    await axios
      .post(singleContactCreateURL, singleBody, options)
      .then((_) => successes.push(contact))
      .catch((err) => {
        failures.push({
          contact,
          error: err.message || "Failed to add contact",
        });
      });


  });
  await Promise.all(contactPromises);
  return {
    success: failures.length === 0,
    message: `Fallback complete. ${successes.length} succeeded, ${failures.length} failed. `,
    results: {
      successes,
      failures,
    },
  };
}

// batch create contacts post
async function batchCreateContactsPost({
  contacts,
  accountType,
}: {
  contacts: Contact[];
  accountType: string;
}) {
  const batchBody = {
    inputs: contacts.map((contact) => {
      const { firstname, lastname, email, phone } = contact.properties;
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
      accountType === "alpha"
        ? process.env.NEXT_PUBLIC_ALPHA_HUBSPOT_API_TOKEN
        : process.env.NEXT_PUBLIC_BETA_HUBSPOT_API_TOKEN;

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(batchContactsCreateURL, batchBody, options);

    console.log("HubSpot Batch Response:", res.data);
    if (res.data?.result?.data?.error?.category === "CONFLICT") {
      // 🛑 Batch failed — handle fallback
      throw new Error("BATCH_CONFLICT");
    }
    return {
      success: true,
      message: `Successfully added ${contacts.length} contacts.`,
      hubspotResponse: res.data,
    };
  } catch (err: unknown) {
    return await fallBackCreateContactPosts({
      contacts,
      accountType,
      err,
    });
  }
}

// fetch contacts from alpha portal
async function pullFromAlphaServiceFn(accountType: string) {
  const token =
    accountType === "alpha"
      ? process.env.NEXT_PUBLIC_ALPHA_HUBSPOT_API_TOKEN
      : process.env.NEXT_PUBLIC_BETA_HUBSPOT_API_TOKEN;
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(readObjectContactsURL, options);
    console.log(res, " <-- res obj pull");
    return {
      success: true,
      message: `Successfully fetched ${res.data?.results.length} contacts from Portal Alpha.`,
      hubspotResponse: res.data,
    };
  } catch (err: any) {
    console.error("Error: Unable to fetch contacts from alpha.", err);
    return {
      success: false,
      message: "Unable to fetch contacts from alpha",
      error: err.response?.data || err.message,
    };
  }
}
