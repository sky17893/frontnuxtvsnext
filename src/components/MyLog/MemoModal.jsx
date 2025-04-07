import React, { useState, useEffect } from "react";

const MemoModal = ({ isOpen, onClose, onSave, memoData }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [notificationDate, setNotificationDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      // 메모 모달이 열렸음을 알림
      window.dispatchEvent(
        new CustomEvent("memoModalState", { detail: { isOpen: true } })
      );
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      // 메모 모달이 닫혔음을 알림
      window.dispatchEvent(
        new CustomEvent("memoModalState", { detail: { isOpen: false } })
      );
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      // 컴포넌트가 언마운트될 때 메모 모달이 닫혔음을 알림
      window.dispatchEvent(
        new CustomEvent("memoModalState", { detail: { isOpen: false } })
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (memoData) {
      setTitle(memoData.title || "");
      setContent(memoData.content || "");
      setIsNotificationEnabled(memoData.notification || false);
      setNotificationDate(memoData.event_date || "");
    } else {
      setTitle("");
      setContent("");
      setIsNotificationEnabled(false);
      setNotificationDate("");
    }
  }, [memoData]);

  const handleSave = () => {
    let hasError = false;
    setTitleError("");
    setContentError("");
    setDateError("");

    if (!title.trim()) {
      setTitleError("제목을 입력해주세요.");
      hasError = true;
    }
    if (!content.trim()) {
      setContentError("내용을 입력해주세요.");
      hasError = true;
    }
    if (isNotificationEnabled && !notificationDate) {
      setDateError("알림 날짜를 선택해주세요.");
      hasError = true;
    }

    if (hasError) return;

    onSave({
      id: memoData?.id || null,
      title,
      content,
      event_date: isNotificationEnabled ? notificationDate : null,
      notification: isNotificationEnabled,
    });
    onClose();
  };

  const handleNotificationChange = (e) => {
    setIsNotificationEnabled(e.target.checked);
    if (!e.target.checked) {
      setNotificationDate("");
      setDateError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="fixed inset-0 bg-black/40 pointer-events-auto z-[30]">
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>
      <div className="container mx-auto relative z-[60]">
        <div className="left-layout bg-[#f7f6f4] rounded-xl w-[900px] h-[820px] p-8 border border-Main mt-[65px] pointer-events-auto relative">
          {/* 상단 제목과 버튼 */}
          <div className="relative mb-20">
            <h2 className="absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
              {memoData ? "메모 수정" : "새 메모 작성"}
            </h2>
          </div>

          {/* 구분선 */}
          <div className="border-b border-1 border-Main shadow-sm mb-6"></div>

          {/* 알림 설정 영역 */}
          <div className="flex justify-end h-[20px]">
            <div className="flex items-center gap-2">
              {dateError && <p className="text-sm text-red-500">{dateError}</p>}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notification"
                  checked={isNotificationEnabled}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 border-gray-300 rounded focus:ring-Main"
                />
                <label
                  htmlFor="notification"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  알림 설정
                </label>
              </div>
              {isNotificationEnabled && (
                <div className="flex flex-col">
                  <input
                    type="date"
                    value={notificationDate}
                    onChange={(e) => {
                      setNotificationDate(e.target.value);
                      setDateError("");
                    }}
                    min={new Date().toISOString().slice(0, 10)}
                    className={`px-3 py-1.5 border ${
                      dateError ? "border-red-500" : "border-gray-300"
                    } rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-Main bg-white`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 메모 입력 영역 */}
          <div className="h-[600px]">
            {/* 제목 입력 영역 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500">*</span>
                <label className="block text-lg font-semibold">제목</label>
                {titleError && (
                  <p className="text-sm text-red-500 ml-2">{titleError}</p>
                )}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  if (newTitle.length <= 24) {
                    setTitle(newTitle);
                    setTitleError("");
                  }
                }}
                className={`w-full p-3 border-b-2 ${
                  titleError ? "border-red-500" : "border-gray-300"
                } focus:border-Main focus:outline-none text-lg bg-transparent`}
                placeholder="제목을 입력해주세요. (24자 이내)"
                autoFocus
              />
            </div>

            {/* 내용 입력 영역 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500">*</span>
                <label className="block text-lg font-semibold">내용</label>
                {contentError && (
                  <p className="text-sm text-red-500 ml-2">{contentError}</p>
                )}
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setContentError("");
                }}
                className={`w-full h-[450px] p-6 border-2 rounded-lg resize-none ${
                  contentError ? "border-red-500" : "border-gray-300"
                } focus:border-Main focus:outline-none text-lg bg-transparent`}
                placeholder="내용을 입력해주세요."
              />
            </div>

            <div className="flex justify-center gap-5 mt-[15px]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 bg-white hover:text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-Main text-white rounded-lg hover:bg-Main_hover"
              >
                {memoData ? "수정" : "저장"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoModal;
