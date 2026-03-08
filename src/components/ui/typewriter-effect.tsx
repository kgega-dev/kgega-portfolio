"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(
        ".typing-span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.3,
          delay: stagger(0.12),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView, animate]);

  const renderWords = (isPlaceholder: boolean) => {
    return (
      <div className="inline-flex flex-wrap items-baseline w-full">
        {wordsArray.map((word, idx) => {
          if (word.text.join("") === "\n") {
            return (
              <motion.div
                key={`break-${idx}`}
                initial={isPlaceholder ? { opacity: 0 } : { display: "none", opacity: 0 }}
                className={cn("w-full h-0", isPlaceholder ? "opacity-0" : "typing-span")}
              ></motion.div>
            );
          }
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  key={`char-${index}`}
                  initial={isPlaceholder ? { opacity: 0 } : { display: "none", opacity: 0 }}
                  className={cn(
                    isPlaceholder ? "opacity-0" : "typing-span",
                    index === 0 && word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          );
        })}
        {isPlaceholder ? (
          <div className={cn("inline-block w-[4px] md:w-[8px] ml-[1vw] invisible", cursorClassName)}></div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className={cn(
              "inline-block rounded-sm w-[4px] md:w-[8px] h-[0.7em] bg-[var(--accent)] align-baseline ml-[1vw]",
              cursorClassName
            )}
          ></motion.div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative inline-flex", className)} ref={scope}>
      {/* Invisible layout placeholder reserves final space safely */}
      <div className="opacity-0 pointer-events-none select-none w-full">
        {renderWords(true)}
      </div>
      {/* Absolutely positioned layer actively typing */}
      <div className="absolute inset-0">
        {renderWords(false)}
      </div>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,

          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
