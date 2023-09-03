export interface IRepository<T> {
  create(body: P): Promise<T | null>;
  findBy(att: string, value: any): Promise<T | null>;
  list(): Promise<T[] | any[]>;
  update(id: string, payload: Partial<T>): Promise<T>;
}