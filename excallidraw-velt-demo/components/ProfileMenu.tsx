"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, User, Check, LogOut, RefreshCwIcon } from "lucide-react";
import { useVeltClient } from "@veltdev/react";
import { TEST_USERS } from "@/lib/users";

export function ProfileMenu() {
  const { client } = useVeltClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(TEST_USERS[0]); // Default to first user

  // Initialize from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIndex = params.get("user");
    if (userIndex) {
      const index = parseInt(userIndex);
      if (!isNaN(index) && TEST_USERS[index]) {
        setCurrentUser(TEST_USERS[index]);
      }
    }
  }, []);

  const handleUserSelect = (user: (typeof TEST_USERS)[0], index: number) => {
    setCurrentUser(user);
    setIsOpen(false);

    if (client) {
      client.identify(user);
      const url = new URL(window.location.href);
      url.searchParams.set("user", index.toString());
      window.history.pushState({}, "", url);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full  bg-white  p-2  transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        <RefreshCwIcon size={16} className="text-black/90 dark:text-white/90"/>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900 dark:ring-white/5">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-neutral-800">
              <p className="text-xs font-medium text-slate-900 dark:text-neutral-200">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate dark:text-neutral-400">
                {currentUser.email}
              </p>
            </div>

            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Switch Account
              </div>
              {TEST_USERS.map((user, index) => (
                <button
                  key={user.userId}
                  onClick={() => handleUserSelect(user, index)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition hover:bg-slate-50 dark:hover:bg-neutral-800"
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: user.color }}
                  >
                    {user.name[0]}
                  </div>
                  <span
                    className={`font-medium ${currentUser.userId === user.userId ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-neutral-400"}`}
                  >
                    {user.name}
                  </span>
                  {currentUser.userId === user.userId && (
                    <Check size={14} className="ml-auto text-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
