import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Zip Blocker Pro</h1>
        <p className={styles.text}>
          Set up a blacklist of zip codes. Customers who use those zip codes
          can&apos;t complete checkout.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input
                className={styles.input}
                type="text"
                name="shop"
                placeholder="my-store.myshopify.com"
              />
              <span className={styles.hint}>e.g. my-store.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in to the app
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Blacklist zip codes</strong>. Add any zip codes you don&apos;t
            want to ship to. One list, full control.
          </li>
          <li>
            <strong>Block at checkout</strong>. Customers entering a blocked zip
            can&apos;t complete their order—no manual checks needed.
          </li>
          <li>
            <strong>Simple setup</strong>. Enter your zips in the app, enable
            checkout validation in Shopify, and you&apos;re done.
          </li>
        </ul>
        <footer className={styles.footer}>
          <Link to="/privacy">Privacy Policy</Link>
        </footer>
      </div>
    </div>
  );
}
