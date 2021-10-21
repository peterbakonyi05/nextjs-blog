export interface BookState {
  isLoading: boolean;
  errorMessage?: string;
  query?: string;
  totalItems: number;
  books: Book[];
  isSsrReady: boolean;
}

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    imageLinks: {
      thumbnail: string;
    };
  };
}

export interface BooksResponse {
  items: Book[];
  totalItems: number;
}

export interface BookSearchRequestPayload {
  query: string;
}
