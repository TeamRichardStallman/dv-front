"use client";

import React, { useState, useEffect } from "react";
import TermsSection from "@/components/term-section";
import { termsAndPrivacyData } from "@/data/privacyData";

const PrivacyPolicyModal = ({
  onConfirm,
  onCancel,
  initialTermsAgree = false,
  initialPrivacyAgree = false,
}: {
  onConfirm: (termsAgree: boolean, privacyAgree: boolean) => void;
  onCancel: () => void;
  initialTermsAgree?: boolean;
  initialPrivacyAgree?: boolean;
}) => {
  const [agreeTerms, setAgreeTerms] = useState(initialTermsAgree);
  const [agreePrivacy, setAgreePrivacy] = useState(initialPrivacyAgree);

  const isConfirmDisabled = !(agreeTerms && agreePrivacy);

  useEffect(() => {
    setAgreeTerms(initialTermsAgree);
    setAgreePrivacy(initialPrivacyAgree);
  }, [initialTermsAgree, initialPrivacyAgree]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-h-[90vh] overflow-hidden">
        <h2 className="text-xl font-bold mb-4">개인정보 동의</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
          <TermsSection
            title="서비스이용약관"
            content={termsAndPrivacyData.termsOfService}
          />
          <TermsSection
            title="개인정보동의서"
            content={termsAndPrivacyData.privacyAgreement}
          />
          <TermsSection
            title="개인정보처리방안"
            content={termsAndPrivacyData.privacyPolicy}
          />
        </div>
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agreeTerms" className="text-sm">
              서비스 이용약관에 동의합니다.
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreePrivacy"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agreePrivacy" className="text-sm">
              개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-gray-300 rounded-lg text-gray-800 mr-4"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(agreeTerms, agreePrivacy)}
            className={`py-2 px-4 rounded-lg text-white font-semibold ${
              isConfirmDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary"
            }`}
            disabled={isConfirmDisabled}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
