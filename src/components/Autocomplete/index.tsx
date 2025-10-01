import * as S from "./styled";
import { FocusEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";

type TAutocomplete = {
    loading?: boolean,
    placeholder?: string,
    noResultsText?: string,
    minLength?: number,
    typeMoreText?: string,
    data?: TAutocompleteItem[],
}
type TAutocompleteItem = {
    id: number,
    name: string,
}

export const Autocomplete = ({ loading = false, placeholder = '', noResultsText = '', minLength = 3, typeMoreText = '', data = [] }: TAutocomplete) => {
    const [searchText, setSearchText] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredData, setFilteredData] = useState<TAutocompleteItem[]>([]);
    const [confirmed, setConfirmed] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const trimmed = searchText.trim();
    useEffect(() => {
        if (true) {
            const filtered = data.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
            if (!confirmed) {
                setShowDropdown(true);
            }
        } else {
            setShowDropdown(false);
            setFilteredData([]);
        }
    }, [searchText, data]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                if (!confirmed) {
                    setSearchText("");
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleSelect = (item: TAutocompleteItem) => {
        setConfirmed(true);
        setSearchText(item.name);
        setShowDropdown(false);
    };
    const handleClick: FocusEventHandler<HTMLInputElement> = (e) => {
        setShowDropdown(true)
    }
    return (
        <S.AutocompleteWrapper ref={wrapperRef}>
            <S.Input
                light={false}
                open={showDropdown}
                placeholder={placeholder}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={handleClick}
                value={searchText}
            />
            {loading && 'loading'}

            {showDropdown && (
                <S.Dropdown>
                    {filteredData.length > 0 && trimmed.length >= minLength ? (
                        filteredData.map((item) => (
                            <S.DropdownItem key={item.id} onClick={() => handleSelect(item)}>
                                {item.name}
                            </S.DropdownItem>
                        ))
                    ) : (
                        <S.NoResults>{trimmed.length < minLength ? typeMoreText : noResultsText}</S.NoResults>
                    )}
                </S.Dropdown>
            )}
        </S.AutocompleteWrapper>
    );
}