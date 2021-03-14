import { fetchData, drawCategoriesNav, drawCartItem } from "./functions.js";

fetchData().then((menuResult) => {
  drawCartItem();
  drawCategoriesNav(menuResult);
});
