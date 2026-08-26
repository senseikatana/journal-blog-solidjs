// Private documents shared on request.
//
// Each entry needs two things:
//   1. The PDF uploaded to your Vercel Blob store at `docs/{id}.pdf`:
//        vercel blob put docs/cv-full.pdf
//   2. An access code set as a Vercel env var named DOCS_TOKEN_{ID}
//      (dashes → underscores, uppercased). Share each code only with the
//      company or person you grant access to.

export interface PrivateDoc {
  id: string;
  label: string;
  desc: string;
}

export const privateDocs: PrivateDoc[] = [
  {
    id: "cv-full",
    label: "CV — full version",
    desc: "Complete CV including phone, address and references. Only shared with companies I have already talked to.",
  },
  {
    id: "portfolio-extended",
    label: "Portfolio — extended",
    desc: "Detailed write-ups of the projects in the archive, with architecture notes and metrics.",
  },
];
