import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const COMPANIES = ['Google','Stripe','Airbnb','Meta','Figma','Notion','Vercel','Linear','Anthropic','Shopify'];

const STATS = [
  { n: '94%',   label: 'match accuracy' },
  { n: '6',     label: 'roles per search' },
  { n: '< 30s', label: 'to results' },
  { n: 'Free',  label: 'Gemini API' },
];

const HOW = [
  { icon: '01', title: 'Enter your free API key', body: 'Grab a free Gemini key from Google AI Studio — takes 2 minutes, no credit card.' },
  { icon: '02', title: 'Upload your resume',       body: 'PDF, DOCX, or TXT. We read every line — projects, skills, coursework, everything.' },
  { icon: '03', title: 'Get matched instantly',    body: '6 ranked internships with match scores, honest fit analysis, and apply links.' },
];

const FEATURES = [
  { icon: '🎯', title: 'Match scoring',     body: 'Every role gets a % match with an honest explanation of why you fit — and where you fall short.' },
  { icon: '✉️', title: 'Cover letter AI',   body: 'One click generates a personalized cover letter for any matched role. Not generic — specific to your resume.' },
  { icon: '📋', title: 'Resume review',     body: 'Get a brutal, honest critique of your resume with exact fixes to make before you apply.' },
  { icon: '💡', title: 'Interview tips',    body: 'Company-specific prep advice for each role — what they look for, how to answer, what to study.' },
  { icon: '🔍', title: 'Skill gap analysis',body: 'See exactly which skills to add to unlock better matches. Prioritized by market demand.' },
  { icon: '🔒', title: 'Private by design', body: 'Your resume never leaves your browser. Your API key is only in your session — never stored.' },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div style={{ flex: 1 }}>

      {/* NAV */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'1rem 2rem', borderBottom:'1px solid var(--border-subtle)',
        position:'sticky', top:0,
        background:'rgba(13,13,20,0.85)', backdropFilter:'blur(12px)', zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:28, height:28, borderRadius:8, background:'var(--purple)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Zap size={14} fill="#fff" color="#fff" />
          </div>
          <span style={{ fontWeight:700, fontSize:15, letterSpacing:'-0.03em' }}>InternMatch</span>
        </div>
        <button className="btn-primary" onClick={onGetStarted} style={{ padding:'8px 16px', fontSize:13 }}>
          Try free <ArrowRight size={13} />
        </button>
      </nav>

      {/* HERO */}
      <section style={{ padding:'6rem 2rem 4rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{
          position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)',
          width:700, height:350,
          background:'radial-gradient(ellipse, rgba(120,100,255,0.13) 0%, transparent 70%)',
          pointerEvents:'none',
        }} />

        <div className="fade-up" style={{ position:'relative', maxWidth:700, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.5rem' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'4px 12px', borderRadius:99,
              background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)',
              color:'#4ade80', fontSize:12, fontWeight:600,
            }}>
              ✦ Free with Google Gemini API
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(38px,6vw,68px)', fontWeight:700, lineHeight:1.08,
            letterSpacing:'-0.04em', marginBottom:'1.5rem',
          }}>
            Find your dream<br />
            <span style={{
              background:'linear-gradient(135deg, #7864ff 0%, #a394ff 50%, #c9b8ff 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              tech internship
            </span>
            <br />in 30 seconds.
          </h1>

          <p style={{
            fontSize:18, color:'var(--text-secondary)', lineHeight:1.75, marginBottom:'2.5rem',
            maxWidth:460, margin:'0 auto 2.5rem',
          }}>
            Upload your resume. AI reads every line and matches you to real internships at companies that actually want your skills.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem' }}>
            <button className="btn-primary" onClick={onGetStarted} style={{ padding:'14px 28px', fontSize:16 }}>
              Upload resume — it's free <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', maxWidth:500, margin:'0 auto' }}>
            {COMPANIES.map(c => (
              <span key={c} style={{
                fontSize:12, color:'var(--text-muted)', padding:'3px 10px',
                borderRadius:99, border:'1px solid var(--border-subtle)',
                background:'var(--bg-surface)',
              }}>{c}</span>
            ))}
          </div>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:10 }}>
            Matches roles at 1000s of real companies
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:'0 2rem 4rem', maxWidth:820, margin:'0 auto' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1,
          background:'var(--border-subtle)', border:'1px solid var(--border-subtle)',
          borderRadius:'var(--r-lg)', overflow:'hidden',
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding:'1.5rem 1rem', textAlign:'center', background:'var(--bg-surface)' }}>
              <div style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.03em', color:'var(--text-primary)', marginBottom:4 }}>{s.n}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'2rem 2rem 4rem', maxWidth:820, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--purple)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:12 }}>How it works</div>
          <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.03em' }}>Three steps to matched</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {HOW.map(step => (
            <div key={step.icon} className="card" style={{ padding:'1.5rem' }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--purple)', fontWeight:500, marginBottom:12 }}>{step.icon}</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:8, letterSpacing:'-0.02em' }}>{step.title}</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65 }}>{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'0 2rem 5rem', maxWidth:820, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--purple)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:12 }}>Features</div>
          <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.03em' }}>Everything you need</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding:'1.25rem', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:5, letterSpacing:'-0.02em' }}>{f.title}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'2rem 2rem 6rem', textAlign:'center' }}>
        <div style={{
          maxWidth:480, margin:'0 auto',
          background:'var(--bg-surface)', border:'1px solid var(--border-default)',
          borderRadius:'var(--r-xl)', padding:'3rem 2rem',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', inset:0,
            background:'radial-gradient(ellipse at 50% 0%, rgba(120,100,255,0.1) 0%, transparent 60%)',
            pointerEvents:'none',
          }} />
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:28, marginBottom:16 }}>🚀</div>
            <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.03em', marginBottom:12 }}>
              Ready to find your internship?
            </h2>
            <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'2rem' }}>
              You need a free Google Gemini API key. Get one at{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                style={{ color:'var(--purple-light)', textDecoration:'none' }}>
                aistudio.google.com
              </a>{' '}— takes 2 minutes, no credit card required.
            </p>
            <button className="btn-primary" onClick={onGetStarted} style={{ padding:'14px 28px', fontSize:15 }}>
              Get started now <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop:'1px solid var(--border-subtle)', padding:'1.5rem 2rem',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontSize:12, color:'var(--text-muted)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Zap size={12} color="var(--purple)" />
          <span style={{ fontWeight:600 }}>InternMatch</span>
        </div>
        <div>Powered by Gemini · Your data stays in your browser</div>
      </footer>
    </div>
  );
}
