interface Category {
  idCategory: string;
  strCategory: string;
}

interface Meal {
  idMeal: string;
  strMeal: string;
}

export interface MealDetail {
  id: string;
  label: string;
  thumb: string;
  category: string;
  area: string;
  tags: string[];
  youtube: string;
  instructions: string;
  ingredients: string[];
}

export interface Item {
  id: string;
  label: string;
}

const API_URL = "https://www.themealdb.com/api/json/v1/1";

export async function fetchCategories(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/categories.php`);
  const data = (await response.json()) as { categories: Category[] };
  return data.categories.slice(0, 5).map((category) => ({
    id: category.idCategory,
    label: category.strCategory,
  }));
}

export async function fetchMeals({
  category,
  ingredient,
}: {
  category: string;
  ingredient: string;
}): Promise<Item[]> {
  let url = `${API_URL}/filter.php?`;
  if (category) {
    url += `c=${category}`;
  } else if (ingredient) {
    url += `i=${ingredient}`;
  }
  const response = await fetch(url);
  const data = (await response.json()) as { meals: Meal[] };
  return data.meals.slice(0, 5).map((meal) => ({
    id: meal.idMeal,
    label: meal.strMeal,
  }));
}

export async function fetchMeal(mealId: string): Promise<MealDetail> {
  const response = await fetch(`${API_URL}/lookup.php?i=${mealId}`);
  const data = await response.json();
  let meal = data.meals[0];

  let idx = 0;
  const ingredients: string[] = [];

  for (const key in meal) {
    if (idx > 4) {
      break;
    }

    if (key.startsWith("strIngredient") && typeof meal[key] === "string") {
      ingredients.push(meal[key]);
      idx += 1;
    }
  }

  meal = {
    id: meal.idMeal,
    label: meal.strMeal,
    thumb: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    tags: meal.strTags ? meal.strTags.split(",") : [],
    youtube: meal.strYoutube,
    instructions: meal.strInstructions,
    ingredients,
  };

  return meal;
}
