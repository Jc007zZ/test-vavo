import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export default interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  total?: number;
  discountPercentage: number;
  thumbnail: string;
}