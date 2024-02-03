"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {}
export default function Page(props: Props) {
  const sp = useSearchParams();
  const [r, set] = useState({});

  useEffect(() => {
    const code = sp.get("code");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/account/login/google`, {
      method: "POST",
      headers,
      body: JSON.stringify({ code }),
    })
      .then((re) => re.json())
      .then(async (r) => {
        if (r.loginStatus === 0) {
          const header = new Headers();
          header.append("Authorization", `Bearer ${r.accessToken}`);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/tokens/info`,
            {
              headers: header,
            }
          );
          const js = await res.json();
          set(js);
        } else if (r.loginStatus === 1) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/account/sign-in/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                providerToken: r.providerToken,
                userName: "sooho",
                gender: "M",
                birthAt: new Date().toISOString(),
                agree: {
                  service: true,
                },
              }),
            }
          );
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);
  return (
    <>
      <pre>{sp.toString()}</pre>
      <pre>{JSON.stringify(r, null, 2)}</pre>
    </>
  );
}
