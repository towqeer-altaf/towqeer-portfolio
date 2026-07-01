import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

// Placeholder viewer. Drop your resume at /public/resume.pdf and it will
// render inline here automatically — nothing else needs to change.
const CV_FILE_PATH = '/resume.pdf';

const CvModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cv-modal-backdrop" onClick={onClose}>
      <div
        className="cv-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Curriculum vitae preview"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="cv-modal-close" onClick={onClose} aria-label="Close CV preview">
          <CloseIcon size={18} />
        </button>
        <div className="cv-modal-body">
          <object data={CV_FILE_PATH} type="application/pdf" width="100%" height="100%">
            <div className="cv-modal-fallback">
              <p>Your CV isn't uploaded yet.</p>
              <p className="cv-modal-fallback-hint">Add a file at <code>public{CV_FILE_PATH}</code> and it'll appear here automatically.</p>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};

export default CvModal;
