import React, { useState } from 'react';
import axios from 'axios';

const HomeContactSection = () => {
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (field) => (e) => {
    setContactData({ ...contactData, [field]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      // Keys here must exactly match the ones the controller expects
      await axios.post('http://localhost:5000/api/contact', contactData);
      alert('Message sent successfully!');
      setContactData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="contact-inner">
        <div className="contact-header">
          <p className="eyebrow">$ contact --new</p>
          <h2 className="section-title">Let's build something</h2>
        </div>

        <form className="contact-form" onSubmit={handleSendMessage}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                required
                value={contactData.name}
                onChange={handleChange('name')}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={contactData.email}
                onChange={handleChange('email')}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              required
              value={contactData.subject}
              onChange={handleChange('subject')}
            />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              value={contactData.message}
              onChange={handleChange('message')}
            />
          </div>

          <button type="submit" className="submit-btn">&gt; send_message()</button>
        </form>
      </div>
    </section>
  );
};

export default HomeContactSection;
