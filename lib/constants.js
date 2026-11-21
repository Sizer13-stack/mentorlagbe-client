export const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Programming", "IELTS", "Accounting", "ICT", "Bangla"];
export const CLASS_LEVELS = ["Class 6-8", "SSC (9-10)", "HSC (11-12)", "Undergraduate", "Professional"];
export const MODES = ["Online", "Offline"];
export const taka = (n) => `৳${Number(n || 0).toLocaleString("en-US")}`;
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-");
