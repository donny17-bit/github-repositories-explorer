import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import octokit from "../utils/octokit";

type dropdownProps = {
  login: string;
};

export function Dropdown({ login }: dropdownProps) {
  const [enable, setEnable] = useState(false);
  const [repos, setRepos] = useState(Array);
  const [loading, setLoading] = useState(false);

  const spinner = (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 mt-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const mapping = repos.map((item: any) => (
    <div
      key={item.id}
      className="w-1/3 max-sm:w-60 h-auto bg-zinc-600 hover:bg-gray-500 rounded mt-2 p-2 "
    >
      <div className="flex flex-row justify-between">
        <p className="font-semibold text-base break-words w-9/12">
          {item.name}
        </p>
        <p className="flex font-medium">
          {item.stargazers_count} &nbsp;
          <StarIcon className="h-5 w-5 text-yellow-300" />
        </p>
      </div>
      <div className="mt-1 break-words w-9/12">
        <p className="text-xs font-normal">{item.description}</p>
      </div>
    </div>
  ));

  const isLoading = () => {
    setTimeout(() => setLoading(!loading), 3000);
    return (
      <div className="w-1/3 max-sm:w-60 bg-zinc-600 hover:bg-gray-500 rounded mt-2 justify-center h-10 flex">
        {spinner}
      </div>
    );
  };

  const getRepos = async (username: string) => {
    const result = await octokit.request("GET /users/{username}/repos", {
      username: username,
    });

    setRepos(result.data);
  };

  const clicked = (username: string) => {
    setEnable(!enable);
    setLoading(!loading);
    getRepos(username);
  };

  return (
    <>
      <button
        type="button"
        className="max-sm:w-60  bg-blue-800 rounded flex justify-between p-2 mt-2 w-1/3 hover:bg-blue-700"
        onClick={() => clicked(login)}
      >
        {login}
        {enable ? (
          <ChevronUpIcon
            className="-mr-1 h-5 w-5 text-white"
            aria-hidden="true"
          />
        ) : (
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-white"
            aria-hidden="true"
          />
        )}
      </button>
      {enable ? (
        loading ? (
          isLoading()
        ) : repos.length ? (
          mapping
        ) : (
          <div className="max-sm:w-60 w-1/3 h-auto bg-zinc-600 hover:bg-gray-500 rounded mt-2 justify-center flex">
            <p className="font-semibold text-base break-words p-2 w-fit">
              This user doesn't have any repositories
            </p>
          </div>
        )
      ) : (
        <></>
      )}
    </>
  );
}
