interface SnapOptions {
  isProduction?: boolean;
  serverKey?: string;
  clientKey?: string;
}

declare module "midtrans-client" {
  export class Snap {
    private apiConfig: ApiConfig;
    private httpClient: HttpClient;
    private transaction: Transaction;

    constructor(options?: SnapOptions);

    createTransaction(parameter?: any): Promise<any>;

    createTransactionToken(parameter?: any): Promise<string>;

    createTransactionRedirectUrl(parameter?: any): Promise<string>;
  }
}

