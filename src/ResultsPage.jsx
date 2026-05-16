import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { matchInternships, generateCoverLetter, reviewResume } from './gemini';

/* ── Helpers ── */
function ScoreBadge({ score }) {
  const color = score >= 80 ? '#4ade80' : score >= 65 ? '#fbbf24' : '#f87171';
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      width:52, height:52, borderRadius:'50%',
      border:`2.5px solid ${color}`,
      color, fontSize:15, fontWeight:700, letterSpacing:'-0.02em', flexShrink:0,
    }}>
      {score}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:99,
      background:'var(--purple-dim)', color:'var(--purple-light)',
      border:'1px solid rgba(120,100,255,0.2)',
    }}>{children}</span>
  );
}

/* ── Match Card ── */
function MatchCard({ job, apiKey, resumeText }) {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState('why');   // 'why' | 'cover' | 'interview'
  const [coverLetter, setCoverLetter]   = useState('');
  const [loadingCover, setLoadingCover] = useState(false);

  async function handleCoverLetter() {
    if (coverLetter) { setTab('cover'); return; }
    setLoadingCover(true);
    try {
      const text = await generateCoverLetter(apiKey, resumeText, job);
      setCoverLetter(text);
      setTab('cover');
    } catch (e) {
      setCoverLetter('Error generating cover letter: ' + e.message);
      setTab('cover');
    } finally {
      setLoadingCover(false);
    }
  }

  return (
    <div className="card" style={{ overflow:'hidden', transition:'border-color 0.2s',
      borderColor: open ? 'var(--border-default)' : 'var(--border-subtle)' }}>
      {/* Header row */}
      <div style={{ padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:16, cursor:'pointer' }}
        onClick={() => setOpen(v => !v)}>
        <ScoreBadge score={job.matchScore} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
            <span style={{ fontSize:15, fontWeight:700, letterSpacing:'-0.02em' }}>{job.role}</span>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>@ {job.company}</span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {(job.tags || []).map(t => <Tag key={t}>{t}</Tag>)}
            <span style={{ fontSize:11, color:'var(--text-muted)', padding:'2px 6px' }}>📍 {job.location}</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <a href={job.applyUrl || '#'} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display:'inline-flex', alignItems:'center', gap:5,
              padding:'7px 14px', borderRadius:8,
              background:'var(--purple)', color:'#fff',
              fontSize:12, fontWeight:600, textDecoration:'none',
            }}>
            Apply <ExternalLink size={11} />
          </a>
          {open ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ borderTop:'1px solid var(--border-subtle)', padding:'1.25rem 1.5rem' }}>
          {/* Tabs */}
          <div style={{ display:'flex', gap:2, marginBottom:'1.25rem',
            background:'var(--bg-elevated)', borderRadius:8, padding:3, width:'fit-content' }}>
            {[['why','Why you fit'], ['cover','Cover letter'], ['interview','Interview tips']].map(([id, label]) => (
              <button key={id}
                onClick={() => { setTab(id); if (id === 'cover') handleCoverLetter(); }}
                style={{
                  padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer',
                  fontSize:12, fontWeight:600, fontFamily:'inherit',
                  background: tab === id ? 'var(--purple)' : 'transparent',
                  color: tab === id ? '#fff' : 'var(--text-muted)',
                  transition:'all 0.15s',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Why you fit */}
          {tab === 'why' && (
            <div>
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--green)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>✓ Why you fit</div>
                {(job.matchReasons || []).map((r, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                    <span style={{ color:'var(--green)', flexShrink:0, marginTop:1 }}>+</span>
                    <span style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.55 }}>{r}</span>
                  </div>
                ))}
              </div>
              {(job.gaps || []).length > 0 && (
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--amber)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>⚠ Gaps to address</div>
                  {job.gaps.map((g, i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                      <span style={{ color:'var(--amber)', flexShrink:0, marginTop:1 }}>–</span>
                      <span style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.55 }}>{g}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cover letter */}
          {tab === 'cover' && (
            <div>
              {loadingCover ? (
                <div style={{ display:'flex', alignItems:'center', gap:10, color:'var(--text-muted)', fontSize:13, padding:'1rem 0' }}>
                  <div className="spinner" /> Generating personalized cover letter…
                </div>
              ) : (
                <div>
                  <textarea
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={12}
                    style={{
                      width:'100%', padding:'12px 14px',
                      background:'var(--bg-elevated)', border:'1px solid var(--border-default)',
                      borderRadius:10, color:'var(--text-primary)', fontSize:13,
                      fontFamily:'inherit', outline:'none', resize:'vertical', lineHeight:1.7,
                    }}
                  />
                  <button onClick={() => navigator.clipboard.writeText(coverLetter)}
                    style={{ marginTop:8, fontSize:12, color:'var(--purple-light)',
                      background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                    Copy to clipboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interview tips */}
          {tab === 'interview' && (
            <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7 }}>
              <div style={{ fontWeight:600, color:'var(--text-primary)', marginBottom:10 }}>
                Preparing for {job.company} — {job.role}
              </div>
              <ul style={{ paddingLeft:'1.2rem', display:'flex', flexDirection:'column', gap:8 }}>
                <li>Research {job.company}'s recent products, blog posts, and engineering culture before your interview.</li>
                <li>Expect {job.tags?.slice(0,2).join(' and ')} focused technical questions — review fundamentals and practice on LeetCode.</li>
                <li>Prepare 2–3 stories using the STAR method about projects from your resume.</li>
                <li>Have a strong answer to "Tell me about a time you handled ambiguity or failure."</li>
                <li>Come with 3 thoughtful questions about the team, tech stack, and growth opportunities.</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Resume Review Panel ── */
function ResumeReview({ review }) {
  const priorityColor = { high: 'var(--red)', medium: 'var(--amber)', low: 'var(--text-muted)' };
  return (
    <div className="card" style={{ padding:'1.5rem', marginTop:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <div style={{ fontSize:16, fontWeight:700, letterSpacing:'-0.02em' }}>📋 Resume Review</div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:24, fontWeight:700, letterSpacing:'-0.03em',
            color: review.overallScore >= 75 ? 'var(--green)' : review.overallScore >= 55 ? 'var(--amber)' : 'var(--red)' }}>
            {review.overallScore}/100
          </div>
        </div>
      </div>

      <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:'1.25rem',
        padding:'10px 14px', background:'var(--bg-elevated)', borderRadius:8,
        borderLeft:'3px solid var(--purple)' }}>
        {review.verdict}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:'1.25rem' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--green)', textTransform:'uppercase',
            letterSpacing:'0.06em', marginBottom:8 }}>✓ Strengths</div>
          {(review.strengths || []).map((s, i) => (
            <div key={i} style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.55, marginBottom:5 }}>
              + {s}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--amber)', textTransform:'uppercase',
            letterSpacing:'0.06em', marginBottom:8 }}>⚡ Skills to add</div>
          {(review.missingSkills || []).map((s, i) => (
            <div key={i} style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.55, marginBottom:5 }}>
              → {s}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase',
          letterSpacing:'0.06em', marginBottom:10 }}>Priority fixes</div>
        {(review.fixes || []).map((f, i) => (
          <div key={i} style={{
            padding:'10px 12px', borderRadius:8, marginBottom:8,
            background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)',
            borderLeft:`3px solid ${priorityColor[f.priority] || 'var(--border-default)'}`,
          }}>
            <div style={{ fontSize:12, fontWeight:600, marginBottom:3 }}>{f.issue}</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.55 }}>→ {f.fix}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Results Page ── */
export default function ResultsPage({ apiKey, resumeText, onReset }) {
  const [jobs, setJobs]           = useState([]);
  const [review, setReview]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);
  const [error, setError]         = useState('');
  const [showReview, setShowReview]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const results = await matchInternships(apiKey, resumeText);
        setJobs(results);
      } catch (e) {
        setError(e.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [apiKey, resumeText]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleResumeReview() {
    if (review) { setShowReview(true); return; }
    setLoadingReview(true);
    try {
      const r = await reviewResume(apiKey, resumeText);
      setReview(r);
      setShowReview(true);
    } catch (e) {
      setError('Resume review failed: ' + e.message);
    } finally {
      setLoadingReview(false);
    }
  }

  if (loading) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', gap:16, padding:'4rem 2rem', minHeight:'60vh' }}>
      <div style={{ position:'relative', width:56, height:56 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          border:'2px solid var(--purple-dim)', borderTop:'2px solid var(--purple)',
          animation:'spin 0.8s linear infinite' }} />
        <div style={{ position:'absolute', inset:8, borderRadius:'50%',
          background:'var(--purple-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Zap size={14} color="var(--purple-light)" />
        </div>
      </div>
      <div>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:6, textAlign:'center' }}>Analyzing your resume…</div>
        <div style={{ fontSize:13, color:'var(--text-muted)', textAlign:'center' }}>Matching to thousands of real internships</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'4rem 2rem', textAlign:'center' }}>
      <div style={{ fontSize:32, marginBottom:16 }}>⚠️</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>Something went wrong</div>
      <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:'1.5rem', maxWidth:400 }}>{error}</div>
      <button className="btn-primary" onClick={onReset}>Start over</button>
    </div>
  );

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'2rem', paddingBottom:'4rem' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>Your matches</div>
          <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:'-0.03em' }}>
            {jobs.length} internships matched
          </h1>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-ghost" onClick={handleResumeReview} disabled={loadingReview}
            style={{ fontSize:12, padding:'8px 14px' }}>
            {loadingReview ? <><div className="spinner" />Reviewing…</> : '📋 Review resume'}
          </button>
          <button className="btn-ghost" onClick={onReset} style={{ fontSize:12, padding:'8px 14px' }}>
            <ArrowLeft size={12} /> New search
          </button>
        </div>
      </div>

      {/* Match cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {jobs.map((job, i) => (
          <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <MatchCard job={job} apiKey={apiKey} resumeText={resumeText} />
          </div>
        ))}
      </div>

      {/* Resume review */}
      {showReview && review && <ResumeReview review={review} />}
    </div>
  );
}
