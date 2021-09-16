import { useEffect, useState } from "react";

function getSaved(key, init) {
 const savedValue = JSON.parse(localStorage.getItem(key));

 if (savedValue) return savedValue;

 return init;
}

export function useLocal(key, init) {
 const [val, setVal] = useState(() => {
  return getSaved(key, init);
 });

 useEffect(() => {
  localStorage.setItem(key, JSON.stringify(val));
 }, [val]);

 return [val, setVal];
}
