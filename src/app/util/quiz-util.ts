import { CategoriesObj, Category } from "../data.models";
import { splitFirst } from "./string-util";

/**
 *
 * @param categories categories to parse
 * @returns indexed List of categories with subcategories
 */
export function parseCategories(categories: Category[]): Category[] {
  const categoriesObj = categories.reduce((categoriesObj: CategoriesObj, category) => {
    const {id, name} = category;
    const splittedName = splitFirst(name, ':');
    const categoryName = splittedName[0];
    const hasSub = splittedName.length > 1;

    const newCategory = {
      id: !hasSub ? id : splittedName[0],
      name: splittedName[0],
      subCategories: [
        ...( hasSub ? [{id, name: splittedName[1], subCategories: []}] : [] )
      ]
    }

    if (categoryName in categoriesObj) {
      categoriesObj[categoryName].subCategories.push(...newCategory.subCategories);
    } else {
      categoriesObj[categoryName] = newCategory;
    }

    return categoriesObj;
  }, {});
  return Object.values(categoriesObj);
}
