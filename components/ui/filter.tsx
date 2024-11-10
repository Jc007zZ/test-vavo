import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { useContext } from "react";
import GeneralContext from "@/context/GeneralContext";
import Product from "@/types" 


export function Filter() {
    const { uniqueBrands, setUniqueBrands, brand, setBrand, setModalcontent, onOpen, setSearchTerm  }  = useContext(GeneralContext)

    const handleOpen = (product?: Product) => {
        if (!product) {
          setModalcontent(null);
        }
        setModalcontent(product);
        onOpen();
      };

  return (
    <div className="flex flex-wrap items-start justify-center w-full gap-4">
        <Accordion className="grow basis-[10rem]">
          <AccordionItem key="1" aria-label="Accordion 1" title="Marcas">
            <div className="w-full flex flex-wrap gap-4">
              {uniqueBrands.map((e: string, index: number) => (
                <button
                  key={index}
                  className="bg-zinc-800 hover:bg-zinc-900 px-2 py-1 rounded-2xl w-fit hover: cursor-pointer"
                  onClick={() => {
                    setBrand(e);
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center mt-2 gap-4">
          <input
            className="h-10 p-2 py-2 rounded-lg decoration-inherit outline-none w-full"
            placeholder="Pesquisar"
            type="text"
            onChange={(e) =>
              setTimeout(() => setSearchTerm(e.target.value), 1000)
            }
          />
          <Button
            className="text-white w-40 px-16"
            color="success"
            onClick={() => handleOpen()}
          >
            Add New Product
          </Button>
        </div>
      </div>
  );
}
