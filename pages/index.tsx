import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import DropDown2, { VibeType2 } from "../components/DropDown2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Github from "../components/GitHub";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import Script from "next/script";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [desc, setDesc] = useState("");
  const [lang, setLang] = useState<VibeType>("English");
  const [difficulty, setDifficulty] = useState<VibeType2>("Easy");
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const defultDesc = "How to explain relativity?";

  console.log("Streamed response: ", { generatedDescs });
  const promptObj = {
    "English": "UK English",
    "中文": "Simplified Chinese",
    "繁體中文": "Traditional Chinese",
    "日本語": "Japanese",
    "Italiano": "Italian",
    "Deutsch": "German",
    "Español": "Spanish",
    "Français": "French",
    "Nederlands": "Dutch",
    "한국어": "Korean",
    "ភាសាខ្មែរ": "Khmer",
    "हिंदी": "Hindi",
    "Indonesian": "Indonesian",
  };
  const difficultyObj = {
    "Easy": "Easy",
    "Professional": "Professional",
  };
  const text = desc || defultDesc;

  const generateDesc = async (e: any) => {
    let prompt;
    if (difficultyObj[difficulty] == "Easy") {
      prompt = `Pretend you are GPT-4 model. Explain ${text}${
        text.slice(-1) === "." ? "" : "."
      } to a 6nd grader in ${promptObj[lang]} with a simple example.`;
    } else {
      prompt = `Pretend you are GPT-4 model. Explain ${text}${
        text.slice(-1) === "." ? "" : "."
      } in ${
        promptObj[lang]
      }  in technical terms, divided into two paragraphs, principles and applications. Output format, Principle:, Application.`;
    }
    e.preventDefault();
    setGeneratedDescs("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      setError(true);
      setLoading(false);
      throw new Error(response.statusText);
    }

    console.log('generate接口调用成功',response)
    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Teach Anything</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6000PLHFK1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6000PLHFK1');
        `}
      </Script>

      <Header />

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:my-16">
        <h1 className="sm:text-4xl text-2xl max-w-1xl font-bold text-slate-900">
          Teach you{" "}
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            Anything
          </span>{" "}
          in seconds
        </h1>
        <p className="text-slate-500 my-5">1,063,505 answers generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">
              1
            </span>
            <p className="text-left font-medium">Write your question</p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black block"
            placeholder={"e.g. " + defultDesc}
          />
          <div className="flex my-4 items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">
              2
            </span>
            <p className="text-left font-medium">Select your language</p>
          </div>
          <div className="block">
            <DropDown vibe={lang} setVibe={(newLang) => setLang(newLang)} />
          </div>

          <div className="flex my-4 items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">
              3
            </span>
            <p className="text-left font-medium">Select difficulty</p>
          </div>
          <div className="block">
            <DropDown2
              vibe2={difficulty}
              setVibe2={(newDifficulty) => setDifficulty(newDifficulty)}
            />
          </div>

          <div className="md:flex sm:mt-6 mt-4 space-y-4 md:space-y-0 gap-4">
            {!loading && (
              <button
                className="bg-black md:flex-1 rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                onClick={(e) => generateDesc(e)}
              >
                Generate answer
              </button>
            )}
            {loading && (
              <button
                className="bg-black md:flex-1 rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
            <a
              href="https://magickpen.com/"
              className="pro-btn  block md:flex-1 border border-transparent rounded-xl font-medium px-4 py-2 w-full"
            >
              Get Pro version &rarr;
            </a>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2000 }} />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-4">
              {generatedDescs && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      The answer is
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap">
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDescs);
                        toast("Text copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      <p>{generatedDescs}</p>
                      <blockquote className="mt-4 text-sm border-l-4 border-slate-300 pl-3 text-slate-400">
                        teach-anything.com
                      </blockquote>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
        {error && (
          <p className="text-gray-400 my-5">
            🚨 Server is busy, please try again later, or you can
            <a href="https://magickpen.com/" className=" underline hover:text-black ml-1">
              Get Pro version
            </a>
            .
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <a
            href="https://discord.gg/baGvNpRujT"
            target="_blank"
            className="inline-flex items-center px-5 py-2.5 text-center text-sm font-medium text-[#747DF8] hover:opacity-80"
          >
            <svg
              className="mr-2 -ml-1 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
            </svg>
            Join Discord
          </a>
          <a
            href="https://twitter.com/intent/tweet/?text=Teach%20Anything&url=https%3A%2F%2Fwww.teach-anything.com"
            target="_blank"
            className="text-[#1da1f2] font-medium text-sm px-5 py-2.5 text-center inline-flex items-center hover:opacity-80"
          >
            <svg
              className="w-4 h-4 mr-2 -ml-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="twitter"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
              ></path>
            </svg>
            Share on Twitter
          </a>
        </div>
        <div className="my-5 max-w-xl w-full">
          <h2 className=" text-slate-400 mb-4">Our Products</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <li>
              <a
                href="https://magickpen.com/"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-50 rounded-lg hover:transition-all"
              >
                <img
                  className="h-6 object-contain"
                  src="/magickpen.svg"
                  alt="MagickPen - Write Anything in Seconds Just like Magick"
                />
              </a>
            </li>
            <li>
              <a
                href="https://reviewgpt.net/"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-50 rounded-lg hover:transition-all"
              >
                <img
                  className="h-6 object-contain"
                  src="/ReviewGPT.png"
                  alt="ReviewGPT - Make Your Writing Awesome, AI-Powered"
                />
              </a>
            </li>
            <li>
              <a
                href="https://openl.io/"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-50 rounded-lg hover:transition-all"
              >
                <img
                  className="h-6 object-contain"
                  src="/OpenL.png"
                  alt="OpenL - Amazing Translator, powered by AI"
                />
              </a>
            </li>
            <li>
              <a
                href="https://better.avatarprompt.net/"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-50 rounded-lg hover:transition-all"
              >
                <img
                  className="h-6 object-contain"
                  src="/BetterPrompt.png"
                  alt="BetterPrompt - Make Your Midjourney Prompt Better!"
                />
              </a>
            </li>
            <li>
              <a
                href="https://ask2end.com/"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-50 rounded-lg hover:transition-all"
              >
                <img
                  className="h-6 object-contain"
                  src="/Ask2End.png"
                  alt="Ask2End - Ask anything, get the ultimate answer!"
                />
              </a>
            </li> 
            <li>
              <a
                href="https://sailboatui.com/?ref=teach-anything"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-50 rounded-lg hover:transition-all"
              >
                <img className="h-6 object-contain" src="/sailboatui.svg" alt="Sailboat UI" />
              </a>
            </li>
            <li>
              <a
                href="https://www.buymeacoffee.com/lvwzhen"
                className="flex px-2 items-center justify-center h-14 hover:bg-slate-100 rounded-lg hover:transition-all border border-dashed border-slate-200 bg-slate-50"
              >
                <p className="h-6 leading-6">❤️ Your logo</p>
              </a>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
      <a
        href="https://discord.gg/baGvNpRujT"
        target="_blank"
        className="fixed right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fill-rule="evenodd"
            d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
};

export default Home;

