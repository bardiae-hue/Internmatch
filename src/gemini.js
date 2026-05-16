// gemini.js — Free Gemini 1.5 Flash API integration
// Get your free key at: https://aistudio.google.com/app/apikey

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function callGemini(apiKey, prompt) {
  const res = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `API error ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

export async function validateKey(apiKey) {
  // Cheap validation call
  await callGemini(apiKey, 'Reply with only the word: valid');
}

export async function matchInternships(apiKey, resumeText) {
  const prompt = `You are an expert tech career advisor specializing in internship placement.

Analyze this resume and return EXACTLY 6 internship matches as a JSON array. No markdown, no explanation — only raw JSON.

Resume:
"""
${resumeText}
"""

Return this exact structure:
[
  {
    "company": "Company name",
    "role": "Exact role title",
    "matchScore": 87,
    "matchReasons": ["reason 1", "reason 2", "reason 3"],
    "gaps": ["gap 1"],
    "level": "Intern",
    "location": "City, State or Remote",
    "applyUrl": "https://careers.company.com",
    "tags": ["Python", "ML", "Remote"]
  }
]

Rules:
- matchScore is 0-100 (be honest, not generous)
- matchReasons: 2-3 specific reasons based on the resume
- gaps: 1-2 honest skill gaps for this role
- Pick realistic companies that would actually hire this profile
- Vary the match scores realistically (60-95 range)
- tags: 3-4 relevant skill/trait tags
- Return ONLY the JSON array, nothing else`;

  const raw = await callGemini(apiKey, prompt);
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateCoverLetter(apiKey, resumeText, job) {
  const prompt = `Write a concise, compelling cover letter (3 paragraphs, ~200 words) for:

Company: ${job.company}
Role: ${job.role}

Resume summary:
${resumeText.slice(0, 1500)}

Rules:
- Sound human, not AI-generated
- Reference specific skills from the resume that match this role
- Be direct and confident, not sycophantic
- No "I am writing to express my interest" openers
- End with a clear call to action
- Return only the cover letter text, no subject line`;

  return callGemini(apiKey, prompt);
}

export async function reviewResume(apiKey, resumeText) {
  const prompt = `You are a brutal, honest tech recruiter reviewing this resume for internship applications.

Resume:
"""
${resumeText}
"""

Return a JSON object with this exact structure (no markdown, raw JSON only):
{
  "overallScore": 72,
  "verdict": "One sentence honest verdict",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "fixes": [
    { "priority": "high", "issue": "Problem description", "fix": "Exact fix to make" },
    { "priority": "medium", "issue": "Problem description", "fix": "Exact fix to make" }
  ],
  "missingSkills": ["skill 1", "skill 2", "skill 3"]
}

Be brutally honest. Return ONLY the JSON object.`;

  const raw = await callGemini(apiKey, prompt);
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
