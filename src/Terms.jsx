import React from 'react';
import './Page.css'; 

const Terms = () => {
  return (
    <main className="container page-center" style={{ padding: '3rem 0' }}>
      <h1>Terms &amp; Conditions</h1>
      <p>
        Please read these terms and conditions carefully before using our service.
        By accessing or using the service, you agree to be bound by these terms.
      </p>

      <section>
        <h2>Use of Service</h2>
        <p>
          You agree to use the service only for lawful purposes and in a way that does not
          infringe the rights of others or restrict their use and enjoyment of the service.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Ravindra Stores will not be liable for any
          indirect or consequential loss arising from your use of the service.
        </p>
      </section>
    </main>
  );
};

export default Terms;
