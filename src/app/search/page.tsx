import { db } from "@/db";
import { product,productsTable } from "@/db/schema";
import { vectorize } from "@/lib/vectorize";
import { Index } from "@upstash/vector";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    }
}
export type CoreProduct = Omit<product ,' createAt '|' updateAt'>
const index = new Index<CoreProduct>()

const page = async ({ searchParams }: PageProps) => {
    const query = searchParams.q

    if (Array.isArray(query) || !query) {
        redirect('/')
    }
    let products : CoreProduct[] = await db.select().from(productsTable).where(sql`to_tsvector('simple',lower(${productsTable.name} || ' ' || ${productsTable.description}))
    @@ to_tsquery('simple',lower(${query
            .trim()
            .split(' ')
            .join(' & ')}))`

    ).limit(3)
    if (products.length <3) {
        //search products by semantics  similarity 
        const vector =await vectorize(query)
        const res = await index.query({
            topK:5,
            vector,
            includeMetadata: true
        })
        const vectorProducts = res
        .filter((existingProduct) => {
          if (
            products.some((product) => product.id === existingProduct.id) ||
            existingProduct.score < 0.99
          ) {
            return false
          } else {
            return true
          }
        })
        .map(({ metadata }) => metadata!)
  
      products.push(...vectorProducts)
    }
    if(products.length === 0){
        return(
            <div className="text-center py-4 bg-white shadow-md rounded-b-md ">
                 <X className='mx-auto h-8 w-8 text-gray-400'/>
                 <h3 className="mt-2  text-sm font-semibold text-gray-900">
                    No result
                 </h3>
                 <p className="mt-1 text-sm mx-auto max-w-prose text-gray-500"> Sorry we couldn't find  any matches  for {' '} <span className="text-green-600 foont-medium ">{query}</span></p>
            </div>
           
        )
    }
    
    return (
        <ul className="py-4 divide-zinc-100 divide-y bg-white shadow-md rounded-b-md">
            {products.slice(0,3).map((product)=>(<Link key={product.id} href={`/products/${product.id}`}>
                <li className="ms-auto py-4 px-8  flex space-x-4">
                    <div className="relative flex items-center bg-zinc-100 rounded-lg h-40 w-40">
                        <Image  loading='eager' fill src={`/${product.imageId}`} alt="Product-Image"/>
                    </div>
                    <div className="w-full flex-1 space-y-2 py-1">
                        <h1 className="text-lg font-medium text-gray-900">{product.name}</h1>
                        <p className="prose prose-sm text-gray-500 line-clamp-3">
                            {product.description}
                        </p>
                        <p className="font-medium text-base text-gray-900">
                           ${product.price.toFixed(2)}
                        </p>
                    </div>
                </li>
            </Link>))}
        </ul>
    )
}

export default page