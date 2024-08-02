import axios from "axios";

export default async function fetchHtml(url: string) {
  const urlTOHtml = "src/html/";
  const html = (await axios.get(urlTOHtml + url)).data;

  return html;
}
