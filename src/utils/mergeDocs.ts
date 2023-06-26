import { StringEngine, Merge } from "@asmartbear/diff-merge";

export default function mergeDocs(doc1: string, doc2: string): string {
  const original = doc1;
  const eng = new StringEngine();
  const toDoc1 = eng.getEditsByCharacter(original, doc1);
  const toDoc2 = eng.getEditsByCharacter(original, doc2);
  const merge = new Merge<string>();
  const result = merge.merge3(toDoc1, toDoc2);
  return result.join("");
}
