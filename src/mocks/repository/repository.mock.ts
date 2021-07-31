export class MockRepository<T> {
  public create(): void {}
  public async save(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(_params: any): Promise<T | void> {}
  public async find(): Promise<T[] | void> {}
  public async insert(): Promise<void> {}
  public async delete(): Promise<void> {}
  public async query(_queryString: string, _value?: any[]): Promise<any> {}
}
