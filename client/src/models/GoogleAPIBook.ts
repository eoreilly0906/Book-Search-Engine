export interface GoogleAPIBook {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
  volumeInfo: {
    authors?: string[];
    description?: string;
    title: string;
    imageLinks?: {
      thumbnail?: string;
    };
    infoLink?: string;
  };
}
