import { SkeletonWrap } from "~components/SkeletonWrap";
import * as S from "./styled";
import {
  CSSProperties,
  FocusEventHandler,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fuzzySearch } from "~utils/fuzzySearch";

type TAutocomplete = {
  loading?: boolean;
  placeholder?: string;
  noResultsText?: string;
  minLength?: number;
  typeMoreText?: string;
  name?: string;
  onChange: (value: number) => void;
  value: string | number | null;
  error?: string | null;
  style?: CSSProperties;
  data?: TAutocompleteItem[];
};
type TAutocompleteItem = {
  searchText: string;
  id: number;
  name: string;
};

const AutocompleteComponent = ({
  loading = false,
  placeholder = "",
  noResultsText = "",
  minLength = 3,
  typeMoreText = "",
  name = "",
  onChange,
  style = {},
  value = null,
  error = null,
  data = [],
}: TAutocomplete) => {
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  //   const [filteredData, setFilteredData] = useState<TAutocompleteItem[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trimmed = searchText.trim();
  //   const { hits, setQuery } = useFuse<TAutocompleteItem>(data ?? [], {
  //     keys: ["searchText"] as (keyof TAutocompleteItem)[],
  //     threshold: 0.3,
  //     limit: 25,
  //     matchAllOnEmptyQuery: false,
  //     includeScore: true,
  //     fieldNormWeight: 0.05,
  //   });
  const filteredData = useMemo(() => {
    return fuzzySearch(data, searchText, (el) => el.searchText, {
      maxAllowedModifications: 1,
    }).slice(0, 10);
  }, [searchText]);
  useEffect(() => {
    if (value == null || data.length == 0) return;
    const selected = data.find((el) => el.id == value);
    if (!selected) {
      onChange(null);
      return;
    }

    if (selected.name !== searchText) {
      setSearchText(selected.name);
    }
    setConfirmed(true);
  }, [value, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        if (!confirmed) {
          setSearchText("");
          onChange(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [confirmed]);
  const handleSelect = (item: TAutocompleteItem) => {
    setConfirmed(true);
    setSearchText(item.name);
    setShowDropdown(false);
    onChange(item.id);
  };
  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setShowDropdown(true);
  };
  return (
    <SkeletonWrap
      style={{
        width: "100%",
      }}
      loading={loading}
      borderRadius={10}
    >
      <S.AutocompleteWrapper ref={wrapperRef} style={style}>
        <S.Input
          name={name}
          light={false}
          open={showDropdown}
          placeholder={placeholder}
          onChange={(e) => {
            setConfirmed(false);
            setSearchText(e.target.value);
          }}
          onFocus={handleFocus}
          value={searchText}
        />
        {showDropdown && (
          <S.Dropdown>
            {filteredData.length > 0 && trimmed.length >= minLength ? (
              filteredData.map((item) => (
                <S.DropdownItem
                  key={item.id}
                  onClick={() => handleSelect(item)}
                >
                  {item.name}
                </S.DropdownItem>
              ))
            ) : (
              <>
                <S.NoResults>
                  {trimmed.length < minLength ? typeMoreText : noResultsText}
                </S.NoResults>
              </>
            )}
          </S.Dropdown>
        )}
        {!!error && <S.Error>{error}</S.Error>}
      </S.AutocompleteWrapper>
    </SkeletonWrap>
  );
};
export const Autocomplete = memo(AutocompleteComponent);
