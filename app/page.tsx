'use client'
import {Pagination} from "@nextui-org/pagination";
import {ProductCard} from "@/components/ui/product-card"
import {Button} from "@nextui-org/button";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import React from "react";
import { useEffect, useState, useRef } from "react";
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";

interface Product{
  id: number,
  title: string,
  description: string,
  brand: string,
  price: number,
  stock: number,
  total?: number,
  discountPercentage: number,
  thumbnail: string
}


export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [brand, setBrand] = useState("all");
  const [totalPages, setotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Product[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setallProducts] = useState<Product[]>([]);
  const [modalcontent, setModalcontent] = useState<Product | null>();
  const [uniqueBrands, setUniqueBrands] = useState<string[]>(["teste"]);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const formRef = useRef<HTMLFormElement | null>(null)

  async function filterByTitleOrBrand(title: string, brand: string) {

    window.scrollTo({ top: 0, behavior: 'smooth' });
    let filteredItens: Array<Product> = allProducts

    if(title == '' && brand == 'all'){
      setotalPages(Math.ceil(allProducts.length/12))
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
      }
      const arrPagination = filteredItens.slice( (currentPage * 12) - 12 , currentPage * 12);
      setotalPages(Math.ceil(filteredItens.length/12))
      setData(arrPagination); 

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
          if(localProducts && localProducts.length !== 0){
            setallProducts(localProducts)
            setotalPages(Math.floor(localProducts.length/12))
          }
          else{
            const response = await fetch('https://dummyjson.com/products?limit=194&skip=0')
            const result = await response.json();
            localStorage.setItem("localproducts", JSON.stringify(result.products));
            setallProducts(result.products)
            setotalPages(Math.floor(result.total/12))
          } 
    } catch {
    } finally {
      setLoading(false); 
    }
  }; 

  useEffect(() => {
    if(allProducts.length > 1){
      filterByTitleOrBrand(searchTerm, brand)
      localStorage.setItem("localproducts", JSON.stringify(allProducts));
    }
}, [allProducts]);
  
  async function fetchUniqueBrands() {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=194&select=brand');
      const data = await response.json();
      const brandsSet: Set<string> = new Set(data.products.map((product: Product) =>  product.brand).filter((brand: string | undefined) => brand !== undefined));
      brandsSet.add('all')
      
      setUniqueBrands(Array.from(brandsSet).sort())
      
      return uniqueBrands;
    } catch {
      // console.error('Erro ao buscar marcas:', error);
    }
  }

  function deleProduct(){
    onClose()
    const novoArray = allProducts.filter(product => product.id !== modalcontent?.id);
    setallProducts(novoArray)
    setotalPages(Math.floor(allProducts.length/12))
  }

  function updateProduct(e:any){
    e.preventDefault()
    onClose()
    const newObj: Product = {
      title: e.target[0].value,
      description: e.target[1].value,
      brand: e.target[2].value,
      thumbnail: e.target[3].value,
      price: e.target[4].value,
      id: e.target[5].value,
      stock: e.target[6].value,
      discountPercentage: e.target[7].value,
    }
    setallProducts((prevProducts) => {
    const index = prevProducts.findIndex((obj) => obj.id == newObj.id);
    if (index !== -1) {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = { ...updatedProducts[index], ...newObj };
      return updatedProducts;
    }
    return prevProducts;
  });
}

  function createProduct(e:any){
    e.preventDefault()
    onClose()
    const newObj: Product = {
      title: e.target[0].value,
      description: e.target[1].value,
      brand: e.target[2].value,
      thumbnail: e.target[3].value,
      price: e.target[4].value,
      id: allProducts.length + 1,
      stock: e.target[6].value,
      discountPercentage: e.target[7].value,
    }
    setallProducts(prevProdutos => [...prevProdutos, newObj]); 
  }


  const handleOpen = (product?: Product) => {
    if(!product){
      setModalcontent(null)
    }
    setModalcontent(product)
    onOpen();
  }


  return (
    <section className="flex flex-col flex-wrap items-center justify-center gap-4 py-8 md:py-10 ">
      <div className="flex flex-wrap items-start justify-center w-full gap-4">
        <Accordion className="grow basis-[10rem]">
            <AccordionItem
                key="1" aria-label="Accordion 1" title="Marcas">
              <div className="w-full flex flex-wrap gap-4">
                { uniqueBrands.map((e: string, index: number) =>
                <button
                className="bg-zinc-800 hover:bg-zinc-900 px-2 py-1 rounded-2xl w-fit hover: cursor-pointer"
                key={index}
                onClick={() =>{
                  setBrand(e);
                  }}>{e}
                </button>
                )}
              </div>
            </AccordionItem>
        </Accordion>

        <div className="flex items-center mt-2 gap-4">
          <input className="h-10 p-2 py-2 rounded-lg decoration-inherit outline-none w-full" placeholder="Pesquisar" type="text" onChange={(e) => setTimeout(() => setSearchTerm(e.target.value), 1000)} />
          
          <Button color="success" className="text-white w-40 px-16" onClick={() => handleOpen()}>Add New Product</Button>
        </div>
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
            stock={product.stock}
            discountPercentage={product.discountPercentage}
            key={index}
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
        onClose={onClose} >
        <ModalContent>
          {(onClose) => {
            if(modalcontent){
              return (
              <form ref={formRef} onSubmit={(e) => updateProduct(e)}>
                    <ModalHeader className="flex flex-col gap-1">Atualizar Produto</ModalHeader>
                    <ModalBody>
                        <label>
                          <h1>Titulo</h1>
                          <input name="title" required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.title}  />
                        </label>
                        <label>
                          <h1>Descrição</h1>
                          <input name="title" required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.description}  />
                        </label>
                        <label>
                          <h1>Marca</h1>
                          <input name="title" required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.brand}  />
                        </label>
                        <label>
                          <h1>Imagem</h1>
                          <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" defaultValue={modalcontent?.thumbnail} />
                        </label>
                        <label>
                          <h1>Preço</h1>
                          <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="number" step="any"  defaultValue={modalcontent?.price} />
                        </label>
                        <label>
                          <h1>Id</h1>
                          <input type="text" required className="w-full p-2 rounded-lg decoration-inherit outline-none bg-black/30 opacity-40" disabled defaultValue={modalcontent?.id}/>
                        </label>
                        <label>
                          <h1>Quantidade</h1>
                          <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="number" defaultValue={modalcontent?.stock} />
                        </label>
                        <label>
                          <h1>Desconto</h1>
                          <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="number" step="any" defaultValue={modalcontent?.discountPercentage} />
                        </label>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" type="submit" variant="light" onPress={() => deleProduct()}>
                          Apagar
                      </Button>
                      <button 
                      type="submit" 
                      className="bg-sky-600 px-4 rounded-xl"
                      >
                      Salvar
                      </button>
                   </ModalFooter>
              </form>)
            }
            else{
              return (
                <form ref={formRef} onSubmit={(e) => createProduct(e)}>
                      <ModalHeader className="flex flex-col gap-1">Atualizar Produto</ModalHeader>
                      <ModalBody>
                          <label>
                            <h1>Titulo</h1>
                            <input name="title" required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" placeholder="Tenis da nike"/>
                          </label>
                          <label>
                            <h1>Descrição</h1>
                            <input name="title" required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" placeholder="Tenis de corrida para atletas"/>
                          </label>
                          <label>
                            <h1>Marca</h1>
                            <input name="title" required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" placeholder="Nike"/>
                          </label>
                          <label>
                            <h1>Imagem</h1>
                            <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="text" placeholder="htts://google.images.com/image.png"/>
                          </label>
                          <label>
                            <h1>Preço</h1>
                            <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="number" step="any"  placeholder="19,99"/>
                          </label>
                          <label>
                            <h1>Id</h1>
                            <input type="text" required className="w-full p-2 rounded-lg decoration-inherit outline-none bg-black/30 opacity-40" disabled placeholder="id"/>
                          </label>
                          <label>
                            <h1>Quantidade</h1>
                            <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="number" placeholder="10"/>
                          </label>
                          <label>
                            <h1>Desconto</h1>
                            <input required className="w-full p-2 rounded-lg decoration-inherit outline-none" type="number" step="any" placeholder="15%"/>
                          </label>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" type="submit" variant="light" onPress={onClose}>
                            Fechar
                        </Button>
                        <button 
                        type="submit" 
                        className="bg-sky-600 px-4 rounded-xl"
                        >
                        Salvar
                        </button>
                     </ModalFooter>
                </form>)
            }
          
}}
        </ModalContent>
      </Modal>
       </div>
    </section>
  );
}
