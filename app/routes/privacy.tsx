import { Link } from "react-router";
import styles from "./privacy.styles.module.css";

export default function Privacy() {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: January 30, 2026</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Introduction</h2>
        <div className={styles.sectionContent}>
          <p>
            Zip Blocker Pro (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is a Shopify app that lets store owners block checkout for customers in certain zip codes. This privacy policy explains what data we use and how we handle it.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data we collect and use</h2>
        <div className={styles.sectionContent}>
          <p>
            <strong>Merchant data.</strong> When you install and use Zip Blocker Pro, we store the list of zip codes you choose to block. This is saved in your Shopify store (via Shopify metafields) so the app can enforce your rules at checkout. We also use standard Shopify session data (e.g. shop domain, access tokens) to run the app; this is stored securely and used only to provide the service.
          </p>
          <p>
            <strong>Customer data at checkout.</strong> When a customer enters a zip code at checkout, Shopify runs our validation to decide whether that zip is blocked. That check happens in the checkout flow; we do not collect or store customers’ zip codes on our own systems. We do not sell or use checkout data for marketing or any purpose other than applying your blocklist.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How we store data</h2>
        <div className={styles.sectionContent}>
          <p>
            Your blocked zip list is stored in your Shopify store (Shopify metafields). Session and technical data needed to run the app may be stored on our infrastructure or with our service providers. We keep data only as long as needed to operate the app and meet legal obligations.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sharing and disclosure</h2>
        <div className={styles.sectionContent}>
          <p>
            We do not sell your data. We may share data only: (1) with Shopify as required to provide the app, (2) with service providers that help us run the app (under strict confidentiality), or (3) when required by law or to protect rights and safety.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <div className={styles.sectionContent}>
          <p>
            For privacy-related questions or requests, contact us at{" "}
            <a href="mailto:zipblockerpro@proton.me">zipblockerpro@proton.me</a>.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Changes</h2>
        <div className={styles.sectionContent}>
          <p>
            We may update this policy from time to time. The &quot;Last updated&quot; date at the top will change when we do. Continued use of the app after changes means you accept the updated policy.
          </p>
        </div>
      </section>

      <Link to="/" className={styles.backLink}>
        ← Back to home
      </Link>
    </main>
  );
}
