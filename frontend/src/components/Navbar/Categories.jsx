import { FaMountain, FaSnowflake, FaCity, FaFire } from "react-icons/fa";
import { GiCastle, GiFarmTractor, GiCampingTent, GiBoatFishing, GiForestCamp } from "react-icons/gi";
import { MdOutlinePool, MdApartment } from "react-icons/md";

const categoriesData = [
  { label: "Trending", icon: <FaFire /> },
  { label: "Rooms", icon: <MdApartment /> },
  { label: "Iconic cities", icon: <FaCity /> },
  { label: "Mountains", icon: <FaMountain /> },
  { label: "Castles", icon: <GiCastle /> },
  { label: "Amazing pools", icon: <MdOutlinePool /> },
  { label: "Camping", icon: <GiCampingTent /> },
  { label: "Farms", icon: <GiFarmTractor /> },
  { label: "Arctic", icon: <FaSnowflake /> },
  { label: "Boats", icon: <GiBoatFishing /> },
  { label: "Domes", icon: <GiForestCamp /> },
];

const Categories = ({ selectedCategory, onCategoryClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex z-0 items-center gap-8 overflow-x-auto pb-4 no-scrollbar">
        {categoriesData.map((cat) => (
          <div 
            key={cat.label} 
            onClick={() => onCategoryClick(cat.label)} 
            className={`flex flex-col items-center gap-2 min-w-[64px] cursor-pointer group transition ${
              selectedCategory === cat.label 
              ? 'text-black border-b-2 border-black pb-2' 
              : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200 pb-2'
            }`}
          >
            <div className="text-2xl group-hover:scale-110 transition">{cat.icon}</div>
            <span className="text-xs font-semibold whitespace-nowrap">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;