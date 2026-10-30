import { useEffect, useState } from 'react';
import api, { assetUrl, authHeader } from '../api/client';

const profileToForm = (profile) => ({
  name: profile.name || '',
  title: profile.title || '',
  bio: profile.bio || '',
  location: profile.location || '',
  email: profile.email || '',
  phone: profile.phone || '',
  skills: (profile.skills || []).join('\n'),
  languages: (profile.languages || []).join('\n'),
  services: (profile.services || []).map((item) => `${item.title} | ${item.description}`).join('\n'),
  experience: (profile.experience || []).map((item) =>
    `${item.role} | ${item.company} | ${item.duration} | ${(item.responsibilities || []).join('; ')}`
  ).join('\n'),
  education: (profile.education || []).map((item) =>
    `${item.degree} | ${item.institution} | ${item.period} | ${item.details || ''}`
  ).join('\n'),
  socialLinks: (profile.socialLinks || []).map((item) => `${item.label} | ${item.url}`).join('\n'),
});

const splitLines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const splitColumns = (line) => line.split('|').map((part) => part.trim());

const ProfileSection = () => {
  const [form, setForm] = useState(profileToForm({}));
  const [currentProfile, setCurrentProfile] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/profile')
      .then(({ data }) => {
        if (!active) return;
        setCurrentProfile(data);
        setForm(profileToForm(data));
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load profile.');
      });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const data = new FormData();
    ['name', 'title', 'bio', 'location', 'email', 'phone'].forEach((field) => data.append(field, form[field]));
    data.append('skills', JSON.stringify(splitLines(form.skills)));
    data.append('languages', JSON.stringify(splitLines(form.languages)));
    data.append('services', JSON.stringify(splitLines(form.services).map((line) => {
      const [title, ...description] = splitColumns(line);
      return { title, description: description.join(' | ') };
    }).filter((item) => item.title && item.description)));
    data.append('experience', JSON.stringify(splitLines(form.experience).map((line) => {
      const [role, company, duration, responsibilities = ''] = splitColumns(line);
      return { role, company, duration, responsibilities: responsibilities.split(';').map((item) => item.trim()).filter(Boolean) };
    }).filter((item) => item.role && item.company && item.duration)));
    data.append('education', JSON.stringify(splitLines(form.education).map((line) => {
      const [degree, institution, period, ...details] = splitColumns(line);
      return { degree, institution, period, details: details.join(' | ') };
    }).filter((item) => item.degree && item.institution)));
    data.append('socialLinks', JSON.stringify(splitLines(form.socialLinks).map((line) => {
      const [label, ...url] = splitColumns(line);
      return { label, url: url.join(' | ') };
    }).filter((item) => item.label && /^https?:\/\//i.test(item.url))));
    if (profileImage) data.append('profileImage', profileImage);
    if (resume) data.append('resume', resume);

    try {
      const { data: updatedProfile } = await api.put('/profile', data, { headers: authHeader() });
      setCurrentProfile(updatedProfile);
      setForm(profileToForm(updatedProfile));
      setProfileImage(null);
      setResume(null);
      event.target.reset();
      setSuccess('Profile saved. Your public portfolio now shows the updated details.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  };

  const textField = (name, label, options = {}) => (
    <label className="admin-field" key={name}>
      <span>{label}</span>
      {options.multiline ? (
        <textarea name={name} value={form[name]} onChange={handleChange} rows={options.rows || 3} />
      ) : (
        <input name={name} type={options.type || 'text'} value={form[name]} onChange={handleChange} />
      )}
    </label>
  );

  return (
    <section className="admin-section">
      <h2 className="section-title">Portfolio profile</h2>
      <p className="admin-help">Edit your public details, skills, services, experience, education, and links here.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      <form className="admin-form card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          {textField('name', 'Name')}
          {textField('title', 'Professional title')}
          {textField('email', 'Public email', { type: 'email' })}
          {textField('phone', 'Public phone')}
          {textField('location', 'Location')}
        </div>
        {textField('bio', 'About / biography', { multiline: true, rows: 5 })}

        <div className="admin-form-grid">
          {textField('skills', 'Skills (one per line)', { multiline: true, rows: 5 })}
          {textField('languages', 'Languages (one per line)', { multiline: true, rows: 5 })}
          {textField('services', 'Services (one per line: title | description)', { multiline: true, rows: 6 })}
          {textField('experience', 'Experience (role | company | dates | responsibilities separated by ;)', { multiline: true, rows: 6 })}
          {textField('education', 'Education (degree | institution | dates | details)', { multiline: true, rows: 5 })}
          {textField('socialLinks', 'Social links (label | https://address)', { multiline: true, rows: 5 })}
        </div>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Profile image (JPEG or PNG, up to 5 MB)</span>
            <input type="file" accept="image/jpeg,image/png" onChange={(event) => setProfileImage(event.target.files?.[0] || null)} />
            {currentProfile.profileImageUrl && <a href={assetUrl(currentProfile.profileImageUrl)} target="_blank" rel="noreferrer">View current image</a>}
          </label>
          <label className="admin-field">
            <span>Resume (PDF, up to 5 MB)</span>
            <input type="file" accept="application/pdf" onChange={(event) => setResume(event.target.files?.[0] || null)} />
            {currentProfile.resumeUrl && <a href={assetUrl(currentProfile.resumeUrl)} target="_blank" rel="noreferrer">View current resume</a>}
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'SAVING…' : 'SAVE PROFILE'}
        </button>
      </form>
    </section>
  );
};

export default ProfileSection;
