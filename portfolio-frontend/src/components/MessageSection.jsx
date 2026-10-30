import { useEffect, useState } from 'react';
import api, { authHeader } from '../api/client';

/**
 * Displays client contact-form submissions. Dashboard only mounts this
 * component when the "messages" tab is active, so the fetch-on-mount
 * effect here naturally replaces the three duplicated
 * "if (activeTab === 'messages')" effects from the original file.
 */
const MessageSection = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/contact', { headers: authHeader() })
      .then(({ data }) => { if (active) setMessages(data); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load messages.');
      });
    return () => { active = false; };
  }, []);

  return (
    <section>
      <h2 className="section-title">Client Inquiries</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && <p className="empty-state">No messages yet.</p>}
      </div>
    </section>
  );
};

export default MessageSection;
