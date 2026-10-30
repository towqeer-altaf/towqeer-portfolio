import { useState } from 'react';
import api from '../api/client';

const HomeContactSection = ({ profile }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ message: '', error: false });
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ message: '', error: false });
    setSending(true);
    try {
      await api.post('/contact', form);
      setForm({ name: '', email: '', subject: '', message: '' });
      setStatus({ message: 'Thanks for your message. I’ll be in touch soon.', error: false });
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || 'Your message could not be sent. Please try again later.',
        error: true,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="portfolio-section contact-section" id="contact">
      <div className="section-heading">
        <p className="eyebrow">Have a project in mind?</p>
        <h2>Let’s build something meaningful.</h2>
        <p className="section-copy">Send a message to discuss a project, opportunity, or collaboration.</p>
      </div>
      <div className="contact-layout">
        <div className="contact-details">
          <h3>Get in touch</h3>
          {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
          {profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}
          {profile.location && <p>{profile.location}</p>}
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-fields">
            <label>
              Your name
              <input name="name" value={form.name} onChange={handleChange} required maxLength={120} />
            </label>
            <label>
              Your email
              <input name="email" type="email" value={form.email} onChange={handleChange} required maxLength={254} />
            </label>
          </div>
          <label>
            Subject
            <input name="subject" value={form.subject} onChange={handleChange} required maxLength={200} />
          </label>
          <label>
            Message
            <textarea name="message" value={form.message} onChange={handleChange} required maxLength={5000} rows="6" />
          </label>
          <button className="portfolio-button portfolio-button--primary" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send message ↗'}
          </button>
          {status.message && <p className={status.error ? 'form-status form-status--error' : 'form-status'} role="status">{status.message}</p>}
        </form>
      </div>
    </section>
  );
};

export default HomeContactSection;
