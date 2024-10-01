// bg should be lighter color and border should be darker variant of same color
const colors = [
  { border: "border-blue-600", bg: "bg-blue-100" },
  { border: "border-yellow-600", bg: "bg-yellow-100" },
  { border: "border-green-600", bg: "bg-green-100" },
  { border: "border-red-600", bg: "bg-red-100" },
  { border: "border-indigo-600", bg: "bg-indigo-100" },
  { border: "border-purple-600", bg: "bg-purple-100" },
  { border: "border-pink-600", bg: "bg-pink-100" },
  { border: "border-gray-600", bg: "bg-gray-100" },
  { border: "border-black", bg: "bg-white" },
];

export default function Tag({ tag }) {
  const { border, bg } = colors[Math.floor(Math.random() * colors.length)];
  return (
    <li
      className={`px-2 py-[2px] rounded-2xl m-1 border-solid border-[1px] ${border} ${bg}`}
    >
      {tag}
    </li>
  );
}
