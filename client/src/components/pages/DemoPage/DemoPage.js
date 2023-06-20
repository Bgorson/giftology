import React, { useEffect, useContext, useState } from "react";
import { postGPT } from "../../../api/gpt";
import { hobbyMap } from "../../../utils/hobbyMap";
import { Audio } from "react-loader-spinner";
import { postAllQuizResults } from "../../../api/allQuiz";
import ProductSwipeContainer from "../../organisms/ProductSwipeContainer/ProductSwipeContainer";
import { useQuery } from "@tanstack/react-query";

export default function DemoPage() {
  const quizPayload = {
    who: "myself",
    name: "someone",
    age: "21-44",
    occasion: "holiday",
    hobbies: ["healthAndWellness", "outdoorGames"],
    type: ["thoughtful"],
    tags: ["efficient", "handy", "nerdy", "tea", "homeDecor", "dogs"],
  };

  const fetchExampleData = (quizPayload) => async () => {
    const response = await postAllQuizResults(quizPayload, "");
    return response.products;
  };
  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery(["exampleQuery"], fetchExampleData(quizPayload));

  const [prompt, setPrompt] = useState({
    age: "",
    occassion: "",
    hobbies: [],
    type: [],
    tags: [],
  });
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFetchGPTResults = ({ moreLikeThis, lessLikeThis }) => {
    console.log("Get more like this", moreLikeThis);
    console.log("Get less like this", lessLikeThis);
    return postGPT({ moreLikeThis, lessLikeThis });
  };
  const typeMap = [
    { message: "Essential", value: "essentials" },
    { message: "Interesting and Fun", value: "interestingAndFun" },
    { message: "Thoughtful", value: "thoughtful" },
  ];
  const tagsMap = [
    { message: "Artsy", value: "artsy" },
    { message: "Creative", value: "creative" },
    { message: "Quirky", value: "quirky" },
    { message: "Practical", value: "practical" },
    { message: "Organized", value: "organized" },
    { message: "Efficient", value: "efficient" },
    { message: "Athletic", value: "athletic" },
    { message: "Competitive", value: "competitive" },
    { message: "Handy", value: "handy" },
    { message: "Eco-Friendly", value: "eco-friendly" },
    { message: "Classy", value: "classy" },
    { message: "Nerdy", value: "nerdy" },
    { message: "Trendy", value: "trendy" },
  ];
  const handleHobbiesChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setPrompt({ ...prompt, hobbies: selectedOptions });
  };
  const handleTypeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setPrompt({ ...prompt, type: selectedOptions });
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setPrompt({ ...prompt, tags: selectedOptions });
  };
  return (
    <>
      <div
        style={{
          width: "50%",
          gap: "1em",
          margin: "auto",
          paddingTop: "5em",
          // display: "flex",
          // flexDirection: "column",
        }}
      >
        <h1>OpenAI GPT-3 Demo</h1>
        <label>AGE- needs to be entered as age-age</label>
        <p>For Example: 18-21</p>
        <input
          onChange={(e) => {
            setPrompt({ ...prompt, age: e.target.value });
          }}
        />
        <label>OCCASSION</label>
        <input
          onChange={(e) => {
            setPrompt({ ...prompt, occassion: e.target.value });
          }}
        />
        <label>HOBBIES</label>
        <select multiple onChange={handleHobbiesChange}>
          {hobbyMap.map((hobby) => (
            <option key={hobby.value} value={hobby.message}>
              {hobby.message}
            </option>
          ))}
        </select>
        <label>Type</label>
        <select multiple onChange={handleTypeChange}>
          {typeMap.map((type) => (
            <option key={type.value} value={type.message}>
              {type.message}
            </option>
          ))}
        </select>
        <label>Tags</label>
        <select multiple onChange={handleTagChange}>
          {tagsMap.map((tag) => (
            <option key={tag.value} value={tag.message}>
              {tag.message}
            </option>
          ))}
        </select>

        <h2>Response</h2>
        {response && (
          <p style={{ whiteSpace: "pre-line" }}>{response.message.content}</p>
        )}
        {isLoading ? (
          <Audio />
        ) : (
          <button
            onClick={(e) => {
              setIsLoading(true);
              setResponse("");
              e.preventDefault();
              postGPT(prompt).then((res) => {
                setIsLoading(false);
                if (res) {
                  setResponse(res);
                } else {
                  setResponse({ message: { content: "No response from API" } });
                }
              });
            }}
          >
            SUBMIT
          </button>
        )}
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {queryLoading ? (
          <h1>Loading...</h1>
        ) : (
          <ProductSwipeContainer
            handleFetchGPTResults={handleFetchGPTResults}
            data={data}
          />
        )}
      </div>
    </>
  );
}
