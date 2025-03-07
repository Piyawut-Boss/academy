// Promotion.js
import React, { useEffect, useState } from "react";
import "./Promotion.css";
import config from '../config';

const API_BASE = config.apiBaseUrl;

function PromotionList() {
    const [allPromotions, setAllPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE}/api/promotions?populate=*`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Promotions:", data); // Check if data is fetched correctly
                if (data && data.data) {
                    const uniquePromotions = Array.from(new Map(data.data.map(promo => [promo.id, promo])).values());
                    setAllPromotions(uniquePromotions);
                    setFilteredPromotions(uniquePromotions);
                }
            })
            .catch(error => console.error("Error fetching promotions:", error));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % filteredPromotions.length);
        }, 3000); // เลื่อนอัตโนมัติทุก 3 วินาที
        return () => clearInterval(interval);
    }, [filteredPromotions]);

    const searchPromotions = () => {
        if (searchTerm.trim() === "") {
            setFilteredPromotions(allPromotions); // Reset to show all if search is empty
            return;
        }

        const searchText = searchTerm.toLowerCase();
        const results = allPromotions.filter(promo =>
            promo.PromitionName?.toLowerCase().includes(searchText) ||
            promo.Discription?.toLowerCase().includes(searchText) ||
            promo.CodeName?.toLowerCase().includes(searchText)
        );
        setFilteredPromotions(results);
        setCurrentPage(1);
    };

    const updateSearchTerm = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Reset to show all if search is empty
        if (value.trim() === "") {
            setFilteredPromotions(allPromotions);
        } else {
            searchPromotions(); // Filter results
        }
    };

    const handleSearchClick = () => {
        setIsSearchClicked(true);
        setTimeout(() => setIsSearchClicked(false), 200);
        searchPromotions(); // Search on button click
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);

    const getPromotionImage = (promo) => {
        if (promo.PromotePromo?.url) {
            return `${API_BASE}${promo.PromotePromo.url}`;
        }
        return `${API_BASE}/api/promotions?populate=PromotePromo`;
    };

    return (
        <div className="container">
            <header className="header">
                <h1 className="title">โปรโมชั่น</h1>
                <h2 className="subtitle">HAPPY LEARNING ACADEMY</h2>
            </header>

            <div className="search-slider-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="ค้นหาโปรโมชั่น..."
                        value={searchTerm}
                        onChange={updateSearchTerm}  // Real-time search
                        className="search-input"
                    />
                    <button
                        onClick={handleSearchClick}
                        className={`search-button ${isSearchClicked ? "clicked" : ""}`}
                    >
                        ค้นหา
                    </button>
                </div>

                <div className="slider-container">
                    <div className="slider-wrapper">
                        <div
                            className="slider"
                            style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: "transform 0.5s ease-in-out" }}
                        >
                            {filteredPromotions.length > 0 && filteredPromotions.map((promo, index) => (
                                <div key={index} className={`slide ${index % 2 === 0 ? "even" : "odd"}`}>
                                    <img
                                        src={getPromotionImage(promo)}
                                        alt={promo.PromitionName || "ไม่มีชื่อโปรโมชัน"}
                                        className="slider-image"
                                    />
                                    <div className="slider-details">
                                        <h2 className="slider-title">{promo.PromitionName || "ไม่มีชื่อโปรโมชัน"}</h2>
                                        <p className="slider-description">{promo.Discription || "ไม่มีรายละเอียดโปรโมชัน"}</p>
                                        <p className="slider-discount">ส่วนลด: {promo.Discount}%</p>
                                        <p className="slider-code">รหัสโปรโมชั่น: {promo.CodeName || "ไม่มีรหัส"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="slider-indicators">
                            {filteredPromotions.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${index === currentSlide ? "active" : ""}`}
                                    onClick={() => setCurrentSlide(index)}
                                >
                                    •
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {currentItems.length > 0 ? (
                currentItems.map((promo, index) => {
                    return (
                        <div key={promo.id} className={`promotion-item ${index % 2 === 0 ? "even" : "odd"}`}>
                            <img
                                src={getPromotionImage(promo)}
                                alt={promo.PromitionName || "ไม่มีชื่อโปรโมชัน"}
                                className="promotion-image"
                            />
                            <div className="promotion-details">
                                <h2 className="promotion-title">{promo.PromitionName || "ไม่มีชื่อโปรโมชัน"}</h2>
                                <p className="promotion-description">{promo.Discription || "ไม่มีรายละเอียดโปรโมชัน"}</p>
                                <p className="promotion-discount">ส่วนลด: {promo.Discount}%</p>
                                <p className="promotion-code">รหัสโปรโมชั่น: {promo.CodeName || "ไม่มีรหัส"}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="no-results">❌ ไม่พบโปรโมชั่นที่ค้นหา</p>
            )}
        </div>
    );
}

export default PromotionList;