import { ReactNode } from "react";

type ConfirmModalProps = {
  children: ReactNode;
};

export function ConfirmModal({ children }: ConfirmModalProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
        {children}
      </div>
    </div>
  );
}
