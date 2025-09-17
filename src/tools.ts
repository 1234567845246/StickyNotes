import { NoteColorType, NOTE_COLORS } from './type';
export function mergeObjects<A extends object, B extends object>(a: A, b: B): A & B {
  const result = { ...b };
  Object.assign(result, a);
  return result as A & B;
}

export function formatTime(timestamp: string) {
  return new Date(timestamp).toISOString();
}

export function insertChar(str: string, index: number, char: string) {
  return str.substring(0, index) + char + str.substring(index);
}



export function getRandomColor(): NoteColorType {
  const colors = Object.keys(NOTE_COLORS) as NoteColorType[];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getNoteColor(colorType: NoteColorType, isDark: boolean): string {
  return NOTE_COLORS[colorType][isDark ? 'dark' : 'light'];
}