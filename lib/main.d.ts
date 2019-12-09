export interface Message {
  filename: string;
  line: string;
  column: string;
  type: string;
  subtype?: string;
  affectedSymbol?: string;
  text: string;
  codeWhitespace?: string;
  code?: string;

  adjustedColumn?: number;
  startIndex: number;
  endIndex: number;
  parentFunction?: string;
  firstDefined?: string;

  fromGcc(components: RegExpExecArray, stdout: string): Message;
  fromLinker(components: RegExpExecArray, stdout: string): Message;
}

export function parseString(stdout: string): Message[];
export function parseGcc(stdout: string): Message[];
export function parseLinker(stdout: string): Message[];
