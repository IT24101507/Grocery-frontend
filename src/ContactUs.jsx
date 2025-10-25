import React from 'react';
import './Page.css';

const ContactUs = () => {
  return (
    <main className="container page-center" style={{ padding: '3rem 0' }}>
      <h1>Contact Us</h1>

      <p>
        We'd love to hear from you. Reach out with questions, feedback or partnership
        inquiries and we'll get back to you as soon as possible.
      </p>

      <section>
        <h2>Customer Support</h2>
        <strong>0762294533</strong><br />
        <strong>contact@ravindrastoreslk@gmail.com</strong><br />
        <strong>SLIIT Malabe</strong>
      </section>

      <section>
        <h2>Business Hours</h2>
        <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
        <p>Sat - Sun: 9:00 AM - 6:00 PM</p>
      </section>
    </main>
  );
};

export default ContactUs;
