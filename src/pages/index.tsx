import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense } from "react";
import { Navbar } from "../components/Navbar";

const CreateLink = dynamic(() => import("../components/CreateLink"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>B.lnk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" min-h-screen mx-auto ">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20  ">
          <div className="md:w-1/2">
            <Suspense>
              <h1 className="text-6xl font-bold text-center uppercase">
                B.lnk
              </h1>
              <p className="text-center capitalize pt-1 text-md">
                a simple and speedy url shortener
              </p>
              <CreateLink />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
