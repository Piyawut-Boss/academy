// Promotion.js
import React, { useEffect, useState } from "react";

function Promotion() {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchClicked, setIsSearchClicked] = useState(false);

    useEffect(() => {
        fetch("http://localhost:1337/api/promotions")
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    // ทำซ้ำรายการ 3 ครั้ง
                    const repeatedPromotions = Array(3).fill(data.data).flat();
                    setPromotions(repeatedPromotions);
                    setFilteredPromotions(repeatedPromotions);
                }
            })
            .catch(error => console.error("Error fetching promotions:", error));
    }, []);

    const handleSearch = () => {
        setIsSearchClicked(true);
        setTimeout(() => setIsSearchClicked(false), 200);

        if (searchTerm.trim() === "") {
            setFilteredPromotions(promotions);
            return;
        }

        const searchText = searchTerm.toLowerCase();
        const results = promotions.filter(promo =>
            promo.PromitionName?.toLowerCase().includes(searchText) ||
            promo.Discription?.toLowerCase().includes(searchText) ||
            promo.CodeName?.toLowerCase().includes(searchText)
        );
        setFilteredPromotions(results);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredPromotions(promotions);
        }
    };

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
            <header className="header" style={{ textAlign: "center" }}>
                <h1 className="title" style={{ marginBottom: "20px" }}>โปรโมชั่น</h1>
                <h2 style={{ color: "#FFC900", fontSize: "2rem", fontWeight: "bold", marginTop: "20px" }}>
                    HAPPY LEARNING ACADEMY
                </h2>
            </header>

            {/* ✅ ค้นหา */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="ค้นหาโปรโมชั่น..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "60%"
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "10px 15px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor: isSearchClicked ? "#800080" : "#FFC900",
                        color: "#fff",
                        transition: "background-color 0.2s ease-in-out"
                    }}
                >
                    ค้นหา
                </button>
            </div>

            {/* ✅ รายการโปรโมชั่น */}
            {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promo, index) => (
                    <div key={`${promo.id}-${index}`}
                        style={{
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "20px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            backgroundColor: index % 2 === 0 ? "#CBBFE0" : "#FFF4BC",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "15px",
                            transition: "transform 0.2s ease-in-out", // ทำให้เด้งขึ้นเมื่อ hover
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} // เด้งขึ้น 5px
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"} // กลับที่เดิม
                    >
                        <img
                            src={promo.CodeName === "summer"
                                ? "http://localhost:1337/uploads/summer_3b14ccbd3e.png"
                                : "http://localhost:1337/uploads/Valentine_1200a394df.png"}
                            alt={promo.PromitionName}
                            style={{
                                width: "250px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "10px"
                            }}
                        />

                        <div style={{ flex: 1, padding: "20px", textAlign: "left" }}>
                            <h2 style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                                {promo.PromitionName || "ไม่มีชื่อโปรโมชัน"}
                            </h2>
                            <p style={{ color: "#666", fontSize: "1rem" }}>
                                {promo.Discription || "ไม่มีรายละเอียดโปรโมชัน"}
                            </p>
                            <p style={{ fontWeight: "bold", color: "#FF5733", fontSize: "1.2rem" }}>
                                ส่วนลด: {promo.Discount}%
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: "center", color: "#999", fontSize: "1.2rem" }}>
                    ❌ ไม่พบโปรโมชั่นที่ค้นหา
                </p>
            )}
        </div>
    );
}

export default Promotion;
