import React, { useState, useRef } from 'react';
import { ArrowRight, Upload } from 'lucide-react';

export default function LandingPage({ onStart }) {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName]     = useState('');
  const [dragOver, setDragOver]     = useState(false);
  const [error, setError]           = useState('');
  const fileRef = useRef();

  function readFile(file) {
    if (!file) return;
    setError('');
    setFileName(file.name);

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = e => setResumeText(e.target.result);
      reader.readAsText(file);
      return;
    }

    if (file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async e => {
        const bytes = new Uint8Array(e.target.result);
        const str = new TextDecoder('latin1').decode(bytes);
        const blocks = str.match(/BT[\s\S]*?ET/g) || [];
        let text = '';
        blocks.forEach(b => {
          const parts = b.match(/\(([^)]+)\)/g) || [];
          parts.forEach(p => { text += p.replace(/[()]/g, '') + ' '; });
        });
        if (text.trim().length > 80) {
          setResumeText(text.trim());
        } else {
          setResumeText('');
          setError('Could not extract text from this PDF. Please paste your resume text below.');
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    setError('Please upload a .txt or .pdf file, or paste your resume text below.');
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  }

  function handleSubmit() {
    if (resumeText.trim().length < 80) {
      setError('Please add more content — we need your full resume for accurate matches.');
      return;
    }
    onStart(resumeText.trim());
  }

  const ready = resumeText.trim().length >= 80;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* NAV */}
      <nav style={{
        padding:'1.25rem 2rem',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <span style={{ fontFamily:'var(--display)', fontSize:18, fontWeight:500, letterSpacing:'-0.02em' }}>
          InternMatch
        </span>
        <span style={{ fontSize:12, color:'var(--text-3)' }}>AI-powered internship matching</span>
      </nav>

      {/* MAIN */}
      <main style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', padding:'3rem 1.5rem',
      }}>
        <div style={{ width:'100%', maxWidth:560 }}>

          {/* Headline */}
          <div className="fade-up" style={{ marginBottom:'2.5rem' }}>
            <h1 style={{
              fontFamily:'var(--display)',
              fontSize:'clamp(36px, 5vw, 52px)',
              fontWeight:500, lineHeight:1.12,
              letterSpacing:'-0.03em',
              marginBottom:'1rem',
            }}>
              Find internships<br />
              <em style={{ fontStyle:'italic', fontWeight:300 }}>built for your resume.</em>
            </h1>
            <p style={{ fontSize:15, color:'var(--text-2)', lineHeight:1.7, maxWidth:440 }}>
              Upload your resume and get matched to real tech internships in seconds — no account, no noise.
            </p>
          </div>

          {/* Upload card */}
          <div className="fade-up fade-up-2 card" style={{ padding:'1.75rem', marginBottom: error ? '0.75rem' : '1rem' }}>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border:`1.5px dashed ${dragOver ? 'var(--text)' : 'var(--border-dark)'}`,
                borderRadius:10, padding:'1.5rem',
                textAlign:'center', cursor:'pointer',
                background: dragOver ? 'var(--bg-subtle)' : 'var(--bg)',
                transition:'all 0.15s', marginBottom:'1.25rem',
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={e => readFile(e.target.files[0])} style={{ display:'none' }} />
              <Upload size={18} color={fileName ? 'var(--green)' : 'var(--text-3)'} style={{ marginBottom:8 }} />
              {fileName ? (
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--green)' }}>{fileName} ✓</div>
                  <div style={{ fontSize:12, color:'var(--text-3)', marginTop:3 }}>Click to change</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--text-2)' }}>Drop your resume here</div>
                  <div style={{ fontSize:12, color:'var(--text-3)', marginTop:3 }}>PDF or TXT · or paste below</div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.25rem' }}>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
              <span style={{ fontSize:11, color:'var(--text-3)', fontFamily:'var(--mono)' }}>or paste text</span>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
            </div>

            {/* Textarea */}
            <textarea
              value={resumeText}
              onChange={e => { setResumeText(e.target.value); setError(''); }}
              placeholder="Paste your resume here…"
              rows={8}
              style={{
                padding:'12px 14px', fontSize:13, lineHeight:1.65,
                resize:'vertical', marginBottom:'1.25rem',
                fontFamily:'var(--mono)', color:'var(--text)',
              }}
            />

            {/* Submit */}
            <button
              className="btn btn-dark"
              onClick={handleSubmit}
              disabled={!ready}
              style={{ width:'100%', justifyContent:'center', padding:'13px' }}
            >
              Find my matches <ArrowRight size={15} />
            </button>
          </div>

          {error && (
            <div className="fade-up" style={{
              fontSize:13, color:'var(--red)', padding:'10px 14px',
              background:'#FEF2F2', border:'1px solid #FECACA',
              borderRadius:8, marginBottom:'1rem',
            }}>
              {error}
            </div>
          )}

          {/* Trust line */}
          <div className="fade-up fade-up-3" style={{ textAlign:'center' }}>
            <p style={{ fontSize:12, color:'var(--text-3)', lineHeight:1.7 }}>
              Your resume is never stored or shared — processed in your browser session only.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop:'1px solid var(--border)', padding:'1.25rem 2rem',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontSize:12, color:'var(--text-3)',
      }}>
        <span style={{ fontFamily:'var(--display)', fontWeight:500 }}>InternMatch</span>
        <span>Powered by Google Gemini</span>
      </footer>
    </div>
  );
}
