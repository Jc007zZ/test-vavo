import { Button } from "@nextui-org/button";
import GeneralContext from "@/context/GeneralContext";
import { useContext, useEffect, useRef } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@nextui-org/modal";
import Product from "@/types" 


  

export function FormModal(){
  const formRef = useRef<HTMLFormElement | null>(null);
  const { modalcontent, setModalcontent,
         isOpen, onOpen, onClose,
         allProducts, setallProducts,
         totalPages, setotalPages }  = useContext(GeneralContext)

  useEffect(() =>{
    console.log(isOpen)
  },[isOpen])

  function deleProduct() {
    onClose();
    const novoArray = allProducts.filter(
      (product: Product) => product.id !== modalcontent?.id,
    );

    setallProducts(novoArray);
    setotalPages(Math.floor(allProducts.length / 12));
  }

   function updateProduct(e: any) {
    e.preventDefault();
    onClose();
    const newObj: Product = {
      title: e.target[0].value,
      description: e.target[1].value,
      brand: e.target[2].value,
      thumbnail: e.target[3].value,
      price: e.target[4].value,
      id: e.target[5].value,
      stock: e.target[6].value,
      discountPercentage: e.target[7].value,
    };

    setallProducts((prevProducts: Product[]) => {
      const index = prevProducts.findIndex((obj) => obj.id == newObj.id);

      if (index !== -1) {
        const updatedProducts = [...prevProducts];

        updatedProducts[index] = { ...updatedProducts[index], ...newObj };

        return updatedProducts;
      }

      return prevProducts;
    });
  }


   function createProduct(e: any) {
    e.preventDefault();
    onClose();
    const newObj: Product = {
      title: e.target[0].value,
      description: e.target[1].value,
      brand: e.target[2].value,
      thumbnail: e.target[3].value,
      price: e.target[4].value,
      id: allProducts.length + 1,
      stock: e.target[6].value,
      discountPercentage: e.target[7].value,
    };

    setallProducts((prevProdutos: Product[]) => [...prevProdutos, newObj]);
  }

    return(
        <Modal isOpen={isOpen} size={"5xl"} onClose={onClose}>
        <ModalContent>
          {(onClose) => {
            if (modalcontent) {
              return (
                <form ref={formRef} onSubmit={(e) => updateProduct(e)}>
                  <ModalHeader className="flex flex-col gap-1">
                    Atualizar Produto
                  </ModalHeader>
                  <ModalBody>
                    <label>
                      <h1>Titulo</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.title}
                        name="title"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Descrição</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.description}
                        name="title"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Marca</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.brand}
                        name="title"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Imagem</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.thumbnail}
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Preço</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.price}
                        step="any"
                        type="number"
                      />
                    </label>
                    <label>
                      <h1>Id</h1>
                      <input
                        disabled
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none bg-black/30 opacity-40"
                        defaultValue={modalcontent?.id}
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Quantidade</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.stock}
                        type="number"
                      />
                    </label>
                    <label>
                      <h1>Desconto</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        defaultValue={modalcontent?.discountPercentage}
                        step="any"
                        type="number"
                      />
                    </label>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      type="submit"
                      variant="light"
                      onPress={() => deleProduct()}
                    >
                      Apagar
                    </Button>
                    <button
                      className="bg-sky-600 px-4 rounded-xl"
                      type="submit"
                    >
                      Salvar
                    </button>
                  </ModalFooter>
                </form>
              );
            } else {
              return (
                <form ref={formRef} onSubmit={(e) => createProduct(e)}>
                  <ModalHeader className="flex flex-col gap-1">
                    Atualizar Produto
                  </ModalHeader>
                  <ModalBody>
                    <label>
                      <h1>Titulo</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        name="title"
                        placeholder="Tenis da nike"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Descrição</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        name="title"
                        placeholder="Tenis de corrida para atletas"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Marca</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        name="title"
                        placeholder="Nike"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Imagem</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        placeholder="htts://google.images.com/image.png"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Preço</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        placeholder="19,99"
                        step="any"
                        type="number"
                      />
                    </label>
                    <label>
                      <h1>Id</h1>
                      <input
                        disabled
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none bg-black/30 opacity-40"
                        placeholder="id"
                        type="text"
                      />
                    </label>
                    <label>
                      <h1>Quantidade</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        placeholder="10"
                        type="number"
                      />
                    </label>
                    <label>
                      <h1>Desconto</h1>
                      <input
                        required
                        className="w-full p-2 rounded-lg decoration-inherit outline-none"
                        placeholder="15%"
                        step="any"
                        type="number"
                      />
                    </label>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      type="submit"
                      variant="light"
                      onPress={onClose}
                    >
                      Fechar
                    </Button>
                    <button
                      className="bg-sky-600 px-4 rounded-xl"
                      type="submit"
                    >
                      Salvar
                    </button>
                  </ModalFooter>
                </form>
              );
            }
          }}
        </ModalContent>
    </Modal>
                        )
}