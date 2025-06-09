import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const GITHUB_USER = "Mrutunjaya-Official";
const GITHUB_REPO = "notes-site";
const GITHUB_BRANCH = "main";
const NOTES_DIR = "notes";

function App() {
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${NOTES_DIR}?ref=${GITHUB_BRANCH}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFiles(data.filter((f) => f.name.endsWith(".md")));
        }
      });
  }, []);

  const fetchNote = async (path) => {
    setLoading(true);
    setContent("");
    const res = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`
    );
    setContent(await res.text());
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{
        width: 250,
        background: "#eee",
        padding: 20,
        borderRight: "1px solid #ccc",
      }}>
        <h2>Notes</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map((file) => (
            <li key={file.name}>
              <button
                style={{ width: "100%", textAlign: "left", margin: "5px 0" }}
                onClick={() => fetchNote(`${NOTES_DIR}/${file.name}`)}
              >
                {file.name.replace(".md", "")}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: "auto" }}>
        {loading ? <p>Loading...</p> : <ReactMarkdown>{content}</ReactMarkdown>}
        {!content && <p>Select a note.</p>}
      </main>
    </div>
  );
}

export default App;
