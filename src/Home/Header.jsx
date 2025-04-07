import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiLogin, CiUser, CiLogout } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useLogoutUserMutation } from "../redux/slices/authApi";
import {
  selectIsAuthenticated,
  selectToken,
  logout,
  selectUser,
} from "../redux/slices/authSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDarkText = location.pathname === "/" && !isScrolled;
  const textColorClass = isDarkText ? "text-white" : "text-black";
  const token = useSelector(selectToken);
  const [logoutUser] = useLogoutUserMutation();
  const user = useSelector(selectUser);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      // 메인 페이지에서만 스크롤 감지
      if (location.pathname === "/") {
        // 스크롤 위치가 800px을 넘어가면 배경 변경 (유튜브 영역까지)
        setIsScrolled(window.scrollY > 800);
      } else {
        // 다른 페이지에서는 50px 스크롤 시 배경 변경
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // 화면 크기 변경 감지하여 햄버거 메뉴 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1054) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 로그아웃 버튼 클릭 시 실행
  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (error) {
      console.error("❌ 로그아웃 API 호출 실패:", error);
    }
    dispatch(logout());
    navigate("/");
  };

  // ✅ 브라우저 종료 시 자동 로그아웃
  useEffect(() => {
    const handleUnload = (event) => {
      // 새로고침인 경우 (performance.navigation.type === 1)
      if (
        event.persisted ||
        (window.performance && window.performance.navigation.type === 1)
      ) {
        return;
      }
      logoutUser();
      dispatch(logout());
    };

    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [logoutUser, dispatch]);

  // 모달 상태 감지
  useEffect(() => {
    const handleModalState = (e) => {
      setIsModalOpen(e.detail.isOpen);
    };

    window.addEventListener("modalState", handleModalState);
    window.addEventListener("memoModalState", handleModalState);

    return () => {
      window.removeEventListener("modalState", handleModalState);
      window.removeEventListener("memoModalState", handleModalState);
    };
  }, []);

  return (
    <div className="w-full">
      {/* 어두운 배경 오버레이 - 전체 화면 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[140]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : ""
        } ${isModalOpen ? "z-[30]" : "z-[100]"}`}
      >
        <div className="px-20 w-full h-[100px] flex items-center justify-between">
          {/* Lawmang 로고 */}
          <div className="relative z-10 mb-4 pt-2">
            <Link
              to="/"
              className={`${textColorClass} text-5xl font-normal font-['Oswald']`}
            >
              Lawmang
            </Link>
          </div>

          {/* 기존 메뉴 (1054px 이상에서만 표시) */}
          <ul className="hidden items-center justify-center space-x-20 text-xl [@media(min-width:1054px)]:flex">
            <li>
              <Link
                to="/consultation"
                className={`${textColorClass} transition-all duration-300 ${
                  location.pathname === "/"
                    ? "hover:animate-text-glow"
                    : "hover:animate-text-glow-dark"
                } cursor-pointer`}
              >
                상담 사례
              </Link>
            </li>
            <li>
              <Link
                to="/precedent"
                className={`${textColorClass} transition-all duration-300 ${
                  location.pathname === "/"
                    ? "hover:animate-text-glow"
                    : "hover:animate-text-glow-dark"
                } cursor-pointer`}
              >
                판례
              </Link>
            </li>
            <li>
              <Link
                to="/template"
                className={`${textColorClass} transition-all duration-300 ${
                  location.pathname === "/"
                    ? "hover:animate-text-glow"
                    : "hover:animate-text-glow-dark"
                } cursor-pointer`}
              >
                법률 서식
              </Link>
            </li>
            <li>
              <Link
                to="/Report"
                className={`${textColorClass} transition-all duration-300 ${
                  location.pathname === "/"
                    ? "hover:animate-text-glow"
                    : "hover:animate-text-glow-dark"
                } cursor-pointer`}
              >
                AI 리포트
              </Link>
            </li>
          </ul>

          {/* 로그인/로그아웃 버튼 */}
          <div className="flex items-center gap-6 ml-20">
            {/* 기존 로그인/프로필 메뉴 (1054px 이상에서만 표시) */}
            {isAuthenticated ? (
              <div
                className="relative hidden [@media(min-width:1054px)]:inline-block"
                onMouseEnter={() => setIsProfileMenuOpen(true)}
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <button
                  className={`${textColorClass} transition-all duration-300 ${
                    location.pathname === "/"
                      ? "hover:animate-text-glow"
                      : "hover:animate-text-glow-dark"
                  } text-lg cursor-pointer flex items-center gap-2`}
                >
                  <CiUser className="w-6 h-6" />
                  <span>{user?.nickname || "사용자"}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-0 w-48 py-2 bg-white rounded-lg border border-gray-100 shadow-md z-[200]">
                    <Link
                      to="/mylog"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      사건 기록 페이지
                    </Link>
                    <Link
                      to="/modify"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      회원정보 수정
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`${textColorClass} transition-all duration-300 ${
                  location.pathname === "/"
                    ? "hover:animate-text-glow"
                    : "hover:animate-text-glow-dark"
                } text-lg cursor-pointer hidden [@media(min-width:1054px)]:flex items-center gap-2`}
              >
                <CiLogin className="w-5 h-5" />
                로그인
              </Link>
            )}

            {/* 햄버거 메뉴 버튼 (1054px 미만에서만 표시) */}
            <button
              className="text-gray-600 hover:text-Main transition-colors relative z-[40] [@media(min-width:1054px)]:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <RxHamburgerMenu className={`w-7 h-7 ${textColorClass}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 패널 */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-white transform transition-transform duration-300 ease-in-out z-[150] flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 상단 헤더와 닫기 버튼 */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 text-gray-800">
              <CiUser className="w-6 h-6" />
              <span className="font-medium">
                {user?.nickname || "사용자"}님
              </span>
            </div>
          ) : (
            <div className="text-gray-800">메뉴</div>
          )}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 transition-transform duration-300 hover:rotate-90"
          >
            <IoClose className="w-7 h-7" />
          </button>
        </div>

        {/* 메뉴 항목들 */}
        <div className="flex-1 overflow-y-auto">
          <Link
            to="/consultation"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-Main transition-colors"
          >
            상담 사례
          </Link>
          <Link
            to="/precedent"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-Main transition-colors"
          >
            판례
          </Link>
          <Link
            to="/template"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-Main transition-colors"
          >
            법률 서식
          </Link>
          <Link
            to="/Report"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-Main transition-colors"
          >
            AI 리포트
          </Link>
        </div>

        {/* 하단 메뉴 */}
        <div className="mt-auto border-t border-gray-200 p-4">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link
                to="/mylog"
                className="block w-full py-2 text-gray-600 hover:text-Main transition-colors"
              >
                사건 기록 페이지
              </Link>
              <Link
                to="/modify"
                className="block w-full py-2 text-gray-600 hover:text-Main transition-colors"
              >
                회원정보 수정
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <CiLogout className="w-5 h-5" />
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-2 text-gray-600 hover:text-white hover:bg-Main  rounded-md transition-colors"
            >
              <CiLogin className="w-5 h-5" />
              로그인
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
