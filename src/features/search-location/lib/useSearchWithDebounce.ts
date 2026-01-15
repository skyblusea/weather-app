import { locationQueryOptions } from "@/entities/location/api/queries";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

const DEBOUNCE_MS = 150; // 디바운스 시간

export const useSearchWithDebounce = () => {
  const { data: database, isFetching } = useQuery(locationQueryOptions.list());
  // 사용자가 입력하는 값
  const [input, setInput] = useState("");
  // 디바운스된 값
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncer = useMemo(
    () =>
      debounce((v: string) => {
        setDebouncedQuery(v);
      }, DEBOUNCE_MS),
    [],
  );

  useEffect(() => {
    debouncer(input);
    return () => debouncer.cancel();
  }, [input, debouncer]);

  const results = useMemo(() => {
    if (!debouncedQuery || !database || isFetching) return [];

    const trimmedQuery = debouncedQuery.trim();

    const results = database.filter((location) => {
      const level1 = location.level1;
      const level2 = location.level2;
      const level3 = location.level3;
      const path = location.path;
      return (
        level1.includes(trimmedQuery) ||
        level2?.includes(trimmedQuery) ||
        level3?.includes(trimmedQuery) ||
        path.includes(trimmedQuery)
      );
    });
    return results;
  }, [debouncedQuery, database, isFetching]);

  return {
    input,
    setInput: setInput,
    results,
  };
};
