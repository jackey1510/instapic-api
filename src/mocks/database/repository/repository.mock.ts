export class MockRepository<T> {
  public create(): void {}
  public async save(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(): Promise<T | void> {}
  public async find(): Promise<T[] | void> {}
  public async insert(): Promise<void> {}
}
