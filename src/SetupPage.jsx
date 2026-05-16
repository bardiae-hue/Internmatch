import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Key, Upload, Eye, EyeOff, Zap, FileText } from 'lucide-react';
import { validateKey } from './gemini';

export default function SetupPage({ onComplete, onBack }) {
  const [step, setStep]             = useState('key'); // 'key' | 'resume'
  const [apiKey, setApiKey]         = useState('');
  const [showKey, setShowKey]       = useState(false);
  const [keyError, setKeyError]     = useState('');
  const [validating, setValidating] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName]     = useState('');
  const [dragOver, setDragOver]     = useState(false);
  const fileRef = useRef();

  /* ── Key validation ── */
  async function handleValidateKey() {
    if (!apiKey.trim()) { setKeyError('Please enter your API key.'); return; }
    setValidating(true);
    setKeyError('');
    try {
      await validateKey(apiKey.trim());
      setStep('resume');
    } catch (e) {
      setKeyError(e.message || 'Invalid API key. Check and try again.');
    } finally {
      setValidating(false);
    }
  }

  /* ── File reading ── */
  function readFile(file) {
    if (!file) return;
    setFileName(file.name);

    // Plain text / markdown
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = e => setResumeText(e.target.result);
      reader.readAsText(file);
      return;
    }

    // PDF — extract via text extraction hack (readable text PDFs only)
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          // Try to extract readable text from PDF bytes
          const bytes = new Uint8Array(e.target.result);
          let text = '';
          // Simple PDF text extraction: look for stream text between BT and ET markers
          const str = new TextDecoder('latin1').decode(bytes);
          const btEt = str.match(/BT[\s\S]*?ET/g) || [];
          btEt.forEach(block => {
            const parts = block.match(/\(([^)]+)\)/g) || [];
            parts.forEach(p => { text += p.replace(/[()]/g, '') + ' '; });
          });
          if (text.trim().length > 50) {
            setResumeText(text.trim());
          } else {
            setResumeText(`[PDF uploaded: ${file.name}]\n\nNote: This PDF may be image-based. For best results, paste your resume text directly below instead.`);
          }
        } catch {
          setResumeText(`Resume file: ${file.name}\n\nPlease paste your resume text in the box below for best results.`);
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // DOCX — tell user to paste
    setResumeText(`File uploaded: ${file.name}\n\nFor DOCX files, please paste your resume text directly in the box below.`);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    if (file) readFile(file);
  }

  function handleSubmit() {
    if (resumeText.trim().length < 100) return;
    onComplete({ apiKey: apiKey.trim(), resumeText: resumeText.trim() });
  }

  /* ── Render ── */
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'2rem', minHeight:'80vh' }}>

      {/* Progress */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'2.5rem' }}>
        {['API Key', 'Resume'].map((label, i) => {
          const active = (i === 0 && step === 'key') || (i === 1 && step === 'resume');
          const done   = i === 0 && step === 'resume';
          return (
            <React.Fragment key={label}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{
                  width:24, height:24, borderRadius:'50%',
                  background: done ? 'var(--green)' : active ? 'var(--purple)' : 'var(--bg-elevated)',
                  border: `1px solid ${done ? 'var(--green)' : active ? 'var(--purple)' : 'var(--border-default)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:600,
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{ fontSize:13, fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
              </div>
              {i === 0 && (
                <div style={{ width:32, height:1, background: step === 'resume' ? 'var(--purple)' : 'var(--border-default)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── STEP 1: API Key ── */}
      {step === 'key' && (
        <div className="fade-up card" style={{ width:'100%', maxWidth:480, padding:'2.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--purple-dim)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Key size={16} color="var(--purple-light)" />
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:700, letterSpacing:'-0.02em' }}>Enter your Gemini API key</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Free · No credit card required</div>
            </div>
          </div>

          <div style={{
            padding:'12px 14px', borderRadius:10,
            background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.15)',
            fontSize:13, color:'#4ade80', marginBottom:'1.5rem', lineHeight:1.55,
          }}>
            Get a free key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
              style={{ color:'#86efac', fontWeight:600 }}>
              aistudio.google.com
            </a>
            {' '}→ "Create API key" — 2 minutes, completely free.
          </div>

          <div style={{ position:'relative', marginBottom: keyError ? 8 : '1.5rem' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setKeyError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleValidateKey()}
              placeholder="AIzaSy..."
              style={{
                width:'100%', padding:'11px 42px 11px 14px',
                background:'var(--bg-elevated)', border:`1px solid ${keyError ? 'var(--red)' : 'var(--border-default)'}`,
                borderRadius:10, color:'var(--text-primary)', fontSize:14,
                fontFamily:'var(--mono)', outline:'none',
                transition:'border-color 0.15s',
              }}
            />
            <button onClick={() => setShowKey(v => !v)} style={{
              position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer',
              color:'var(--text-muted)', display:'flex', padding:0,
            }}>
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {keyError && (
            <div style={{ fontSize:12, color:'var(--red)', marginBottom:'1.5rem' }}>{keyError}</div>
          )}

          <div style={{ display:'flex', gap:8, justifyContent:'space-between', alignItems:'center' }}>
            <button className="btn-ghost" onClick={onBack} style={{ fontSize:13, padding:'9px 14px' }}>
              <ArrowLeft size={13} /> Back
            </button>
            <button className="btn-primary" onClick={handleValidateKey} disabled={!apiKey.trim() || validating}>
              {validating ? <><div className="spinner" />Validating…</> : <>Continue <ArrowRight size={14} /></>}
            </button>
          </div>

          <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:'1.25rem', textAlign:'center', lineHeight:1.6 }}>
            🔒 Your key is only stored in this browser session and never sent to any server other than Google.
          </p>
        </div>
      )}

      {/* ── STEP 2: Resume ── */}
      {step === 'resume' && (
        <div className="fade-up card" style={{ width:'100%', maxWidth:560, padding:'2.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--purple-dim)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FileText size={16} color="var(--purple-light)" />
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:700, letterSpacing:'-0.02em' }}>Upload your resume</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>PDF, TXT, or paste text directly</div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border:`2px dashed ${dragOver ? 'var(--purple)' : 'var(--border-default)'}`,
              borderRadius:12, padding:'1.75rem 1.5rem', textAlign:'center',
              cursor:'pointer', marginBottom:'1rem', transition:'border-color 0.15s',
              background: dragOver ? 'var(--purple-dim)' : 'transparent',
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.txt,.md,.docx" onChange={handleFileInput} style={{ display:'none' }} />
            <Upload size={22} color={dragOver ? 'var(--purple-light)' : 'var(--text-muted)'} style={{ marginBottom:8 }} />
            {fileName ? (
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{fileName}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Click to change file</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>Drop your resume here</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>or click to browse · PDF, TXT, DOCX</div>
              </div>
            )}
          </div>

          {/* Text area */}
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>
            Or paste your resume text directly:
          </div>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume here — the more detail, the better the matches…"
            rows={10}
            style={{
              width:'100%', padding:'12px 14px',
              background:'var(--bg-elevated)', border:'1px solid var(--border-default)',
              borderRadius:10, color:'var(--text-primary)', fontSize:13,
              fontFamily:'var(--mono)', outline:'none', resize:'vertical',
              lineHeight:1.6, marginBottom:'1.5rem',
            }}
          />

          <div style={{ display:'flex', gap:8, justifyContent:'space-between', alignItems:'center' }}>
            <button className="btn-ghost" onClick={() => setStep('key')} style={{ fontSize:13, padding:'9px 14px' }}>
              <ArrowLeft size={13} /> Back
            </button>
            <button className="btn-primary" onClick={handleSubmit}
              disabled={resumeText.trim().length < 100}>
              Find my matches <ArrowRight size={14} />
            </button>
          </div>

          {resumeText.trim().length > 0 && resumeText.trim().length < 100 && (
            <p style={{ fontSize:12, color:'var(--amber)', marginTop:10, textAlign:'center' }}>
              Add more content — we need at least a bit more to make accurate matches.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
