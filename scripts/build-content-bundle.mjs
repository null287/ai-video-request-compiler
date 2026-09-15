import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const generatedFiles = new Set([
  "SHA256SUMS",
  "content-manifest.json",
  "llms-full.txt",
]);
const excludedDirectories = new Set([".git", "node_modules"]);
const checkOnly = process.argv.includes("--check");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function normalizeText(text) {
  return text.replace(/\r\n?/g, "\n");
}

function lineCount(text) {
  if (text.length === 0) return 0;
  const newlineCount = (text.match(/\n/g) ?? []).length;
  return newlineCount + (text.endsWith("\n") ? 0 : 1);
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name, "en"));

  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolutePath)));
      continue;
    }
    if (!entry.isFile()) continue;

    const relativePath = path
      .relative(repositoryRoot, absolutePath)
      .split(path.sep)
      .join("/");
    if (!generatedFiles.has(relativePath)) files.push(relativePath);
  }
  return files;
}

function decodeUtf8(buffer, relativePath) {
  if (buffer.includes(0)) {
    throw new Error(`Binary content is not supported in the full-text bundle: ${relativePath}`);
  }

  const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  return normalizeText(text);
}

async function collectSourceFiles() {
  const paths = await walk(repositoryRoot);
  const files = [];

  for (const relativePath of paths) {
    const buffer = await fs.readFile(path.join(repositoryRoot, relativePath));
    const content = decodeUtf8(buffer, relativePath);
    const canonicalBytes = Buffer.from(content, "utf8");
    files.push({
      path: relativePath,
      sha256: sha256(canonicalBytes),
      bytes: canonicalBytes.length,
      lines: lineCount(content),
      content,
    });
  }
  return files;
}

function buildOutputs(files) {
  const manifestCore = {
    schema_version: 1,
    canonicalization: "UTF-8 text with CRLF and CR normalized to LF",
    source_file_count: files.length,
    files: files.map(({ path: filePath, sha256: hash, bytes, lines }) => ({
      path: filePath,
      sha256: hash,
      bytes,
      lines,
    })),
  };
  const manifestId = sha256(Buffer.from(JSON.stringify(manifestCore), "utf8"));
  const manifest = {
    ...manifestCore,
    manifest_id: manifestId,
    bundle: "llms-full.txt",
    checksum_file: "SHA256SUMS",
  };
  const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;

  const bundleParts = [
    "# AI Video Request Compiler — Full Repository Context\n",
    "This file contains every canonical public source file in the repository.\n",
    `REPOSITORY-CONTENT-BEGIN:${manifestId}\n`,
    `SOURCE-FILE-COUNT:${files.length}\n`,
    "\n## Content manifest\n\n",
    "```json\n",
    manifestText,
    "```\n",
  ];

  files.forEach((file, index) => {
    bundleParts.push(
      `\n## File ${index + 1}/${files.length}: ${file.path}\n\n`,
      `FILE-CONTENT-BEGIN:${file.path}:${file.sha256}\n`,
      file.content,
    );
    if (!file.content.endsWith("\n")) bundleParts.push("\n");
    bundleParts.push(`FILE-CONTENT-END:${file.path}:${file.sha256}\n`);
  });

  bundleParts.push(`\nREPOSITORY-CONTENT-END:${manifestId}\n`);
  const bundleText = bundleParts.join("");

  const checksums = [
    ...files.map(({ path: filePath, sha256: hash }) => ({ path: filePath, sha256: hash })),
    { path: "content-manifest.json", sha256: sha256(Buffer.from(manifestText, "utf8")) },
    { path: "llms-full.txt", sha256: sha256(Buffer.from(bundleText, "utf8")) },
  ]
    .sort((a, b) => a.path.localeCompare(b.path, "en"))
    .map((item) => `${item.sha256}  ${item.path}`)
    .join("\n");

  return {
    "SHA256SUMS": `${checksums}\n`,
    "content-manifest.json": manifestText,
    "llms-full.txt": bundleText,
  };
}

async function verifyOutputs(outputs) {
  let valid = true;
  for (const [relativePath, expected] of Object.entries(outputs)) {
    let actual;
    try {
      actual = normalizeText(await fs.readFile(path.join(repositoryRoot, relativePath), "utf8"));
    } catch {
      console.error(`Missing generated file: ${relativePath}`);
      valid = false;
      continue;
    }
    if (actual !== expected) {
      console.error(`Generated file is stale: ${relativePath}`);
      valid = false;
    }
  }
  if (!valid) process.exitCode = 1;
}

async function writeOutputs(outputs) {
  for (const [relativePath, content] of Object.entries(outputs)) {
    await fs.writeFile(path.join(repositoryRoot, relativePath), content, "utf8");
  }
}

const files = await collectSourceFiles();
const outputs = buildOutputs(files);

if (checkOnly) {
  await verifyOutputs(outputs);
} else {
  await writeOutputs(outputs);
  console.log(`Generated full repository context for ${files.length} source files.`);
}
