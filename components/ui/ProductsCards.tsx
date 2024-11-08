
import Image from 'next/image'
import { ProductCard } from './product-card'

interface ProductsCards {

}


interface ProductsCards {
  image: string,
  title: string,
  value: number,
  discountPercentage: number,
  stock: number
}

export function ProductsCards({ content }: any){
    console.log(content)

    return (

      <div>
        {content.map((product) =>{
          <ProductCard
          image={product.thumbnail}
          title={product.title}
          discountPercentage={product.discountPercentage}
          value={product.price}
          stock={product.stock}
          />
        } )} 
      </div>
          

      )
}