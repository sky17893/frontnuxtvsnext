import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import openLicenseImg from "../../assets/open_license.jpg";
import { TbCircleLetterQFilled, TbCircleLetterA } from "react-icons/tb";
import { fetchConsultationDetail } from "./consultaionApi";
import loadingGif from "../../assets/loading.gif";
import { useCreateViewedMutation } from "../../redux/slices/historyApi";
import { useSelector } from "react-redux";

const ConsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [createViewed] = useCreateViewedMutation();

  const [consultation, setConsultation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewedSaved, setIsViewedSaved] = useState(false);

  // ✅ 상담 사례 열람 기록 저장
  useEffect(() => {
    const saveViewHistory = async () => {
      if (!user?.id || !id || isViewedSaved) {
        return;
      }

      try {
        console.log("ConsDetail - 열람 기록 저장 시도:", {
          시간: new Date().toISOString(),
          user_id: user.id,
          consultation_id: id,
        });

        await createViewed({
          user_id: user.id,
          consultation_id: id,
          precedent_id: null,
        }).unwrap();

        setIsViewedSaved(true);
        console.log("ConsDetail - 열람 기록 저장 성공");
      } catch (error) {
        console.error("ConsDetail - 열람 기록 저장 실패:", error);
      }
    };

    saveViewHistory();
  }, [id, user, createViewed, isViewedSaved]);

  // 페이지 진입 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchConsultationDetail(id);
        setConsultation(data);
      } catch (error) {
        console.error("상담 상세 정보를 가져오는데 실패했습니다:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchConsultation();
    }
  }, [id]);

  // 뒤로가기 핸들러 수정
  const handleGoBack = () => {
    sessionStorage.setItem("fromDetail", "true");
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="left-layout">
          <div className="px-0 pt-32 pb-10">
            <div className="flex flex-col justify-center items-center h-[790px] border border-gray-300 rounded-3xl">
              <img src={loadingGif} alt="loading" className="w-16 h-16" />
              <p className="text-lg text-gray-600 mt-4">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="left-layout">
          <div className="px-0 pt-32 pb-10">
            <div className="flex justify-center items-center h-[790px] border border-gray-300 rounded-3xl">
              <p className="text-lg text-red-600">
                오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="container min-h-screen">
        <div className="left-layout">
          <div className="px-0 pt-32 pb-10">
            <div className="flex justify-center items-center h-[790px] border border-gray-300 rounded-3xl">
              <p className="text-lg text-gray-600">
                상담 내용을 찾을 수 없습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="left-layout">
        <div className="px-0 pt-[120px] pb-10">
          {/* 뒤로가기 버튼 수정 */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 mb-4 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>목록으로</span>
          </button>

          {/* 상단 정보 영역 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {/* 구분 */}
            <div className="flex border-b border-gray-100 pb-4 mb-4">
              <span className="text-sm text-gray-500 w-20">구분</span>
              <span className="text-sm text-black">
                {consultation.category}
              </span>
            </div>

            {/* 제목 */}
            <div className="flex">
              <span className="text-sm text-gray-500 w-20">제목</span>
              <span className="text-sm text-black font-medium">
                {consultation.title}
              </span>
            </div>
          </div>

          {/* 질문 영역 */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center text-base font-semibold text-gray-900">
                <TbCircleLetterQFilled className="w-8 h-8 mr-2 text-black text-2xl" />
                질문
              </div>
              <div className="text-sm text-gray-500 ml-2">
                {consultation.date}
              </div>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {consultation.question}
            </div>
          </div>

          {/* 답변 영역 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center text-base font-semibold text-gray-900 mb-4">
              <TbCircleLetterA className="w-8 h-8 mr-2 text-black text-2xl" />
              답변
            </div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {consultation.answer}
            </div>
          </div>

          {/* 공공누리 유형 */}
          <div className="mt-8 flex items-center gap-2">
            <img src={openLicenseImg} alt="공공누리" className="h-6" />
            <span className="text-sm text-gray-500">
              대한법률구조공단의 해당 저작물은 "공공누리 4유형(출처표시)" 조건에
              따라 누구나 이용할 수 있습니다.
            </span>
          </div>
        </div>
      </div>
      <div className="right-layout">{/* 빈 공간으로 남겨둠 */}</div>
    </div>
  );
};

export default ConsDetail;
