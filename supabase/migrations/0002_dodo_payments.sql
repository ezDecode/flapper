-- Rename Stripe columns to Dodo Payments
ALTER TABLE public.users RENAME COLUMN stripe_customer_id TO dodo_customer_id;
ALTER TABLE public.users RENAME COLUMN stripe_subscription_id TO dodo_subscription_id;
