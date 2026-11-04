"use client";
import { useEffect } from "react";
import "./style.css";
import markup from "./markup";
import init from "./init";

export default function JawaKlasik({ data, api }) {
  useEffect(() => init(data, api), [data, api]);
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
