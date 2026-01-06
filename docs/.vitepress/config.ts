import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: "en-US",
  title: "True Orchestration AI",

  themeConfig: {
    // nav: [
    //   { text: 'Definition', link: '/definition' },

    //   {
    //     text: 'Specification',
    //     items: [
    //       { text: 'Base Protocol', link: '/item-1' },
    //       { text: 'Architecture', link: '/item-3' },
    //       { text: 'Schema Reference', link: '/item-2' },
    //       { text: 'Envelope Type Reference', link: '/item-3' },
    //     ],
    //   },
    // ],

    sidebar: [
      {
        // text: 'Guide',
        items: [
          {
            text:"True Orchestration AI System Definition",
            link: "/definition",
          },
          {
            text: "Criterion Definition",
            collapsed: false,
            items: [
              { text: "Framework Overview", link: "/definition/overview" },
              {
                text: "Orchestration Fabric",
                collapsed: false,
                items: [
                  {
                    text: "Criterion 0 — Control-Plane (Orchestration Capability)",
                    link: "/definition/c0",
                  },
                ],
              },
              {
                text: "I. Governance & Oversight",
                collapsed: false,
                items: [
                  {
                    text: "Criterion 1 — Human Governance",
                    link: "/definition/c1",
                  },
                  {
                    text: "Criterion 2 — Policy-Enforced Operation",
                    link: "/definition/c2",
                  },
                  {
                    text: "Criterion 3 — Interoperable Modularity",
                    link: "/definition/c3",
                  },
                ],
              },
              {
                text: "II. Knowledge, Reasoning & Collaboration",
                collapsed: false,
                items: [
                  {
                    text: "Criterion 4 — Semantic Communication Integrity",
                    link: "/definition/c4",
                  },
                  {
                    text: "Criterion 5 — Symbolic-Subsymbolic Integration",
                    link: "/definition/c5",
                  },
                  {
                    text: "Criterion 6 — Epistemic Prudence",
                    link: "/definition/c6",
                  },
                  {
                    text: "Criterion 7 — Incremental Knowledge Evolution",
                    link: "/definition/c7",
                  },
                ],
              },
              {
                text: "III. Provenance, Transparency & Risk",
                collapsed: false,
                items: [
                  {
                    text: "Criterion 8 — Transparency & Explainability",
                    link: "/definition/c8",
                  },
                  {
                    text: "Criterion 9 — Immutable Provenance",
                    link: "/definition/c9",
                  },
                  {
                    text: "Criterion 10 — Lifecycle Accountability",
                    link: "/definition/c10",
                  },
                ],
              },
            ],
          },
          {
            text: "Specification",
            collapsed: false,
            items: [
              {
                text: "Base Protocol",
                collapsed: false,
                items: [{ text: "Overview", link: "/base/overview" }],
              },
              { text: "Architecture", link: "/architecture" },
              {
                text: "Schema Reference",
                collapsed: false,
                items: [
                  { text: "Common Type", link: "/schema/commonType" },
                  { text: "Governance", link: "/schema/governance" },
                  { text: "Provenance", link: "/schema/provenance" },
                  {
                    text: "Lifecycle and Knowledge Management",
                    link: "/schema/lifecycle",
                  },
                  {
                    text: "Control Plane and Explanation",
                    link: "/schema/controlPlane",
                  },
                  { text: "Execution", link: "/schema/execution" },
                  { text: "SIA", link: "/schema/sia" },
                ],
              },
              { text: "Envelope Type Reference", link: "/envelope" },
            ],
          },
        ],
      },
    ],
  },
});
