import Head from "next/head";
import Image from "next/image"
import Link from "next/link"
import { Montserrat } from "next/font/google"
import { type PropsWithChildren } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import tmdbLogo from '../../public/tmdb-logo.svg'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap'
})

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Movie Match</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex flex-col h-screen justify-between bg-gradient-to-b from-[#b4d1eb] to-[#8a96c3] ${montserrat.className}`}>
        <header className="w-full">
          <nav className="text-white bg-gray-800 py-4">
            <div className="flex mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <Link href="/" className="flex">
                <FontAwesomeIcon icon={faFilm} className="w-8"/>
                <h1 className="px-4 text-3xl">Movie Match</h1>
              </Link>
              <div></div>
            </div>
          </nav>
        </header>
        <main className={"mb-auto mt-10"}>
          {children}
        </main>
        <footer className="flex justify-end p-2 text-xs text-white bg-gray-800">
          <Image 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={tmdbLogo}
            width={100}
            height={16}
            alt="TMDB"  
          />
          <span className="ml-2">
            This product uses the TMDB API but is not endorsed or certified by TMDB
          </span>
        </footer>
      </div>
    </>
  )
}