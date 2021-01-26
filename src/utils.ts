import { readFile } from 'fs-extra';

export const read = async (
  filePath: string,
  encoding?:
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'latin1'
    | 'binary'
    | 'hex'
    | undefined
): Promise<string> => (await readFile(filePath)).toString(encoding);
