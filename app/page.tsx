'use client'
import {Pagination} from "@nextui-org/pagination";
import {ProductCard} from "@/components/ui/ProductCard"
import {Button, ButtonGroup} from "@nextui-org/button";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import React from "react";
import { useEffect, useState } from "react";
import { getFilledInputUtilityClass } from "@mui/material";

interface Product{
  id: number,
  title: string,
  price: number,
  quantity: number,
  total: number,
  discountPercentage: number,
  discountedTotal: number,
  thumbnail: string
}

export default function Home() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [brand, setBrand] = React.useState("all");
  const [totalPages, setotalPages] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Product[] | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allProducts, setallProducts] = React.useState<Product[] | null>(null);
  const [uniqueBrands, setUniqueBrands] = React.useState<string[]>(["teste"]);
  const accordionRef = React.useRef(null);

  async function filterByTitleOrBrand(title: string, brand: string) {
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let final: any = allProducts
    // let countOfPages: number = 1
    if(title == '' && brand == 'all'){
      let skip = currentPage * 12
      skip = skip - 12
      const response = await fetch(`https://dummyjson.com/products?limit=12&skip=${skip}`);
      const result = await response.json();
      final = result.products  
      setotalPages(Math.floor(result.total/12))  
      setData(final);  
    }

    else{
      if(title !== '' && allProducts){
        final = allProducts.filter((product: any) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if(brand !== 'all' && allProducts){
        if(final){
        final = final.filter((product:any) => product.brand === brand);
        }
        else{
          if(final){
            final = final.filter((product:any) => product.brand === brand);
          }
        }
        console.log(totalPages)
      }
      const novoArray = final.slice( (currentPage * 12) - 12 , currentPage * 12);
      setotalPages(Math.ceil(final.length/12))
      setData(novoArray); 
      console.log(totalPages)
      console.log(Math.ceil(final.length/12))

      if(currentPage > Math.floor(final.length/12)){
        console.log('testeeeeeeee')
        setCurrentPage(1)
      }
    }
      console.log(final)
  }

  useEffect(() => {
    filterByTitleOrBrand(searchTerm, brand )

}, [currentPage, searchTerm, brand]);
  

  
  React.useEffect(() => {
    fetchUniqueBrands()
    fetchData();
    getAllProducts()
  }, []);

  async function getAllProducts() {
    const response = await fetch('https://dummyjson.com/products?limit=194');
     const result = await response.json();
     setallProducts(result.products)
  }

  const fetchData = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=12&skip=0'); // URL da API
      const result = await response.json();
      setData(result.products); 
      setotalPages(Math.floor(result.total/12))
      console.log(result.products)
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false); 
    }
  }; 

  

  async function fetchUniqueBrands() {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=194&select=brand');
      const data = await response.json();
      // Usar um Set para garantir marcas únicas
      const brandsSet: Set<string> = new Set(data.products.map((product: any) => product.brand));
      brandsSet.add('all')
      // Converter o Set de volta para um array
       setUniqueBrands(Array.from(brandsSet))
      
      console.log(uniqueBrands);
      return uniqueBrands;
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
    }
  }


  return (
    <section className="flex flex-col flex-wrap items-center justify-center gap-4 py-8 md:py-10 ">
      <div className="flex items-center justify-between w-full">
    
        <Accordion className="w-full">
            <AccordionItem
                key="1" aria-label="Accordion 1" title="Marcas">
              <div className="w-full flex flex-wrap gap-4">
                { uniqueBrands.map((e: any, index: any) =>
                <p
                className="bg-zinc-800 hover:bg-zinc-900 px-2 py-1 rounded-2xl w-fit hover: cursor-pointer"
                key={index}
                onClick={() =>{
                  setBrand(e);
                  // id do botão do accordion para fechar ele apos escolher uma marca
                  document.getElementById(":R1ljtacq:")?.click()
                  }}>{e}
                </p>
                )}
              </div>
            </AccordionItem>
        </Accordion>

        <input className="h-10 p-2 py-2 rounded-lg" type="text" onChange={(e) => setTimeout(() => setSearchTerm(e.target.value), 1000)} />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
      {loading ? (
        
        <h1>Carregando...</h1>// Renderiza os dados quando disponíveis
      ) : (
         data && data.map((product: any, index: any) =>{   
          return <ProductCard
            title={product.title}
            image={product.thumbnail}
            value={product.price}
            teste={product.id}
            stock={product.stock}
            discountPercentage={product.discountPercentage}
            />}
          ) 
            )}
      </div>
         
       <div className="flex justify-center gap-5 w-full">
                <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                  >
                    Previous
                  </Button>
                <Pagination
                  total={totalPages}
                  color="secondary"
                  page={currentPage}
                  onChange={setCurrentPage}
                />
                <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onPress={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                  >
                    Next
                  </Button>
       </div>
    </section>
  );
}
