import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getKakaoToken } from "../../store/authSlice";
import { PATH } from "../../constants/path";

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 중복 호출 방지를 위한 ref
  const isProcessed = useRef(false);

  useEffect(() => {
    if (code && !isProcessed.current) {
      isProcessed.current = true; // 처리됨 표시

      // @ts-ignore
      dispatch(getKakaoToken(code)).then((unwrapResult: any) => {
        if (unwrapResult.meta.requestStatus === "fulfilled") {
          // 로그인 성공 시 메인으로 이동
          navigate(PATH.MAIN);
        } else {
          // 실패 시 로그인 페이지로 이동
          alert("카카오 로그인 실패");
          navigate(PATH.AUTH.LOGIN);
        }
      });
    }
  }, [code, dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl font-bold text-gray-700">
        카카오 로그인 처리 중입니다...
      </p>
    </div>
  );
};

export default KakaoCallback;
