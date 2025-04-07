import React from "react";
import Logo from "../assets/icon-180.png";

const Footer = () => {
  return (
    <footer className="bg-[#e1e0df] py-16 border-t min-h-[150px]">
      <div className="container mx-auto">
        <div className="flex items-start justify-between py-4">
          {/* 로고 섹션 */}
          <div className="flex items-center mr-40 ml-[-50px]">
            <img src={Logo} alt="로망 로고" className="h-20 w-auto" />
            <div className="ml-4">
              <h2 className="text-2xl font-basic">Lawmang</h2>
            </div>
          </div>

          {/* 회사 정보 섹션 */}
          <div className="text-gray-600 text-base space-y-3">
            <p>법률쪽으로 상담이 필요하거나 궁금한 점이 있으면 언제든지 연락주세요. <br/>Lawmang상담사가 빠르고 친절하게 도와드리겠습니다!</p>
            <p>
              서울특별시 금천구 주소 가산디지털2로 144 현대테라타워 가산DK A동
              20층 2013~2018호
            </p>
            <p>&copy ©; 2025 Lawmang. All rights reserved. | Contact: admin@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
