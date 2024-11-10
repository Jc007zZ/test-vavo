'use client'
import { createContext } from 'react'

interface UserContextType {
    teste: string;
    setTeste: React.Dispatch<React.SetStateAction<string>>;
    outroEstado: number;
    setOutroEstado: React.Dispatch<React.SetStateAction<number>>;
  }

const GeneralContext = createContext<any>({})
export default GeneralContext