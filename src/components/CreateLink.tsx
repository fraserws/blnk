import React, { useState } from "react";
import { generateSlug } from "random-word-slugs";
import { debounce } from "debounce";
import copy from "copy-to-clipboard";
import QRCode from "react-qr-code";

import { trpc } from "../utils/trpc";

type Form = {
  slug: string;
  url: string;
};

const CreateUrl = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const url = location.origin;

  const checkSlug = trpc.useQuery(["checkSlug", { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createShortLink = trpc.useMutation(["createShortLink"]);

  if (createShortLink.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center mx-3 mt-6">
        <span className="pb-3 text-lg font-semibold">Generated Link:</span>

        <div className="flex items-center gap-2">
          <h1 className="text-lg text-center md:text-2xl">{`${url}/${form.slug}`}</h1>
          <button
            className="btn btn-primary hover:ghost"
            onClick={() => {
              copy(`${url}/${form.slug}`);
            }}
          >
            Copy
          </button>
        </div>
        <QRCode value={`${url}/${form.slug}`} title={form.slug} />
        <button
          className="px-4 mt-8 py-1.5 ml-3 btn btn-primary hover:ghost"
          onClick={() => {
            createShortLink.reset();
            setForm({ slug: "", url: "" });
          }}
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createShortLink.mutate({ ...form });
      }}
      className="mt-6"
    >
      {checkSlug.data?.used ? (
        <span className="font-medium text-center text-red-500">
          This link has already been used
        </span>
      ) : (
        <span className="font-medium text-center">
          {url}/{form.slug}
        </span>
      )}

      <div className="my-2" />

      <div className="flex items-center">
        <input
          type="text"
          onChange={(e) => {
            setForm({
              ...form,
              slug: e.target.value.toLowerCase(),
            });

            debounce(checkSlug.refetch, 100);
          }}
          minLength={1}
          maxLength={50}
          placeholder="a-cool-suffix"
          className="block w-full px-5 py-2 mr-2 input input-bordered input-primary"
          value={form.slug}
          pattern={"^[-a-zA-Z0-9]+$"}
          title="Only alphanumeric characters and hyphens are allowed. No spaces."
          required
        />
        <input
          type="button"
          value="Random"
          className="btn btn-primary"
          onClick={() => {
            const slug = generateSlug();

            setForm({
              ...form,
              slug,
            });

            checkSlug.refetch();
          }}
        />
      </div>
      <div className="flex flex-col items-center my-2">
        <span className="self-start my-2 font-medium">Link</span>
        <input
          type="url"
          value={form.url}
          maxLength={3000}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://fraserws.dev/"
          className="block w-full px-4 py-2 input input-bordered input-primary"
          required
        />
      </div>
      <input
        type="submit"
        value="Create"
        className={`btn btn-primary hover:bg-transparent ${
          createShortLink.status === "loading" ? "opacity-50" : ""
        }`}
        disabled={checkSlug.isFetched && checkSlug.data!.used}
      />
    </form>
  );
};

export default CreateUrl;
