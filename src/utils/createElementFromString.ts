export default async function createElementFromString<T extends Element>(
  path: string,
): Promise<T> {
  const res = await fetch(path);
  const text = await res.text();
  const el = new DOMParser().parseFromString(text, "text/xml");

  return el.firstChild as T;
}
