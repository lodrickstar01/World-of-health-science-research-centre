export default function LiveStudyChartPage() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "auto" }}>
      <h1>Live Study Chart</h1>
      <p>Medical Research Centre — Study planning for medical students.</p>

      <section style={{ marginTop: "30px" }}>
        <h2>Today's Study Plan</h2>
        <ul>
          <li>Anatomy — Review and practise questions</li>
          <li>Physiology — Understand key mechanisms</li>
          <li>Biochemistry — Apply concepts to clinical examples</li>
          <li>Histology — Identify tissues and structures</li>
        </ul>
      </section>

      <p style={{ marginTop: "30px" }}>
        Stay consistent, study actively, and track your progress.
      </p>

      <a href="/" style={{ display: "inline-block", marginTop: "20px" }}>
        Return to Homess
      </a>
    </main>
  );
}
