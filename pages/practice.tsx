import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  ChangeEvent,
  FormEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../styles/Practice.module.css";
import { Word } from "../types";
import classNames from "classnames";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { WORDS } from "../constants";

enum WordGuessResult {
  Match = "match",
  PartialMatch = "partial-match",
  Incorrect = "incorrect",
}

const getWordGuessResult = (
  wordTranslation: string,
  wordGuess: string
): WordGuessResult => {
  const parsedWordTranslation = wordTranslation.toLowerCase().trim();
  const parsedWordGuess = wordGuess.toLowerCase().trim();

  if (parsedWordGuess === parsedWordTranslation) return WordGuessResult.Match;

  if (
    parsedWordTranslation.includes(parsedWordGuess) ||
    parsedWordGuess.includes(parsedWordTranslation)
  )
    return WordGuessResult.PartialMatch;

  return WordGuessResult.Incorrect;
};

const Practice: NextPage = () => {
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const wordGuessValueInputRef = useRef<HTMLInputElement | null>(null);

  const [wordIndex, setWordIndex] = useState(0);
  const [wordGuessValue, setWordGuessValue] = useState("");
  const [wordGuessResult, setWordGuessResult] =
    useState<WordGuessResult | null>();

  const word = WORDS[wordIndex];

  const goToNextWord = () => {
    if (wordIndex + 1 >= WORDS.length)
      return alert("Congrats, you practiced all words!");

    setWordIndex(wordIndex + 1);
    setWordGuessValue("");
    setWordGuessResult(null);
  };

  useEffect(() => {
    if (wordGuessResult === WordGuessResult.Match)
      setTimeout(goToNextWord, 300);
    else if (wordGuessResult) continueButtonRef.current?.focus();
  }, [wordGuessResult]);

  useEffect(() => {
    wordGuessValueInputRef.current?.focus();
  }, [wordIndex]);

  const handleWordIndexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWordIndex = parseInt(e.target.value) - 1;

    if (newWordIndex <= 0) setWordIndex(0);
    else if (newWordIndex >= WORDS.length) setWordIndex(WORDS.length - 1);
    else setWordIndex(newWordIndex);
  };

  const handleWordGuessValueChange = (e: ChangeEvent<HTMLInputElement>) =>
    setWordGuessValue(e.target.value);

  const handleGuessFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    setWordGuessResult(
      getWordGuessResult(word.wordTranslation, wordGuessValue)
    );

    e.preventDefault();
    e.stopPropagation();
  };

  const handleContinueClick = () => goToNextWord();

  const shouldShowAnswer =
    !!wordGuessResult &&
    [WordGuessResult.PartialMatch, WordGuessResult.Incorrect].includes(
      wordGuessResult
    );
  const shouldDisableForm = !!wordGuessResult || shouldShowAnswer;

  return (
    <div className={styles.container}>
      <Head>
        <title>Language Learning Helper | Practice</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Grid spacing={2} className={styles.gridRoot} container>
          <Grid xs={12} item>
            <TextField
              type="number"
              value={wordIndex + 1}
              onChange={handleWordIndexChange}
              label="Word #"
            />
          </Grid>
          <Grid xs={12} item>
            <Card
              elevation={0}
              className={classNames(styles.wordCard, {
                [styles.wordCardMatch]:
                  wordGuessResult === WordGuessResult.Match,
                [styles.wordCardPartialMatch]:
                  wordGuessResult === WordGuessResult.PartialMatch,
                [styles.wordCardIncorrect]:
                  wordGuessResult === WordGuessResult.Incorrect,
              })}
            >
              <CardContent className={styles.wordCardContent}>
                <div>
                  <Typography variant="subtitle1" component="div">
                    Word
                  </Typography>
                  <Typography variant="h4">
                    {word.word}
                    {shouldShowAnswer && (
                      <>
                        &nbsp;
                        <ArrowForwardIcon />
                        &nbsp;
                        {word.wordTranslation}
                      </>
                    )}
                  </Typography>
                </div>
                <form onSubmit={handleGuessFormSubmit}>
                  <fieldset
                    className={styles.fieldset}
                    disabled={shouldDisableForm}
                  >
                    <Paper elevation={0}>
                      <TextField
                        inputRef={wordGuessValueInputRef}
                        type="string"
                        value={wordGuessValue}
                        onChange={handleWordGuessValueChange}
                        label="Translation"
                        variant="filled"
                        className={styles.wordGuessTextField}
                        InputProps={{
                          className: styles.wordGuessTextFieldInput,
                        }}
                        fullWidth
                      />
                    </Paper>
                  </fieldset>
                </form>
              </CardContent>
              {shouldShowAnswer && (
                <CardActions className={styles.wordCardActions}>
                  <Button
                    ref={continueButtonRef}
                    color="inherit"
                    endIcon={<ChevronRightIcon />}
                    onClick={handleContinueClick}
                    disableFocusRipple
                  >
                    Continue
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Practice;