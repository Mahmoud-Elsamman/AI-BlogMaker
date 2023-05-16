import verifyStripe from "@webdeveducation/next-verify-stripe";
import Cors from "micro-cors";
import stripeInit from "stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (error) {
      console.log("Error: ", error);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const client = await clientPromise;
        const db = client.db("AI-BlogMaker");

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        const userProfile = await db.collection("users").updateOne(
          {
            auth0Id: auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id: auth0Id,
            },
          },
          {
            upsert: true,
          }
        );
      }

      default:
        console.log("UNHANDLED EVENT: ", event.type);
    }
  }

  res.status("200").json({ recevied: true });
};

export default cors(handler);
