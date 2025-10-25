import React from 'react';
import { Link } from 'react-router-dom';
import './Page.css'; 

const About = () => {
  return (
    <main className="container page-center" style={{ padding: '3rem 0' }}>
      <h1>About Ravindra Stores</h1>
      <p>
        Ravindra Stores is a family-run grocery business dedicated to delivering fresh,
        high-quality groceries to our community. We source products from trusted
        suppliers and focus on sustainable, local produce where possible.
      </p>

      <section>
        <h2>Our Mission</h2>
        <p>
          To make healthy, affordable food accessible to everyone - with fast delivery
          and friendly service.
        </p>
      </section>

      <section>
        <h2>Get in touch</h2>
        <p>
          Have questions? Visit our <Link to="/contact" className="link-text">Contact</Link> page.
        </p>
      </section>
    </main>
  );
};

export default About;
