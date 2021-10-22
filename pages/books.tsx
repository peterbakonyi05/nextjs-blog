import React, { useCallback, useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { filter } from "rxjs";
import { PingAction, useQueryParams } from "@app/core";
import { ServerSideStore } from "@app/redux";
import { BookAction, BookSelector } from "@app/book";

import Layout from "../components/layout";
import { AppState, nextReduxWrapper } from "./_app.state";

import styles from "./books.module.scss";

export const getServerSideProps = nextReduxWrapper.getServerSideProps<{}>(
  (store) =>
    ({ req, res, query }) => {
      return (store as ServerSideStore<AppState>).handleServerSideRendering({
        init: () => {
          batch(() => {
            store.dispatch(
              BookAction.search.request({ query: query["q"] as string })
            );
            store.dispatch(PingAction.ping());
          });
        },
        onReady$: (state$) =>
          state$.pipe(filter((value) => BookSelector.isSsrReady(value))),
      });
    }
);

export const Books: React.FC = () => {
  const books = useSelector(BookSelector.books);
  const dispatch = useDispatch();
  const query = useSelector(BookSelector.query);
  const { queryParams, updateQueryParams } = useQueryParams();

  const handleSearch = useCallback((query: string) => {
    dispatch(BookAction.search.request({ query }));
  }, []);

  // initial search in case SSR does not render
  useEffect(() => {
    if (query !== queryParams.q || (!!queryParams.q && !books.length)) {
      handleSearch(queryParams.q as string);
    }
  }, []);

  // update query params whenever query changes
  useEffect(() => {
    if (query !== queryParams.q) {
      updateQueryParams({ q: query });
    }
  }, [query]);

  return (
    <Layout>
      <input
        type="search"
        value={query}
        onChange={(event) => handleSearch(event.target.value)}
      />
      <ul>
        {books?.map((book) => (
          <li key={book.id} className={styles.bookItem}>
            {book.volumeInfo.imageLinks && (
              <img src={book.volumeInfo.imageLinks.thumbnail} />
            )}
            <h3>{book.volumeInfo.title}</h3>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Books;
