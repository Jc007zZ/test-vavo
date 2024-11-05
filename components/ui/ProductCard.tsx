import { Card, CardHeader, CardBody } from "@nextui-org/card";
import Image from 'next/image'

interface ProductCard {
  title: string;
  image: string;
  value: number;
  teste: number,
  stock: number,
  discountPercentage: number
}

export function ProductCard({title, image, value, teste, stock, discountPercentage }:ProductCard){
   



    return (
    <Card className="py-4 w-[20rem] h-[25rem] bg-black">
          <CardBody className="flex flex-col items-center gap-4 overflow-visible py-2">
            <div className="bg-white rounded-xl">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={image}
                width={200}
                height={0}
              />
            </div>
            <div>
              <h1 className="font-bold text-lg">{title}</h1>
              <p className="text-zinc-400 line-through">DE: <span>R$ {value}</span></p>
              <div className="flex items-center">
                  <p className=" mr-2 text-zinc-400">POR:</p>
                  <span className="font-bold text-xl">R$ {(value - (value * (discountPercentage/100))).toFixed(2)} </span>
                  <p className="bg-green-500 px-2 rounded-2xl ml-2"> -{Math.ceil(discountPercentage)}%</p>
              </div>
              <h1 className="text-lg font-semibold">Produtos disponivel: <span className="text-zinc-300 font-medium">{stock}</span></h1>
              {/* <h1>{teste}</h1> */}
            </div>
          </CardBody>
      </Card>
      )
}