// To parse this data:
//
//   import { Convert, Product } from "./file";
//
//   const product = Convert.toProduct(json);

export interface IProduct {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  price: number;
  image: string;
  flavors: IFlavor[];
  toppings: ITopping[];
}

export interface IFlavor {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  name: string;
  price?: number;
}

export interface ITopping {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  price: number;
  productId: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toProduct(json: string): IProduct {
    return JSON.parse(json);
  }

  public static productToJson(value: IProduct): string {
    return JSON.stringify(value);
  }
}

