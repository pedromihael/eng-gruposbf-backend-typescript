export interface IRepository<T> {
  create(body: P): Promise<T | null>;
  // findBy(att: Partial<T>): Promise<T | null>;
  list(): Promise<T[] | any[]>;
  // update(code: string, payload: Partial<T>): Promise<T>;
}