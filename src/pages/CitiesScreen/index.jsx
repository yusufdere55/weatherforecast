import React from "react";
import cities from '../../assets/data/cities';
import { NavLink } from "react-router";

const CitiesScreen = () =>{
    return(
        <div className="w-full h-full bg-black/50 flex flex-row gap-2 justify-center items-center flex-wrap p-4">
           {cities.map(item =>(
                <NavLink
                    key={item.plaka}
                    to={`detail/${item.plaka}`} 
                    className="w-60 h-14 bg-white/20 rounded flex flex-row gap-4 justify-between items-center px-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center text-black font-semibold">
                        {item.plaka}
                    </div>
                    <div className="flex-1 font-semibold">
                        {item.il_adi}
                    </div>
                </NavLink>
            ))}
        </div>
    )

}

export default CitiesScreen

