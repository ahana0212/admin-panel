// /src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import FullScreenSkeleton from "../components/FullScreenSkeleton";
import { getALLTables } from "../apis/dashboard";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [tableList, setTableList] = useState([]);
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getTableData();
    }, [])


    const getTableData = async () => {
        try {
            setloading(true);
            const response = await getALLTables();
            setTableList(response.data)
            setloading(false)
        } catch (err) {
            console.log(err);
        }
    }

    const handleNavigate = (name) => {
        navigate(`/table/${name}`)
    }

    if (loading)
        return <FullScreenSkeleton />

    return (
        <div className="relative h-full">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {tableList?.map((table, index) => (
                    <div
                        key={index}
                        onClick={() => handleNavigate(table.name)}
                        className="p-6 bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6H20M4 12H20M4 18H12" stroke="#5E5CE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${table.count > 0 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {table.count > 0 ? 'Active' : 'In-Active'}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">{table.name.toUpperCase()}</h3>

                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Count</p>
                                <p className="text-lg font-semibold text-gray-800">{table.count}</p>
                            </div>

                            {/* <div className={`flex items-center ${table.trend > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <svg
                                    className="w-4 h-4 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {table.trend > 0 ? (
                                        <path d="M12 5L19 12L12 19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    ) : (
                                        <path d="M12 19L5 12L12 5M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    )}
                                </svg>
                                <span className="text-sm font-medium">{Math.abs(table.trend)}%</span>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Home;
