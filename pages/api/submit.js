// Serverless function — runs on Vercel automatically at /api/submit
//
// NOTE: This receives the form's TEXT fields only. The file inputs
// (Photo/Video) are NOT sent here, because they can't be JSON-encoded.
// To handle real uploads, switch the form to multipart/form-data and
// use a parser like `formidable`, or upload directly to storage such
// as Vercel Blob / S3 from the browser and send the resulting URLs here.

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { contact, issues, scheduling, pte } = req.body || {};

  if (!contact || !Array.isArray(issues) || !scheduling) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Basic required-field validation
  if (!contact.pets || !contact.movedIn) {
    return res.status(400).json({ error: "Please complete the pets/move-in questions" });
  }
  for (const [n, issue] of issues.entries()) {
    if (!issue.criteria || !issue.category || !issue.description ||
        !issue.severity || !issue.reported) {
      return res.status(400).json({ error: `Issue ${n + 1} is incomplete` });
    }
  }

  // Permission To Enter validation
  if (!pte || !pte.permission) {
    return res.status(400).json({ error: "Please answer the permission-to-enter question" });
  }
  if (pte.permission === "Yes") {
    if (!pte.acknowledged) {
      return res.status(400).json({ error: "Policy acknowledgment is required" });
    }
    if (!pte.accessType || !pte.code) {
      return res.status(400).json({ error: "Access type and code are required" });
    }
  } else if (pte.permission === "No") {
    for (const n of [1, 2, 3]) {
      if (!scheduling[`date${n}`] || !scheduling[`time${n}`]) {
        return res.status(400).json({ error: "Please provide all three preferred date/time slots" });
      }
    }
  }

  // At this point you would persist the request — e.g. write to a
  // database, send an email, or forward to a ticketing system.
  // For now we just log it server-side and echo a confirmation.
  console.log("New maintenance request:", JSON.stringify({ contact, issues, scheduling }, null, 2));

  return res.status(200).json({
    ok: true,
    receivedAt: new Date().toISOString(),
    issueCount: issues.length,
  });
}
