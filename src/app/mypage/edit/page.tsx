"use client";
import React from "react";
import UserForm from "@/components/user-form";

const EditPage = () => {
  return (
    <div className="w-full max-w-md p-8 border rounded-lg shadow-md bg-white">
      <UserForm onSubmit={() => {}} isEditPage={true} />
    </div>
  );
};

export default EditPage;
