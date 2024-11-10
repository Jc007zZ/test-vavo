"use client";

import { useEffect, useState } from "react";
import GeneralContext from "@/context/GeneralContext";
import Product from "@/types"

import {useDisclosure,} from "@nextui-org/modal";
import { ProductCard } from "@/components/ui/product-card";
import { GeneralPagination } from "@/components/ui/generalpagination";
import { FormModal } from "@/components/ui/formmodal";
import { Filter } from "@/components/ui/filter";



export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setotalPages] = useState(10);
  const [brand, setBrand] = useState("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Product[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setallProducts] = useState<Product[]>([]);
  const [modalcontent, setModalcontent] = useState<Product | null>();
  const [uniqueBrands, setUniqueBrands] = useState<string[]>(["teste"]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function filterByTitleOrBrand(title: string, brand: string) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let filteredItens: Array<Product> = allProducts;

    if (title == "" && brand == "all") {
      setotalPages(Math.ceil(allProducts.length / 12));
      setData(allProducts.slice(currentPage * 12 - 12, currentPage * 12));
    } else {
      if (title !== "" && allProducts) {
        filteredItens = allProducts.filter(
          (product: Product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }
      if (brand !== "all" && allProducts) {
        if (filteredItens) {
          filteredItens = filteredItens.filter(
            (product: Product) => product.brand === brand,
          );
        }
      }
      const arrPagination = filteredItens.slice(
        currentPage * 12 - 12,
        currentPage * 12,
      );

      setotalPages(Math.ceil(filteredItens.length / 12));
      setData(arrPagination);

      if (currentPage > Math.floor(filteredItens.length / 12)) {
        setCurrentPage(1);
      }
    }
  }

  useEffect(() => {
    filterByTitleOrBrand(searchTerm, brand);
  }, [currentPage, searchTerm, brand]);

  useEffect(() => {
    fetchUniqueBrands();
    fetchData();
  }, []);

  
  useEffect(() => {
    if (allProducts.length > 1) {
      filterByTitleOrBrand(searchTerm, brand);
      localStorage.setItem("localproducts", JSON.stringify(allProducts));
    }
  }, [allProducts]);
  
  const fetchData = async () => {
    try {
      const localProducts = JSON.parse(
        localStorage.getItem("localproducts") ?? "[]",
      );

      if (localProducts && localProducts.length !== 0) {
        setallProducts(localProducts);
        setotalPages(Math.floor(localProducts.length / 12));
      } else {
        const response = await fetch(
          "https://dummyjson.com/products?limit=194&skip=0",
        );
        const result = await response.json();

        localStorage.setItem("localproducts", JSON.stringify(result.products));
        setallProducts(result.products);
        setotalPages(Math.floor(result.total / 12));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  
  async function fetchUniqueBrands() {
    try {
      const response = await fetch(
        "https://dummyjson.com/products?limit=194&select=brand",
      );
      const data = await response.json();
      const brandsSet: Set<string> = new Set(
        data.products
          .map((product: Product) => product.brand)
          .filter((brand: string | undefined) => brand !== undefined),
      );

      brandsSet.add("all");

      setUniqueBrands(Array.from(brandsSet).sort());

      return uniqueBrands;
    } catch {
      // console.error('Erro ao buscar marcas:', error);
    }
  }


  const handleOpen = (product?: Product) => {
    if (!product) {
      setModalcontent(null);
    }
    setModalcontent(product);
    onOpen();
  };

  const allStates = {
    currentPage, setCurrentPage,
    totalPages, setotalPages,
    modalcontent, setModalcontent,
    isOpen, onOpen, onClose,
    allProducts, setallProducts,
    uniqueBrands, setUniqueBrands,
    brand, setBrand,
    searchTerm ,setSearchTerm 
  }


  return (
    <GeneralContext.Provider value={allStates}>
    <section className="flex flex-col flex-wrap items-center justify-center gap-4 py-8 md:py-10 ">
      <Filter/>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {loading ? (
          <h1>Carregando...</h1>
        ) : (
          data &&
          data.map((product: Product, index: number) => {
            return (
              <ProductCard
                key={index}
                discountPercentage={product.discountPercentage}
                image={product.thumbnail}
                stock={product.stock}
                title={product.title}
                value={product.price}
              >
                <button
                  className="font-bold"
                  onClick={() => handleOpen(product)}
                >
                  ...
                </button>
              </ProductCard>
            );
          })
        )}
      </div>

      <div className="flex justify-center gap-5 w-full">
        <GeneralPagination/>
      </div>

      <FormModal/>
    </section>
    </GeneralContext.Provider>
  );
}
