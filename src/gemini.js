// gemini.js — Gemini 1.5 Flash API
const API_KEY = 'AIzaSyCQXxSMOOk-S4NokYOnbsTXA4kCi5wgRGw';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function call(prompt) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

function parseJSON(raw) {
  const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
  // Find the first [ or { and last ] or }
  const start = cleaned.search(/[{[]/);
  const lastBracket = cleaned.lastIndexOf(']');
  const lastBrace = cleaned.lastIndexOf('}');
  const end = Math.max(lastBracket, lastBrace);
  if (start === -1 || end === -1) throw new Error('No JSON found in response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function matchInternships(resumeText) {
  const prompt = `You are an expert tech career advisor. Analyze this resume and return EXACTLY 6 internship matches.

Resume:
"""
${resumeText}
"""

Return ONLY a raw JSON array (no markdown, no explanation):
[
  {
    "company": "Company Name",
    "role": "Exact Role Title",
    "matchScore": 85,
    "location": "City, ST or Remote",
    "applyUrl": "https://careers.company.com/jobs",
    "matchReasons": ["Specific reason 1 based on resume", "Specific reason 2"],
    "gaps": ["One honest gap"],
    "tags": ["Skill1", "Skill2", "Skill3"]
  }
]

Rules:
- matchScore 55–95, be honest not generous, vary them realistically
- Pick real companies whose tech stack matches the resume skills
- applyUrl must be a real careers page URL for that company
- matchReasons must reference actual skills/projects from the resume
- tags: 3 relevant skills from the resume
- Return ONLY the JSON array`;

  const raw = await call(prompt);
  return parseJSON(raw);
}

export async function generateCoverLetter(resumeText, job) {
  const prompt = `Write a cover letter for this internship application.

Company: ${job.company}
Role: ${job.role}
Resume excerpt:
${resumeText.slice(0, 2000)}

Write 3 tight paragraphs (~180 words total). Rules:
- Open with a hook, not "I am writing to express"
- Reference 2 specific skills/projects from the resume
- Sound like a confident student, not a template
- End with one clear sentence requesting an interview
- Return only the letter text, no subject line, no date`;

  return call(prompt);
}

export async function reviewResume(resumeText) {
  const prompt = `You are a senior tech recruiter. Review this resume for internship applications.

Resume:
"""
${resumeText}
"""

Return ONLY a raw JSON object:
{
  "overallScore": 74,
  "verdict": "One honest sentence summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "fixes": [
    { "priority": "high", "issue": "The problem", "fix": "Exactly what to change" },
    { "priority": "medium", "issue": "The problem", "fix": "Exactly what to change" },
    { "priority": "low", "issue": "The problem", "fix": "Exactly what to change" }
  ],
  "missingSkills": ["skill 1", "skill 2", "skill 3"]
}`;

  const raw = await call(prompt);
  return parseJSON(raw);
}
