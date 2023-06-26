
/**
 * Split string in two substring (if the separator is matched)
 * @param text string to split
 * @param separator string to match as separator
 * @param trim default = true, trims the strings of the return array
 * @returns array of string: if separator string is not matched return original string (trimmed according to the flag)
 */
export function splitFirst(text: string, separator: string, trim = true): string[] {
  if (!text || !separator) return [''];
  let splitText = text.split(separator);
  if (trim) splitText = splitText.map(s => s.trim());
  return [splitText[0], splitText.slice(1).join()].filter(s => !!s);
}
