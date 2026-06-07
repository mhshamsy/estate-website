// types.d.ts
declare module 'node:sqlite' {
  export class Database {
    constructor(path: string, options?: any);
    exec(sql: string): void;
    prepare(sql: string): any;
  }
}
