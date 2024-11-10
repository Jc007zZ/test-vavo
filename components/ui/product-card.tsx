import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { ReactNode } from "react";

import { useContext } from "react";

import GeneralContext from "@/context/GeneralContext";

interface ProductsCards {
  image: string;
  title: string;
  value: number;
  discountPercentage: number;
  stock: number;
  children: ReactNode;
}

export function ProductCard({
  image,
  title,
  value,
  discountPercentage,
  stock,
  children,
}: ProductsCards) {
  let validSrc: string = "";
  const isValidUrl = (image: string) => {
    try {
      new URL(image);

      return true;
    } catch {
      return false;
    }
  };

  if (isValidUrl(image)) {
    validSrc = image;
  }

  const { teste, setTeste }  = useContext(GeneralContext)
 
  return (
    <Card className="py-4 px-4 w-[20rem] h-[30rem] bg-black">
      <div className="flex justify-end px-4">{children}</div>
      <CardBody className="flex flex-col items-center gap-4 overflow-visible py-2">
        <div className="bg-white rounded-xl">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            height={200}
            src={validSrc}
            width={200}
          />
        </div>
        <div className="w-full h-full  flex flex-col items-start justify-between">
          <div>
            <h1 className="font-bold text-lg">{title}</h1>
            <p className="text-zinc-400 line-through">
              DE: <span>R$ {value}</span>
            </p>
            <div className="flex items-center">
              <p className=" mr-2 text-zinc-400">POR:</p>
              <span className="font-bold text-xl">
                R$ {(value - value * (discountPercentage / 100)).toFixed(2)}{" "}
              </span>
              <p className="bg-green-500 px-2 rounded-2xl ml-2">
                {" "}
                -{Math.ceil(discountPercentage)}%
              </p>
            </div>
            <h1 className="text-lg font-semibold">
              Produtos disponivel:{" "}
              <span className="text-zinc-300 font-medium">{stock}</span>
            </h1>
          </div>
          <div className="flex w-full justify-center">
            <Button onClick={() => setTeste('cole')} className="w-10/12 h-[2.5rem]">Comprar</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
