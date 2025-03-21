"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function HomePage() {
  const [readmeContent, setReadmeContent] = useState<string>("");

  useEffect(() => {
    fetch("https://api.github.com/repos/liveworkinc/next-docker-k8s-sec-test/contents/README.md")
      .then((res) => res.json())
      .then((data) => {
        const content = atob(data.content); // base64
        setReadmeContent(content);
      })
      .catch((error) => console.error("Error fetching README:", error));
  }, []);

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {readmeContent}
      </ReactMarkdown>
    </div>
  );
}
