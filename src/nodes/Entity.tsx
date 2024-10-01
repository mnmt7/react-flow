import { Handle, type NodeProps, Position } from "@xyflow/react";

import { EntityNode } from "./types";
import mealIcon from "../assets/meal.png";
import categoryIcon from "../assets/category.png";
import optionIcon from "../assets/option.svg";
import ingredientIcon from "../assets/ingredient.png";
import globeIcon from "../assets/globe1.png";

export default function Entity({ data }: NodeProps<EntityNode>) {
  const src =
    data.resourceType === "meal" || data.resourceType === "tag"
      ? mealIcon
      : data.resourceType === "ingredient"
      ? ingredientIcon
      : data.resourceType === "category"
      ? categoryIcon
      : data.resourceType === "explore"
      ? globeIcon
      : optionIcon;

  let divClassName =
    "border-2 border-solid border-gray-300 rounded p-3 pr-10 w-52 flex gap-2 items-center max-h-20";
  let imgClassName = "size-6 rounded-md";

  if (
    data.resourceType.startsWith("view") ||
    data.resourceType === "meal-details"
  ) {
    divClassName += " border-gray-200 rounded-full p-[4px] pl-4";
    imgClassName = "size-4";
  }

  return (
    <div className={divClassName}>
      <Handle type="target" position={Position.Left} className="invisible" />
      <img src={src} className={imgClassName} />

      <div className="overflow-hidden whitespace-nowrap">{data.label}</div>
      <Handle type="source" position={Position.Right} className="invisible" />
    </div>
  );
}
