import { useState } from "react";
import Head from "next/head";

const CRITERIA = [
  "No heat / no AC (extreme weather)",
  "No running water",
  "Major water leak / flooding",
  "Electrical hazard",
  "Gas smell",
  "Lockout / security issue",
  "None of the above",
];
const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Other",
];
const SEVERITIES = ["Emergency", "Urgent", "Routine", "Low"];
const TIMES = ["8:00 AM - 12:00 PM", "12:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];

const PTE_TERMS = [
  "Unsupervised Minors: I will not leave minor children (under 18) unsupervised in the home during the planned maintenance visit.",
  "Security Systems: I will disarm all alarms. I accept responsibility for any false alarm fees.",
  "Pet Management: All pets will be secured in a crate or separate room prior to entry.",
  "Workspace Access: I will ensure the area surrounding the repair (e.g., under sinks, HVAC closets) is clear of personal items to prevent damage or delays.",
  "Documentation: I authorize maintenance to take photographs of the repair area for documentation purposes.",
  "Personal Property: I understand that management is not liable for damage to personal property left in the immediate work area.",
  "Entry Notice: I request that a Notice of Entry be left in a conspicuous place upon completion, noting the time of exit.",
  "Visitation Time: I understand that the maintenance visit will occur between the hours of 8:00am and 6:00pm.",
  "Entry: I have provided a valid key lockbox code / one time use smart lock code.",
];

function blankIssue() {
  return {
    criteria: "",
    category: "",
    description: "",
    severity: "",
    reported: "",
  };
}

export default function Home() {
  const [contact, setContact] = useState({
    firstName: "Rob",
    lastName: "Meagher",
    email: "rob.meagher@maymonthomes.com",
    phone: "7208833730",
    address: "1505 King Street Ext, North Charleston, South Carolina 29405",
    altName: "",
    altPhone: "",
    altEmail: "",
    pets: "",
    movedIn: "",
  });
  const [issues, setIssues] = useState([blankIssue()]);
  const [scheduling, setScheduling] = useState({
    date1: "", time1: "",
    date2: "", time2: "",
    date3: "", time3: "",
  });

  // Permission To Enter state
  const [pte, setPte] = useState({
    permission: "",       // "" | "Yes" | "No"
    acknowledged: false,  // policy checkbox
    accessType: "",       // Smart Home | Key Lockbox
    code: "",             // numeric code
  });
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const setC = (k) => (e) => setContact({ ...contact, [k]: e.target.value });
  const setS = (k) => (e) => setScheduling({ ...scheduling, [k]: e.target.value });
  const setIssue = (i, k) => (e) => {
    const next = [...issues];
    next[i] = { ...next[i], [k]: e.target.value };
    setIssues(next);
  };
  const addIssue = () => setIssues([...issues, blankIssue()]);

  function handlePermissionChange(e) {
    const val = e.target.value;
    setPte({ ...pte, permission: val });
    if (val === "Yes") {
      setScrolledToBottom(false);
      setShowPolicyModal(true);
    }
  }

  function handleModalScroll(e) {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 8) {
      setScrolledToBottom(true);
    }
  }

  function closePolicyModal() {
    setShowPolicyModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, issues, scheduling, pte }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus({ ok: true, msg: "Request submitted successfully." });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  const showScheduling = pte.permission === "No";
  const pteComplete =
    pte.permission === "Yes" &&
    pte.acknowledged &&
    pte.accessType !== "" &&
    pte.code !== "";

  return (
    <>
      <Head>
        <title>New Maintenance Request</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="page">
        <div className="modal">
          <div className="modal-header">
            <h1>New Maintenance Request</h1>
            <button type="button" className="close-btn" title="Close">&times;</button>
          </div>

          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="row">
              <div>
                <label>First Name</label>
                <input type="text" value={contact.firstName} onChange={setC("firstName")} />
              </div>
              <div>
                <label>Last Name</label>
                <input type="text" value={contact.lastName} onChange={setC("lastName")} />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Email</label>
                <input type="email" value={contact.email} onChange={setC("email")} />
              </div>
              <div>
                <label>Phone</label>
                <input type="tel" value={contact.phone} onChange={setC("phone")} />
              </div>
            </div>

            <div className="field">
              <label>Address</label>
              <input type="text" value={contact.address} onChange={setC("address")} />
            </div>

            <div className="alt-contact-title">Alternate Contact (optional)</div>
            <div className="row-3">
              <div>
                <label>Name</label>
                <input type="text" value={contact.altName} onChange={setC("altName")} />
              </div>
              <div>
                <label>Phone</label>
                <input type="tel" value={contact.altPhone} onChange={setC("altPhone")} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={contact.altEmail} onChange={setC("altEmail")} />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Are pets present? <span className="req">*</span></label>
                <select value={contact.pets} onChange={setC("pets")} required>
                  <option value="" disabled>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label>Did you move in less than 28 days ago? <span className="req">*</span></label>
                <select value={contact.movedIn} onChange={setC("movedIn")} required>
                  <option value="" disabled>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>

            <h2 className="section">Maintenance Issues</h2>
            {issues.map((issue, i) => (
              <div className="issue-card" key={i}>
                <h3>Issue {i + 1}</h3>
                <div className="field">
                  <label>Does this issue meet any of the following criteria? <span className="req">*</span></label>
                  <select value={issue.criteria} onChange={setIssue(i, "criteria")} required>
                    <option value="" disabled>Select</option>
                    {CRITERIA.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Issue Category <span className="req">*</span></label>
                  <select value={issue.category} onChange={setIssue(i, "category")} required>
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Description <span className="req">*</span></label>
                  <textarea value={issue.description} onChange={setIssue(i, "description")} required />
                </div>
                <div className="field">
                  <label>Severity <span className="req">*</span></label>
                  <select value={issue.severity} onChange={setIssue(i, "severity")} required>
                    <option value="" disabled>Select</option>
                    {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Has this issue been reported in the last 14 days? <span className="req">*</span></label>
                  <select value={issue.reported} onChange={setIssue(i, "reported")} required>
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div className="field">
                  <label>Photo/Video 1 <span className="req">*</span></label>
                  <input type="file" accept="image/*,video/*" required />
                </div>
                <div className="field">
                  <label>Photo/Video 2 (optional)</label>
                  <input type="file" accept="image/*,video/*" />
                </div>
                <div className="field">
                  <label>Photo/Video 3 (optional)</label>
                  <input type="file" accept="image/*,video/*" />
                </div>
              </div>
            ))}

            <button type="button" className="btn-secondary" onClick={addIssue}>
              Add Another Issue
            </button>

            {/* Permission to Enter question */}
            <div className="field" style={{ maxWidth: 430 }}>
              <label>Permission to Enter in Your Absence? <span className="req">*</span></label>
              <select value={pte.permission} onChange={handlePermissionChange} required>
                <option value="" disabled>Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            {/* PTE = Yes: read-only confirmation once the modal is completed */}
            {pte.permission === "Yes" && (
              <div className="pte-block">
                {pteComplete ? (
                  <div className="pte-summary">
                    <span className="pte-check">&#10003;</span>
                    <div>
                      <div className="pte-summary-title">
                        Permission to Enter Acknowledged
                      </div>
                      <div className="pte-summary-detail">
                        {pte.accessType} &middot; Code {pte.code}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setShowPolicyModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="pte-prompt">
                    <span>You must review and acknowledge the entry policy.</span>
                    <button
                      type="button"
                      className="btn-secondary pte-open-btn"
                      onClick={() => setShowPolicyModal(true)}
                    >
                      Review Entry Policy
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PTE = No: Preferred Scheduling */}
            {showScheduling && (
              <div className="scheduling">
                <h2 className="section">Preferred Scheduling</h2>
                <p className="intro">
                  Please select three different preferred times and days within the
                  normal business week, Monday through Friday, to assist us in
                  scheduling your work order. Thank you.
                </p>

                {[1, 2, 3].map((n) => {
                  const ord = n === 1 ? "1st" : n === 2 ? "2nd" : "3rd";
                  return (
                    <div className="row" key={n}>
                      <div>
                        <label>{ord} Preferred Date <span className="req">*</span></label>
                        <input
                          type="date"
                          value={scheduling[`date${n}`]}
                          onChange={setS(`date${n}`)}
                          required
                        />
                      </div>
                      <div>
                        <label>{ord} Preferred Time <span className="req">*</span></label>
                        <select
                          value={scheduling[`time${n}`]}
                          onChange={setS(`time${n}`)}
                          required
                        >
                          <option value="" disabled>Select</option>
                          {TIMES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Submit shows once a path is chosen */}
            {pte.permission !== "" && (
              <>
                <div className="submit-wrap">
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting || (pte.permission === "Yes" && !pteComplete)}
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
                {status && (
                  <div className={`status-msg ${status.ok ? "ok" : "err"}`}>
                    {status.msg}
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>

      {/* Policy modal */}
      {showPolicyModal && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="policy-modal">
            <div className="policy-header">
              <h2>Permission to Enter (PTE) &amp; Maintenance Acknowledgement</h2>
            </div>
            <div className="policy-scroll" onScroll={handleModalScroll}>
              <p className="policy-addr">
                <strong>Property Address:</strong> {contact.address}
              </p>
              <p>
                I grant Maymont Homes and their authorized technicians and or
                third-party vendors permission to enter my residence for
                maintenance purposes.
              </p>
              <p><strong>Maymont Homes Terms and Conditions:</strong></p>
              <ul className="policy-list">
                {PTE_TERMS.map((t, i) => {
                  const idx = t.indexOf(":");
                  const head = t.slice(0, idx);
                  const rest = t.slice(idx + 1);
                  return (
                    <li key={i}><strong>{head}:</strong>{rest}</li>
                  );
                })}
              </ul>
              <p className="policy-foot">
                By checking the &ldquo;Policy Acknowledgement&rdquo; checkbox, I
                acknowledge and agree to all of the terms and conditions above.
              </p>
            </div>
            <div className="policy-actions">
              {!scrolledToBottom && (
                <span className="scroll-hint">Scroll to the bottom to continue</span>
              )}
              <label className="ack-line modal-ack">
                <input
                  type="checkbox"
                  checked={pte.acknowledged}
                  disabled={!scrolledToBottom}
                  onChange={(e) => setPte({ ...pte, acknowledged: e.target.checked })}
                />
                <span>Policy Acknowledgment <span className="req">*</span></span>
              </label>

              {pte.acknowledged && (
                <div className="modal-access-fields">
                  <div className="field">
                    <label>Smart Home or Key Lockbox? <span className="req">*</span></label>
                    <select
                      value={pte.accessType}
                      onChange={(e) => setPte({ ...pte, accessType: e.target.value, code: "" })}
                      required
                    >
                      <option value="" disabled>Select</option>
                      <option>Smart Home</option>
                      <option>Key Lockbox</option>
                    </select>
                  </div>
                  {pte.accessType !== "" && (
                    <div className="field">
                      <label>
                        {pte.accessType === "Smart Home" ? "Smart Home Code" : "Lockbox Code"}{" "}
                        <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pte.code}
                        onChange={(e) =>
                          setPte({ ...pte, code: e.target.value.replace(/[^0-9]/g, "") })
                        }
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                className="btn-submit"
                disabled={!pteComplete}
                onClick={closePolicyModal}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
