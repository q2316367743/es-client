export function extname(path: string): string {
  const items = path.split(".");
  if (items.length === 1) {
    return '';
  }
  return items[items.length - 1];
}

export function basename(path: string): string {
  const items = path.split("/");
  if (items.length > 1) {
    return items.pop()!;
  }
  return path
}

export function getFolder(path: string): string {
  const lastIndex = path.lastIndexOf("/");
  if (lastIndex === -1) {
    return '/';
  }
  return path.substring(0, lastIndex);
}

export function joinPath(folder: string, name: string): string {
  return `${folder}/${name}`;
}