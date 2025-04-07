import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { GrCircleQuestion } from "react-icons/gr";
import FAQdata from "../constants/FAQdata";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(FAQdata.length / itemsPerPage);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    scrollToTop(); // FAQ 항목 클릭 시 맨 위로 스크롤
  };

  // 페이지네이션 클릭 시 페이지 이동 및 열린 답변 닫기
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenIndex(null);
    scrollToTop(); // 페이지네이션 클릭 시 맨 위로 스크롤
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  const displayedFAQs = FAQdata.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container !mt-[100px] !mb-[60px]">
      <div className="left-layout">
        <div className="flex items-center gap-4 mx-[-100px]">
          <GrCircleQuestion className="text-6xl text-black" />
          <p className="text-2xl font-medium">자주 묻는 질문</p>
        </div>

        <div className="mx-[-100px] mt-10">
          <div className="w-[84%] border-t border-b border-gray-200 py-2 space-y-4">
            {displayedFAQs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  className={`w-full py-4 flex justify-between items-center text-left 
                              relative group transition-all duration-300
                              hover:pl-4 hover:bg-gray-50 rounded-lg
                              ${openIndex === index ? "pl-4 bg-gray-50" : ""}`}
                  onClick={() => toggleAnswer(index)} // 클릭 시 toggleAnswer 호출
                >
                  <span
                    className="text-lg font-medium text-black
                                  transition-colors duration-300 flex items-center gap-2"
                  >
                    <span
                      className={`transition-opacity duration-300
                                     ${openIndex === index
                                         ? "opacity-100"
                                         : "opacity-0 group-hover:opacity-100"
                                     }`}
                    >
                      •
                    </span>
                    {faq.question}
                  </span>
                  <IoIosArrowDown
                    className={`transform transition-all duration-300 
                                ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 pb-4" : "max-h-0"}`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-10 space-x-2 ml-[-120px]">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === num + 1
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => paginate(num + 1)} // 페이지네이션 클릭 시 paginate 호출
              >
                {num + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="right-layout"></div>
    </div>
  );
};

export default FAQ;
