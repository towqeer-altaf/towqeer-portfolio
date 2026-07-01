import { useEffect, useState } from 'react';

// Cycles through `words`, typing and deleting each one in turn.
const useTypewriter = (words, { typingSpeed = 90, deletingSpeed = 45, pauseTime = 1800 } = {}) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timeout;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        const nextLength = text.length + (deleting ? -1 : 1);
        setText(current.slice(0, nextLength));
      }, deleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

export default useTypewriter;
