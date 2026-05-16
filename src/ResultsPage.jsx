import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { matchInternships, generateCoverLetter, reviewResume } from './gemini';

/* ── Score ring ── */
function ScoreRing({ score }) {
  const color = score >= 80 ? 'var(--green)' : score >= 65 ? 'var(--amber)' : '#EF4444';
  return (
    <div style={{
      width:48, height:48, borderRadius:'50%', flexShrink:0,
      border:`2px solid ${color}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      color, fontSize:14, fontWeight:700, fontFamily:'var(--mono)',
      background: score >= 80 ? 'var(--green-bg)' : score >= 65 ? 'var(--amber-bg)' : '#FEF2F2',
    }}>
      {score}
    </div>
  );
}

/* ── Tag chip ── */
function Tag({ children }) {
  return (
    <span style={{
      fontSize:11, fontWeight:500, padding:'2px 9px', borderRadius:99,
      background:'var(--bg-subtle)', color:'var(--text-2)',
      border:'1px solid var(--border)',
    }}>{children}</span>
  );
}

/* ── Match card ── */
function MatchCard({ job, resumeText, index }) {
  const [open, setOpen]         = useState(false);
  const [tab, setTab]           = useState('fit');
  const [cover, setCover]       = useState('');
  const [loadCover, setLoadCover] = useState(false);

  async function getCover() {
    if (cover) { setTab('cover'); return; }
    setLoadCover(true);
    try {
      const text = await generateCoverLetter(resumeText, job);
      setCover(text);
    } catch (e) {
      setCover('Error: ' + e.message);
    } finally {
      setLoadCover(false);
      setTab('cover');
    }
  }

  return (
    <div
      className={`card fade-up fade-up-${Math.min(index + 1, 6)}`}
      style={{ overflow:'hidden', transition:'box-shadow 0.2s', cursor:'default' }}
    >
      {/* Row */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          padding:'1.125rem 1.375rem',
          display:'flex', alignItems:'center', gap:14, cursor:'pointer',
          userSelect:'none',
        }}
      >
        <ScoreRing score={job.matchScore} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap', marginBottom:5 }}>
            <span style={{ fontSize:15, fontWeight:700, letterSpacing:'-0.02em' }}>{job.role}</span>
            <span style={{ fontSize:13, color:'var(--text-2)' }}>at {job.company}</span>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
            {(job.tags || []).map(t => <Tag key={t}>{t}</Tag>)}
            <span style={{ fontSize:11, color:'var(--text-3)', marginLeft:2 }}>· {job.location}</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <a
            href={job.applyUrl || '#'}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="btn btn-dark"
            style={{ padding:'8px 14px', fontSize:12, textDecoration:'none' }}
          >
            Apply <ExternalLink size={11} />
          </a>
          {open
            ? <ChevronUp size={14} color="var(--text-3)" />
            : <ChevronDown size={14} color="var(--text-3)" />
          }
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'1.25rem 1.375rem' }}>
          {/* Tab bar */}
          <div style={{ display:'flex', gap:2, marginBottom:'1.25rem' }}>
            {[['fit','Why you fit'], ['cover','Cover letter'], ['tips','Interview tips']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => { if (id === 'cover') getCover(); else setTab(id); }}
                style={{
                  padding:'6px 13px', border:'none', borderRadius:7, cursor:'pointer',
                  fontSize:12, fontWeight:600, fontFamily:'var(--sans)',
                  background: tab === id ? 'var(--text)' : 'transparent',
                  color: tab === id ? '#fff' : 'var(--text-2)',
                  transition:'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Fit tab */}
          {tab === 'fit' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Why you fit</div>
                {(job.matchReasons || []).map((r, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:7 }}>
                    <span style={{ color:'var(--green)', fontSize:13, flexShrink:0, marginTop:1 }}>+</span>
                    <span style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{r}</span>
                  </div>
                ))}
              </div>
              {(job.gaps || []).length > 0 && (
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Gaps to note</div>
                  {job.gaps.map((g, i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:7 }}>
                      <span style={{ color:'var(--amber)', fontSize:13, flexShrink:0, marginTop:1 }}>–</span>
                      <span style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{g}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cover letter tab */}
          {tab === 'cover' && (
            <div>
              {loadCover ? (
                <div style={{ display:'flex', alignItems:'center', gap:10, color:'var(--text-2)', fontSize:13, padding:'0.5rem 0' }}>
                  <div className="spinner spinner-dark" /> Writing cover letter…
                </div>
              ) : (
                <div>
                  <textarea
                    value={cover}
                    onChange={e => setCover(e.target.value)}
                    rows={11}
                    style={{ padding:'12px 14px', fontSize:13, lineHeight:1.7, resize:'vertical', fontFamily:'var(--sans)', marginBottom:8 }}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(cover)}
                    className="btn btn-outline"
                    style={{ fontSize:12, padding:'7px 14px' }}
                  >
                    Copy text
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interview tips tab */}
          {tab === 'tips' && (
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:12 }}>
                Preparing for {job.company}
              </div>
              <ul style={{ paddingLeft:'1rem', display:'flex', flexDirection:'column', gap:9 }}>
                {[
                  `Study ${(job.tags || []).slice(0,2).join(' and ')} concepts — expect technical questions on these.`,
                  `Research ${job.company}'s recent engineering blog posts and product launches.`,
                  `Prepare 2–3 project stories using the STAR method — focus on impact and decisions made.`,
                  `Have a clear, honest answer to "Tell me about a time you failed and what you learned."`,
                  `Prepare 3 thoughtful questions about the team's tech stack, processes, and mentorship culture.`,
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Resume review panel ── */
function ReviewPanel({ resumeText }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [open, setOpen]       = useState(false);

  async function load() {
    if (data) { setOpen(v => !v); return; }
    setLoading(true);
    try {
      const r = await reviewResume(resumeText);
      setData(r);
      setOpen(true);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const priorityColor = { high:'var(--red)', medium:'var(--amber)', low:'var(--text-3)' };

  return (
    <div className="card" style={{ marginTop:'2rem', overflow:'hidden' }}>
      <button
        onClick={load}
        disabled={loading}
        style={{
          width:'100%', padding:'1.125rem 1.375rem',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'none', border:'none', cursor:'pointer', fontFamily:'var(--sans)',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {loading
            ? <><div className="spinner spinner-dark" /><span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Analyzing resume…</span></>
            : <span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Resume review & feedback</span>
          }
        </div>
        {!loading && (
          data && open
            ? <ChevronUp size={14} color="var(--text-3)" />
            : <ChevronDown size={14} color="var(--text-3)" />
        )}
      </button>

      {error && (
        <div style={{ padding:'0 1.375rem 1rem', fontSize:13, color:'var(--red)' }}>{error}</div>
      )}

      {open && data && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'1.375rem' }}>
          {/* Score + verdict */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:'1.5rem' }}>
            <div style={{
              fontSize:28, fontWeight:700, fontFamily:'var(--mono)', flexShrink:0,
              color: data.overallScore >= 75 ? 'var(--green)' : data.overallScore >= 55 ? 'var(--amber)' : 'var(--red)',
            }}>
              {data.overallScore}<span style={{ fontSize:14, fontWeight:400, color:'var(--text-3)' }}>/100</span>
            </div>
            <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.65, paddingTop:4 }}>{data.verdict}</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:'1.5rem' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Strengths</div>
              {(data.strengths || []).map((s, i) => (
                <div key={i} style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6, marginBottom:6 }}>+ {s}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Skills to add</div>
              {(data.missingSkills || []).map((s, i) => (
                <div key={i} style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6, marginBottom:6 }}>→ {s}</div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Priority fixes</div>
            {(data.fixes || []).map((f, i) => (
              <div key={i} style={{
                padding:'10px 13px', borderRadius:8, marginBottom:8,
                background:'var(--bg-subtle)', border:'1px solid var(--border)',
                borderLeft:`3px solid ${priorityColor[f.priority] || 'var(--border-dark)'}`,
              }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{f.issue}</div>
                <div style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.55 }}>{f.fix}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Loading skeleton ── */
function Skeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {[1,2,3].map(i => (
        <div key={i} className="card" style={{ padding:'1.375rem', display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'var(--bg-subtle)', flexShrink:0,
            animation:'shimmer 1.5s ease infinite', animationDelay:`${i*0.15}s` }} />
          <div style={{ flex:1 }}>
            <div style={{ height:14, width:'55%', background:'var(--bg-subtle)', borderRadius:6, marginBottom:8,
              animation:'shimmer 1.5s ease infinite' }} />
            <div style={{ height:11, width:'35%', background:'var(--bg-subtle)', borderRadius:6,
              animation:'shimmer 1.5s ease infinite', animationDelay:'0.2s' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main ── */
export default function ResultsPage({ resumeText, onReset }) {
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    matchInternships(resumeText)
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* NAV */}
      <nav style={{
        padding:'1.125rem 2rem', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, background:'rgba(250,250,248,0.9)',
        backdropFilter:'blur(10px)', zIndex:100,
      }}>
        <span style={{ fontFamily:'var(--display)', fontSize:18, fontWeight:500, letterSpacing:'-0.02em' }}>
          InternMatch
        </span>
        <button className="btn btn-outline" onClick={onReset} style={{ fontSize:13, padding:'8px 14px' }}>
          <ArrowLeft size={13} /> New search
        </button>
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth:680, width:'100%', margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>

        {/* Header */}
        {!loading && !error && (
          <div className="fade-up" style={{ marginBottom:'1.75rem' }}>
            <div style={{ fontSize:12, color:'var(--text-3)', fontFamily:'var(--mono)', marginBottom:6 }}>
              {jobs.length} matches found
            </div>
            <h1 style={{
              fontFamily:'var(--display)', fontSize:28, fontWeight:500,
              letterSpacing:'-0.02em', lineHeight:1.2,
            }}>
              Your internship matches
            </h1>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div>
            <div style={{ marginBottom:'1.75rem' }}>
              <div style={{ fontSize:12, color:'var(--text-3)', fontFamily:'var(--mono)', marginBottom:6 }}>Analyzing resume…</div>
              <div style={{ height:32, width:280, background:'var(--bg-subtle)', borderRadius:8, animation:'shimmer 1.5s ease infinite' }} />
            </div>
            <Skeleton />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign:'center', padding:'4rem 1rem' }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Something went wrong</div>
            <div style={{ fontSize:13, color:'var(--text-2)', marginBottom:'1.5rem', maxWidth:380, margin:'0 auto 1.5rem' }}>{error}</div>
            <button className="btn btn-dark" onClick={onReset}>Try again</button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && (
          <>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {jobs.map((job, i) => (
                <MatchCard key={i} job={job} resumeText={resumeText} index={i} />
              ))}
            </div>
            <ReviewPanel resumeText={resumeText} />
          </>
        )}
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
