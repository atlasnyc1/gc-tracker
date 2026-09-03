import Stripe from "stripe";

// The one place Stripe gets set up, using the secret key that
// must never be sent to the browser.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
