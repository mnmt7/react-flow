import { MealDetail } from "../api/meals";
import Tag from "./Tag";

interface SidebarProps {
  meal: MealDetail;
  closePanel: () => void;
}

export default function Sidebar({ meal, closePanel }: SidebarProps) {
  const { label, thumb, category, area, tags, youtube, instructions } = meal;

  return (
    <>
      <header className="border-b-2 p-3 border-gray-200 border-solid flex justify-between items-center">
        <p>{label}</p>
        <button onClick={closePanel}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>
      <div className="p-3 text-sm">
        <div>
          <img src={thumb} alt="" height={372} />
        </div>
        {tags && (
          <ul className="flex gap-1 my-3">
            {tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-2 text-[14px] mb-4">
          <p className="grid grid-cols-[3fr_4fr]">
            <span className="text-gray-600">Category</span>
            <span className="text-gray-800">{category}</span>
          </p>
          <p className="grid grid-cols-[3fr_4fr]">
            <span className="text-gray-600">Area</span>
            <span className="text-gray-800">{area}</span>
          </p>
          <p className="grid grid-cols-[3fr_4fr]">
            <span className="text-gray-600">Youtube</span>
            <a href={youtube} className="underline text-[14px]" target="_blank">
              {youtube}
            </a>
          </p>
          <p className="grid grid-cols-[3fr_4fr]">
            <span className="text-gray-600">Recipe</span>
            <a
              href={youtube}
              className="underline text-[14px]"
              target="_blank"
            >{`https://www.bbcgoodfood.com/recipes/`}</a>
          </p>
        </div>

        <div className="border-solid border-2 border-gray-300 p-2">
          <p className="font-medium mb-2">Instructions</p>
          <p className="text-sm">{instructions}</p>
        </div>
      </div>
    </>
  );
}
