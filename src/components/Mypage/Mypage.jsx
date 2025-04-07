import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import MemoPopup from "./MemoPopup";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import MemoDetailPopup from "./MemoDetailPopup";
import { FaRegBell, FaBell, FaExchangeAlt } from "react-icons/fa";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";

const Mypage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated); // Redux 인증 상태 사용
  const [memos, setMemos] = useState([]); // 빈 배열로 시작
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [memoToDelete, setMemoToDelete] = useState(null);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState("recent");
  const [sortOrder, setSortOrder] = useState("latest");

  // 새 메모 추가
  const handleAddMemo = () => {
    setEditingMemo(null); // 새 메모 생성 모드
    setIsPopupOpen(true);
  };

  // 메모 수정 모드
  const handleEditClick = (memo) => {
    setEditingMemo({
      ...memo,
      isNotificationEnabled: memo.isNotificationEnabled, // 기존 메모의 알림 설정 상태 유지
      notificationDate: memo.notificationDate, // 기존 메모의 알림 날짜 유지
    });
    setIsPopupOpen(true);
  };

  // 팝업에서 메모 저장
  const handleSaveMemo = (memoData) => {
    if (editingMemo) {
      // 기존 메모 수정
      setMemos(
        memos.map((memo) =>
          memo.id === editingMemo.id
            ? {
                ...memo,
                title: memoData.title,
                content: memoData.content,
                isNotificationEnabled: memoData.isNotificationEnabled,
                notificationDate: memoData.notificationDate,
                updatedAt: new Date().toISOString(),
              }
            : memo
        )
      );
    } else {
      // 새 메모 추가
      const newMemoId = Date.now();
      setMemos([
        ...memos,
        {
          id: newMemoId,
          title: memoData.title,
          content: memoData.content,
          isNotificationEnabled: memoData.isNotificationEnabled,
          notificationDate: memoData.notificationDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
    setIsPopupOpen(false);
    setEditingMemo(null);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 메모 삭제
  const handleDeleteClick = (memo) => {
    setMemoToDelete(memo);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    setMemos(memos.filter((memo) => memo.id !== memoToDelete.id));
    setIsDeletePopupOpen(false);
    setMemoToDelete(null);
  };

  // 메모 클릭 핸들러
  const handleMemoClick = (memo) => {
    setSelectedMemo(memo);
    setIsDetailPopupOpen(true);
  };

  // 상세보기에서 수정 버튼 클릭 시
  const handleDetailEdit = () => {
    setIsDetailPopupOpen(false);
    handleEditClick(selectedMemo); // 동일한 handleEditClick 함수 사용
  };

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 메모 필터링 로직 수정
  const filteredMemos = [...memos]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    })
    .filter(
      (memo) =>
        viewMode === "recent" ||
        (viewMode === "notification" && memo.isNotificationEnabled)
    );

  return (
    <div className="min-h-screen w-full">
      <div className="container min-h-[100vh]">
        <div className="left-layout">
          <div className="px-0 pt-[135px] pb-10">
            {/* 메모장 섹션 */}
            <div className="mb-8">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-[#f5f4f2]">
                <div className="border-b border-gray-300 p-2 flex items-center bg-[#a7a28f]">
                  <div className="flex items-center gap-4 ml-4 w-[100px]">
                    {/* 정렬 토글 버튼 - 아이콘 스타일 */}
                    <button
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "latest" ? "oldest" : "latest"
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-white opacity-80 hover:opacity-100 transition-all"
                    >
                      <FaExchangeAlt
                        className={`transition-transform duration-300 ${
                          sortOrder === "oldest" ? "rotate-180" : ""
                        }`}
                      />
                      <span className="font-medium w-[60px]">
                        {sortOrder === "latest" ? "최신순" : "오래된순"}
                      </span>
                    </button>
                  </div>

                  <h2 className="font-medium text-white flex-1 text-center">
                    메모장
                  </h2>

                  <div className="flex items-center gap-4 mr-4">
                    {/* 기존 토글 버튼 */}
                    <div className="flex bg-white rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("recent")}
                        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                          viewMode === "recent"
                            ? "bg-[#8b7b6e] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        기록
                      </button>
                      <button
                        onClick={() => setViewMode("notification")}
                        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                          viewMode === "notification"
                            ? "bg-[#8b7b6e] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        알림
                      </button>
                    </div>
                    {/* 메모 추가 버튼 */}
                    <button
                      onClick={handleAddMemo}
                      className="px-4 py-1.5 bg-gray-100 text-black text-sm rounded-md hover:bg-gray-200 transition-colors"
                    >
                      메모 추가
                    </button>
                  </div>
                </div>
                <div className="h-[400px] p-4 overflow-y-auto">
                  {/* 메모 카드 리스트 */}
                  <div className="grid grid-cols-3 gap-6">
                    {filteredMemos.length === 0 ? (
                      <div className="col-span-4 text-center text-gray-500 mt-[150px]">
                        메모가 없습니다. 새 메모를 추가해보세요!
                      </div>
                    ) : (
                      filteredMemos.map((memo) => (
                        <div
                          key={memo.id}
                          onClick={() => handleMemoClick(memo)}
                          className={`group relative ${
                            memo.isNotificationEnabled
                              ? "bg-[#ffb9a3]"
                              : "bg-[#f3d984]"
                          } border-b-4 border-r-4 border-gray-300 rounded-sm h-[170px] transform rotate-[-1deg] hover:rotate-0 transition-all duration-200 hover:shadow-md cursor-pointer`}
                          style={{
                            boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                          }}
                        >
                          {/* 알림 아이콘 - 클릭 이벤트 제거하고 표시만 */}
                          <div className="absolute top-1 right-1 p-1.5 text-[#8b7b6e]">
                            {memo.isNotificationEnabled ? (
                              <FaBell size={16} />
                            ) : (
                              <FaRegBell size={16} />
                            )}
                          </div>

                          {/* 메모 핀 장식 */}
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6  bg-[#bd0000]  rounded-full shadow-md z-10">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#9d0000] rounded-full"></div>
                          </div>

                          {/* 메모 내용 */}
                          <div className="h-full flex flex-col p-4 pt-2">
                            {/* 저장/수정 날짜 - 좌측 상단 */}
                            <div className="text-[13px] text-[#828282] font-thin mb-2">
                              {formatDate(memo.updatedAt)}
                            </div>

                            <h3 className="font-bold text-[#5d4d40] mb-2 text-md">
                              {memo.title}
                            </h3>
                            <div className="flex-1 text-xs text-[#5d4d40] line-clamp-2 overflow-hidden max-h-[2.6em]">
                              {memo.content}
                            </div>

                            {/* 알림 설정 날짜 - 좌측 하단 */}
                            {memo.isNotificationEnabled && (
                              <div className="absolute bottom-2 left-4 text-[13px] text-[#828282] font-thin">
                                알림: {formatDate(memo.notificationDate)}
                              </div>
                            )}

                            {/* 버튼 그룹 */}
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-2 flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // 이벤트 전파 중지
                                  handleEditClick(memo);
                                }}
                                className="p-1.5 text-[#8b7b6e] hover:text-[#5d4d40] rounded-full hover:bg-[#ffe4b8] transition-all duration-200 flex items-center gap-1"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // 이벤트 전파 중지
                                  handleDeleteClick(memo);
                                }}
                                className="p-1.5 text-red-400 hover:text-red-500 rounded-full hover:bg-[#ffe4b8] transition-all duration-200"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 열람목록 섹션 */}
            <div>
              <div className="border border-gray-300 rounded-lg bg-[#f5f4f2] overflow-hidden">
                <div className="border-b border-gray-300 p-2 bg-[#a7a28f] text-white">
                  <h2 className="text-center font-medium">열람목록</h2>
                </div>
                <div className="h-[250px] p-4 overflow-y-auto">
                  {/* 열람 목록이 없는 경우 */}
                  <div className="text-center text-gray-500 mt-[120px]">
                    열람한 내역이 없습니다.
                  </div>

                  {/* 열람 목록이 있는 경우 아래 형식으로 표시 */}
                  {/* <div className="border-b border-gray-200 py-2">
                    <p className="text-sm">열람한 항목 제목</p>
                    <p className="text-xs text-gray-500">열람 날짜</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-layout">{/* 빈 공간으로 남겨둠 */}</div>
        <MemoPopup
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setEditingMemo(null);
          }}
          onSave={handleSaveMemo}
          initialTitle={editingMemo?.title || ""}
          initialContent={editingMemo?.content || ""}
          initialNotification={
            editingMemo ? editingMemo.isNotificationEnabled : false
          } // 수정 시에는 기존 상태 유지
          initialNotificationDate={
            editingMemo ? editingMemo.notificationDate : null
          } // 수정 시에는 기존 날짜 유지
        />
        <DeleteConfirmPopup
          isOpen={isDeletePopupOpen}
          onClose={() => {
            setIsDeletePopupOpen(false);
            setMemoToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
        <MemoDetailPopup
          isOpen={isDetailPopupOpen}
          memo={selectedMemo}
          onClose={() => {
            setIsDetailPopupOpen(false);
            setSelectedMemo(null);
          }}
          onEdit={handleDetailEdit}
        />
      </div>
    </div>
  );
};

export default Mypage;
