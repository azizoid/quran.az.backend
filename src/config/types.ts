export type TAyah = {
  id: number,
  s: number,
  a: number,
  c: string,
  t: number
}

export type TQueryResult = {
  data: TAyah[];
  pagination?: any
}

export interface TAyahDetails extends TAyah {
  arabic: string;
  transliteration: string;
  juz: number;
  prev: number;
  next: number;
}

export interface IQuran {
  translator_id: number;
}

export interface ISoorah extends IQuran {
  soorah_id: number;
}

export interface IAyah extends IQuran {
  soorah_id: number;
  "q.aya_id": number;
}

export interface IRandom extends IQuran {
  content?: string
}