"use client"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Loader2, Search } from "lucide-react"
import { useRef, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const SearchBar = () => {
    const searchParams = useSearchParams()
    const defaultQuery =  searchParams.get('q') || ""

    const InputRef = useRef<HTMLInputElement>(null)
    const [isSearching, startTransition] = useTransition()
    const router = useRouter()
    const [query, setQuery] = useState<string>(defaultQuery)

    const search = () => {
        startTransition(() => {
            router.push(`/search?q=${query}`)
        })
    }

    return (
        <div className="relative w-full h-14 flex flex-col bg-white">
            <div className="relative h-14 z-10 rounded-md">
                <Input disabled={isSearching} value={query} onChange={(e) => setQuery(
                    e.target.value
                )} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        search()
                    }
                    if (e.key === 'Escape') {
                        InputRef?.current?.blur()
                    }
                }} ref={InputRef} className="absolute inset-0 h-full " />
                <Button disabled={isSearching} onClick={search} size='sm' className=" absolute right-0 inset-y-0 h-full rounded-l-none">
                   {isSearching? <Loader2 className="h-6 w-6 animate-spin"/>:( <Search className="h-6 w-6" />)}
                </Button>

            </div>
        </div>
    )
}

export default SearchBar