'use client'
import {Pagination} from "@nextui-org/pagination";
import {ProductCard} from "@/components/ui/product-card"
import {Button, ButtonGroup} from "@nextui-org/button";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import React from "react";
import { useEffect, useState } from "react";
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";

interface Product{
  id: number,
  title: string,
  description: string,
  brand: string,
  price: number,
  stock: number,
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
  const [data, setData] = React.useState<Product[]>();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allProducts, setallProducts] = React.useState<Product[]>([]);
  const [modalcontent, setModalcontent] = React.useState<Product>();
  const [uniqueBrands, setUniqueBrands] = React.useState<string[]>(["teste"]);
  const {isOpen, onOpen, onClose} = useDisclosure();


  async function filterByTitleOrBrand(title: string, brand: string) {

    window.scrollTo({ top: 0, behavior: 'smooth' });
    let filteredItens: Array<Product> = allProducts

    if(title == '' && brand == 'all'){
      setotalPages(Math.floor(allProducts.length/12))
      setData(allProducts.slice((currentPage * 12) - 12 , currentPage * 12))
    }
    else{
      if(title !== '' && allProducts){
        filteredItens = allProducts.filter((product: Product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if(brand !== 'all' && allProducts){
        if(filteredItens){
        filteredItens = filteredItens.filter((product: Product) => product.brand === brand);
        }
        console.log(totalPages)
      }
      const arrPagination = filteredItens.slice( (currentPage * 12) - 12 , currentPage * 12);
      setotalPages(Math.ceil(filteredItens.length/12))
      setData(arrPagination); 
      console.log(totalPages)
      console.log(Math.ceil(filteredItens.length/12))

      if(currentPage > Math.floor(filteredItens.length/12)){
        setCurrentPage(1)
      }
    }
  }

  useEffect(() => {
    filterByTitleOrBrand(searchTerm, brand )

}, [currentPage, searchTerm, brand]);
  

  
  React.useEffect(() => {
    fetchUniqueBrands()
    fetchData();
  }, []);



  const fetchData = async () => {
    try {
          const localProducts = JSON.parse(localStorage.getItem("localproducts") ?? "[]");
          console.log(localProducts.length)
          if(localProducts && localProducts.length !== 0){
            setallProducts(localProducts)
            setotalPages(Math.floor(localProducts.legth/12))

          }
          else{
            const response = await fetch('https://dummyjson.com/products?limit=194&skip=0')
            const result = await response.json();
            localStorage.setItem("localproducts", JSON.stringify(result.products));
            setallProducts(result.products)
            setotalPages(Math.floor(result.total/12))
            console.log('request')
          } 
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false); 
    }
  }; 

  useEffect(() => {
    if(allProducts){
      setData(allProducts.slice((currentPage * 12) - 12 , currentPage * 12))
    }
}, [allProducts]);
  

  async function fetchUniqueBrands() {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=194&select=brand');
      const data = await response.json();
      const brandsSet: Set<string> = new Set(data.products.map((product: Product) =>  product.brand).filter((brand: string | undefined) => brand !== undefined));
      brandsSet.add('all')
       setUniqueBrands(Array.from(brandsSet))
      
      return uniqueBrands;
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
    }
  }




  const handleOpen = (product: Product) => {
    setModalcontent(product)
    onOpen();
  }


  return (
    <section className="flex flex-col flex-wrap items-center justify-center gap-4 py-8 md:py-10 ">
      <div className="flex items-start justify-between w-full">
        <Accordion className="w-full">
            <AccordionItem
                key="1" aria-label="Accordion 1" title="Marcas">
              <div className="w-full flex flex-wrap gap-4">
                { uniqueBrands.map((e: string, index: number) =>
                <p
                className="bg-zinc-800 hover:bg-zinc-900 px-2 py-1 rounded-2xl w-fit hover: cursor-pointer"
                key={index}
                onClick={() =>{
                  setBrand(e);
                  }}>{e}
                </p>
                )}
              </div>
            </AccordionItem>
        </Accordion>

        <input className="h-10 p-2 py-2 rounded-lg mt-2 decoration-inherit outline-none" placeholder="Pesquisar" type="text" onChange={(e) => setTimeout(() => setSearchTerm(e.target.value), 1000)} />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
      {loading ? (
        
        <h1>Carregando...</h1>
      ) : (
         data && data.map((product: Product, index: number) =>{   
          return <ProductCard
            title={product.title}
            image={product.thumbnail}
            value={product.price}
            teste={product.id}
            stock={product.stock}
            discountPercentage={product.discountPercentage}
            >
              <button className="font-bold" onClick={() => handleOpen(product)}>...</button>
            </ProductCard>
          }
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
       <div>
       <Modal 
        size={"5xl"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <label>
                  <h1>Titulo</h1>
                  <input className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.title}  />
                </label>
                <label>
                  <h1>Imagem</h1>
                  <input className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.thumbnail} />
                </label>
                <label>
                  <h1>Preço</h1>
                  <input className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.price} />
                </label>
                <label>
                  <h1>Id</h1>
                  <input className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.id} />
                </label>
                <label>
                  <h1>Quantidade</h1>
                  <input className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.stock} />
                </label>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Apagar 
                </Button>
                <Button color="primary" onPress={onClose}>
                  Salvar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
       </div>
    </section>
  );
}
