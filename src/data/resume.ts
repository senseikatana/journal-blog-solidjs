// Example resume data — replace with your real CV.
// Edit this single file to update /resume and /projects.

export interface ResumeJob {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  tech: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  period: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface ResumeProject {
  repo: string;
  owner: string;
  desc: string;
  stars: number;
  forks: number;
  tags: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  summary: string;
  contact: {
    email: string;
    github: string;
    website: string;
  };
  experience: ResumeJob[];
  education: ResumeEducation[];
  skills: SkillGroup[];
  languages: { name: string; level: string }[];
  projects: ResumeProject[];
}

export const resume: ResumeData = {
  name: "Sergio Jurado",
  title: "Backend Engineer — distributed systems & developer tooling",
  location: "Spain · remote-friendly",
  summary:
    "Backend engineer focused on distributed systems and developer tooling. I like boring infrastructure, fast feedback loops, and code that survives its first production incident.",
  contact: {
    email: "hello@sergiojurado.dev",
    github: "https://github.com/sergio-jurado",
    website: "https://sergiojurado.dev",
  },
  experience: [
    {
      role: "Senior Backend Engineer",
      company: "Acme Systems",
      period: "2022 — present",
      bullets: [
        "Designed and operated a multi-region event pipeline handling 40M messages/day.",
        "Cut p99 latency of the core API by 60% through query and cache rework.",
        "Owned on-call for the platform: wrote the runbooks and the postmortems.",
      ],
      tech: ["Go", "PostgreSQL", "Redis", "Kubernetes", "Kafka"],
    },
    {
      role: "Backend Engineer",
      company: "Northwind Labs",
      period: "2020 — 2022",
      bullets: [
        "Built billing and metering services from zero to production.",
        "Introduced contract testing and structured error handling across 12 services.",
      ],
      tech: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
    },
    {
      role: "Junior Developer",
      company: "Startup 404",
      period: "2018 — 2020",
      bullets: [
        "Shipped features for a SaaS dashboard used by 30k users.",
        "Learned that deleting code is a feature.",
      ],
      tech: ["JavaScript", "Vue", "MySQL"],
    },
  ],
  education: [
    {
      degree: "Ingeniería Informática",
      school: "Universidad Politécnica",
      period: "2014 — 2018",
    },
  ],
  skills: [
    {
      name: "Backend",
      items: ["Go", "Node.js", "TypeScript", "Python", "Rust"],
    },
    {
      name: "Data & infra",
      items: ["PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes", "Terraform"],
    },
    {
      name: "Observability",
      items: ["OpenTelemetry", "Grafana", "Loki", "Prometheus"],
    },
    {
      name: "Frontend & tooling",
      items: ["Astro", "React", "Tailwind", "GitHub Actions", "Bun"],
    },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "English", level: "C1" },
  ],
  projects: [
    {
      repo: "quartz",
      owner: "sergio-jurado",
      desc: "Embeddable Raft consensus library, ~2k LOC, zero deps.",
      stars: 2847,
      forks: 213,
      tags: ["go", "raft", "distributed-systems"],
    },
    {
      repo: "fjord",
      owner: "sergio-jurado",
      desc: "A streaming log structured storage engine, in pure Rust.",
      stars: 1532,
      forks: 98,
      tags: ["rust", "storage", "lsm-tree"],
    },
    {
      repo: "tokenbucket",
      owner: "sergio-jurado",
      desc: "Per-key rate limiter for Go services. No dependencies, 200 lines.",
      stars: 412,
      forks: 41,
      tags: ["go", "ratelimit"],
    },
    {
      repo: "journal-blog",
      owner: "sergio-jurado",
      desc: "This site. SolidStart, SSR, zero client-side frameworks on the server.",
      stars: 128,
      forks: 12,
      tags: ["solidjs", "typescript", "blog"],
    },
    {
      repo: "raftviz",
      owner: "sergio-jurado",
      desc: "Interactive Raft consensus visualizer in Go + WASM. Watch elections fail in real time.",
      stars: 89,
      forks: 7,
      tags: ["go", "wasm", "raft"],
    },
    {
      repo: "lumbermill",
      owner: "sergio-jurado",
      desc: "Structured logging library for Go with zero allocations on the hot path.",
      stars: 156,
      forks: 11,
      tags: ["go", "logging", "zero-deps"],
    },
    {
      repo: "snapshot",
      owner: "sergio-jurado",
      desc: "Point-in-time Postgres snapshots for local development. A stubborn amount of shell.",
      stars: 64,
      forks: 5,
      tags: ["postgres", "shell", "devtools"],
    },
  ],
};
