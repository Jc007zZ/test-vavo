import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import GeneralContext from "@/context/GeneralContext";
import { useContext } from "react";

export function GeneralPagination(){

    const { currentPage, setCurrentPage, totalPages, setTotalPages }  = useContext(GeneralContext)

    return(
        <div className="flex items-center gap-2">
            <Button
            color="secondary"
            size="sm"
            variant="flat"
            onPress={() => setCurrentPage((prev: any) => (prev > 1 ? prev - 1 : prev))}
            >
            Previous
            </Button>
            <Pagination
            color="secondary"
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
            />
            <Button
            color="secondary"
            size="sm"
            variant="flat"
            onPress={() =>
            setCurrentPage((prev: any) => (prev < totalPages ? prev + 1 : prev))
            }
            >
            Next
            </Button>
        </div>
                        )
}