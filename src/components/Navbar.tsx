import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { AiFillGithub } from "react-icons/ai";

import Link from "next/link";
const tabs = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
];

export const Navbar = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsDropDownOpen(false);
  }, [router]);
  return (
    <div className="navbar bg-base-200 pb-2 rounded-b-xl ">
      <div className="navbar-start w-4/5 mx-auto flex gap-16 justify-evenly ">
        {/** Desktop Tab Menu */}

        <div className="form-control flex-1">
          <a href="https://github.com/fraserws/blnk/">
            <AiFillGithub className="h-10 w-10" />
          </a>
        </div>

        {/** End Desktop Tab Menu */}
      </div>

      <div className="navbar-end gap-4">
        {/** Theme Toggle */}

        <label className="swap swap-rotate items-center">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />

          <HiOutlineSun className="swap-on h-10 w-10 stroke-current" />
          <HiOutlineMoon className="swap-off h-10 w-10 stroke-current" />
        </label>

        {/** End Theme Toggle */}
      </div>
    </div>
  );
};

const useDarkMode = () => {
  const [usingDarkMode, setUsingDarkMode] = React.useState(true);

  const darkTheme = "night";
  const lightTheme = "cmyk";

  React.useEffect(() => {
    const mediaMatch = window.matchMedia("(prefers-color-scheme: dark)");

    const colorSchemeChangeListener = (e: MediaQueryListEvent) => {
      setUsingDarkMode(!e.matches);
      const newTheme = e.matches ? darkTheme : lightTheme;
      window.document.documentElement.setAttribute("data-theme", newTheme);
    };

    mediaMatch.addEventListener("change", colorSchemeChangeListener);

    setUsingDarkMode(mediaMatch.matches);
    toggleDarkMode();

    return () => {
      mediaMatch.removeEventListener("change", colorSchemeChangeListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDarkMode = () => {
    setUsingDarkMode(!usingDarkMode);
    const newTheme = usingDarkMode ? darkTheme : lightTheme;
    window.document.documentElement.setAttribute("data-theme", newTheme);
  };

  return [usingDarkMode, toggleDarkMode] as const;
};
