/**
 * 前端工程化数据处理流程类
 */
type DataSource<T> = string | (() => Promise<T>) | { process: T };

class DataProcessor<T = any> {
  private rawData: any;
  private processedData: T | null = null;
  private cacheKey: string | null = null;
  private validators: Array<(data: any) => boolean> = [];
  private transformers: Array<(data: any) => any> = [];
  private errorHandlers: Array<(error: Error) => void> = [];
  private cacheProvider: ((key: string, data: any) => void) | null = null;
  private cacheRetriever: ((key: string) => any) | null = null;

  constructor(private dataSource: DataSource<T>) {}

  /**
   * 添加数据验证器
   */
  addValidator(validator: (data: any) => boolean): this {
    this.validators.push(validator);
    return this;
  }

  /**
   * 添加数据转换器
   */
  addTransformer(transformer: (data: any) => any): this {
    this.transformers.push(transformer);
    return this;
  }

  /**
   * 添加错误处理器
   */
  addErrorHandler(handler: (error: Error) => void): this {
    this.errorHandlers.push(handler);
    return this;
  }

  /**
   * 设置缓存提供者和检索器
   */
  setCacheHandlers(
    provider: (key: string, data: any) => void,
    retriever: (key: string) => any,
    key: string,
  ): this {
    this.cacheProvider = provider;
    this.cacheRetriever = retriever;
    this.cacheKey = key;
    return this;
  }

  /**
   * 执行完整数据处理流程
   */
  async process(): Promise<T | null> {
    try {
      // 1. 尝试从缓存获取数据
      if (this.cacheKey && this.cacheRetriever) {
        const cachedData = this.cacheRetriever(this.cacheKey);
        if (cachedData) {
          this.processedData = cachedData;
          return this.processedData;
        }
      }

      // 2. 获取原始数据
      this.rawData = await this.fetchData();

      // 3. 验证数据
      if (!this.validateData()) {
        throw new Error("数据验证失败");
      }

      // 4. 转换数据
      this.processedData = this.transformData();

      // 5. 缓存处理后的数据
      if (this.cacheKey && this.cacheProvider) {
        this.cacheProvider(this.cacheKey, this.processedData);
      }

      return this.processedData;
    } catch (error) {
      this.handleError(error as Error);
      return null;
    }
  }

  private async fetchData(): Promise<any> {
    if (typeof this.dataSource === "string") {
      // 处理URL请求
      const response = await fetch(this.dataSource);
      return await response.json();
    } else if (this.dataSource instanceof Function) {
      // 处理异步函数
      return await this.dataSource();
    } else {
      // 直接返回数据对象
      return this.dataSource.data;
    }
  }

  private validateData(): boolean {
    return this.validators.every((validator) => validator(this.rawData));
  }

  private transformData(): T {
    return this.transformers.reduce(
      (data, transformer) => transformer(data),
      this.rawData,
    ) as T;
  }

  private handleError(error: Error): void {
    this.errorHandlers.forEach((handler) => handler(error));
  }
}

export default DataProcessor;
