"use client";
import type { KmaLocation, Location } from "@/entities/location/model/types";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { useCallback } from "react";
import { useSearchWithDebounce } from "../../lib/useSearchWithDebounce";

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
}

const MAX_RESULTS = 100; // 최대 검색 결과 수 제한

export function DistrictSearchBar({ onLocationSelect }: SearchBarProps) {
  const { input, setInput, results } = useSearchWithDebounce();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    [setInput],
  );
  const handleSelect = (location: KmaLocation | null) => {
    if (location) {
      onLocationSelect({
        id: location.path,
        nx: location.gridX,
        ny: location.gridY,
        name: location.path.replaceAll("-", " "),
      });
      setInput("");
    }
  };

  return (
    <Autocomplete.Root items={results}>
      <label className="flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900">
        <Autocomplete.Input
          value={input}
          onChange={handleInputChange}
          placeholder="지역명을 입력해주세요."
          className="h-10 rounded-md border border-gray-200 bg-[canvas] pl-3.5 text-base font-normal text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </label>
      <Autocomplete.Portal>
        <Autocomplete.Positioner className="outline-none" sideOffset={4}>
          <Autocomplete.Popup className="max-h-[23rem] w-[var(--anchor-width)] max-w-[var(--available-width)] rounded-md bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <>
              <Autocomplete.Empty className="p-4 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0">
                검색 결과가 없습니다.
              </Autocomplete.Empty>
              <Autocomplete.List className="max-h-[min(23rem,var(--available-height))] scroll-py-[0.5rem] overflow-y-auto overscroll-contain py-2 outline-0 data-[empty]:p-0">
                {(location) => (
                  <Autocomplete.Item
                    key={location.path}
                    className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-base leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
                    value={location.path.replaceAll("-", " ")}
                    onClick={() => handleSelect(location)}
                  >
                    {location.path}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
              {results.length >= MAX_RESULTS && (
                <div className="border-t border-gray-200 p-2 text-xs text-gray-500">
                  상위 {MAX_RESULTS}개 결과만 표시됩니다. 더 구체적으로 검색해보세요.
                </div>
              )}
            </>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
