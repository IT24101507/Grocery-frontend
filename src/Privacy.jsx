import React from 'react';
import './Page.css'; 

const Privacy = () => {
  return (
    <main className="container page-center" style={{ padding: '3rem 0' }}>
      <h1>Privacy Policy</h1>
      <p>
        We are committed to protecting your privacy. This policy explains how we collect,
        use and disclose personal information.
      </p>   

      <section>
        <h2>Information Collection</h2>
        <p>
          We collect information you provide directly (for example, when creating an account)
          and information collected automatically (such as usage data).
        </p>
      </section>

      <section>
        <h2>Use of Information</h2>
        <p>
          We use personal data to provide, maintain, and improve our services and to communicate with you.
        </p>
      </section>
    </main>
  );
};

export default Privacy;
