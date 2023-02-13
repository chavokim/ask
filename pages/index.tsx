import Head from 'next/head'
import { Inter } from '@next/font/google'
import moment from 'moment'
import {useCommentMutation, useComments} from "@/module/comment";
import {useQueryClient} from "react-query";
import React from "react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const name = "sam";
    const {data: comments } = useComments(name);
    
    const queryClient = useQueryClient();
    
    const {mutate} = useCommentMutation(queryClient, name);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const target = e.target as typeof e.target & {
            search: { value: string };
        };
    
        const value = target.search.value;
    
        mutate({
            content: value, 
        });
    }
    
    return (
        <>
          <Head>
            <title>Ask to {name}</title>
            <meta name="description" content={`Ask anything to ${name}`} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div
            className={"container mx-auto px-4 py-8 max-w-3xl"}
          >
              <div
                className={"flex flex-col sticky"}
                id={"ask-form"}
              >
                  <h3 className="text-2xl mb-4 text-center">
                      Ask to 
                      <strong className={"ml-2 text-4xl uppercase"}>
                          {name}
                      </strong>
                  </h3>
                  <form
                    onSubmit={handleSubmit}
                  >
                      <label htmlFor="search"
                             className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                      <div className="relative">
                          <input type="search" id="search"
                                 className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                 placeholder="Ask anything :)" required
                          />
                          <button type="submit"
                                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Submit
                          </button>
                      </div>
                  </form>
              </div>
              <div
                className={"flex flex-col space-y-4 mt-8"}
              >
                  {
                        comments?.map((comment, i) => (
                            <div
                                key={i}
                                className={"flex flex-col space-y-4"}
                            >
                                <div
                                    className={"flex flex-row space-x-4 items-center justify-between"}
                                >
                                    <p>
                                        {comment.content}
                                    </p>
                                    <p
                                        className={"min-w-max hidden md:block"}
                                    >
                                        {moment(comment.createdAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                        ))              
                  }
              </div>
          </div>
        </>
    )
}
