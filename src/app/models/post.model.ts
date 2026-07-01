export class Post {
  id: number;
  title: string;
  content: string;
  author: string;
  datePosted: Date;

  constructor(id: number, title: string, content: string, author: string, datePosted: Date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.datePosted = datePosted;
  }
}
