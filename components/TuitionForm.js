"use client";
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import { SUBJECTS, CLASS_LEVELS, MODES } from "@/lib/constants";

const empty = { title: "", subject: "", classLevel: "", mode: "", location: "", monthlyFee: "", daysPerWeek: "", bannerImage: "", description: "" };

function validate(f) {
  const e = {};
  if (f.title.trim().length < 5) e.title = "Title must be at least 5 characters";
  if (!f.subject) e.subject = "Select a subject";
  if (!f.classLevel) e.classLevel = "Select a class level";
  if (!f.mode) e.mode = "Select a mode";
  if (!f.location.trim()) e.location = "Location is required";
  if (!(Number(f.monthlyFee) > 0)) e.monthlyFee = "Enter a fee greater than 0";
  if (!(Number(f.daysPerWeek) >= 1 && Number(f.daysPerWeek) <= 7)) e.daysPerWeek = "Enter 1 to 7 days";
  if (!f.bannerImage) e.bannerImage = "Upload a banner image";
  if (f.description.trim().length < 20) e.description = "Description must be at least 20 characters";
  return e;
}

export default function TuitionForm({ initial, onSubmit, submitting, submitLabel = "Submit for approval" }) {
  const [f, setF] = useState({ ...empty, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target ? e.target.value : e });
  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-xs text-error">{errors[k]}</p> : null);

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...f, monthlyFee: Number(f.monthlyFee), daysPerWeek: Number(f.daysPerWeek) });
  };

  return (
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2" noValidate>
      <div className="md:col-span-2">
        <label className="label font-semibold">Title</label>
        <input className="input-base" value={f.title} onChange={set("title")} placeholder="e.g. HSC Higher Math Batch" />
        <Err k="title" />
      </div>
      <div>
        <label className="label font-semibold">Subject</label>
        <select className="select-base" value={f.subject} onChange={set("subject")}>
          <option value="">Select subject</option>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Err k="subject" />
      </div>
      <div>
        <label className="label font-semibold">Class level</label>
        <select className="select-base" value={f.classLevel} onChange={set("classLevel")}>
          <option value="">Select class level</option>
          {CLASS_LEVELS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Err k="classLevel" />
      </div>
      <div>
        <label className="label font-semibold">Mode</label>
        <select className="select-base" value={f.mode} onChange={set("mode")}>
          <option value="">Select mode</option>
          {MODES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Err k="mode" />
      </div>
      <div>
        <label className="label font-semibold">Location</label>
        <input className="input-base" value={f.location} onChange={set("location")} placeholder="Dhanmondi, Dhaka or Google Meet" />
        <Err k="location" />
      </div>
      <div>
        <label className="label font-semibold">Monthly fee (৳)</label>
        <input type="number" min="1" className="input-base" value={f.monthlyFee} onChange={set("monthlyFee")} placeholder="3500" />
        <Err k="monthlyFee" />
      </div>
      <div>
        <label className="label font-semibold">Days per week</label>
        <input type="number" min="1" max="7" className="input-base" value={f.daysPerWeek} onChange={set("daysPerWeek")} placeholder="3" />
        <Err k="daysPerWeek" />
      </div>
      <div className="md:col-span-2">
        <label className="label font-semibold">Banner image</label>
        <ImageUpload value={f.bannerImage} onChange={set("bannerImage")} label="Upload banner" hint="Wide images work best (16:9). Uploaded to ImgBB." />
        <Err k="bannerImage" />
      </div>
      <div className="md:col-span-2">
        <label className="label font-semibold">Description</label>
        <textarea rows={5} className="textarea textarea-bordered w-full bg-base-100" value={f.description} onChange={set("description")} placeholder="What will students learn? How are the classes run?" />
        <Err k="description" />
      </div>
      <div className="md:col-span-2">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting && <span className="loading loading-spinner loading-sm" />} {submitLabel}
        </button>
      </div>
    </form>
  );
}
