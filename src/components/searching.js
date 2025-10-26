import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const searchRules = {
        skipEmptyTargetValues: rules.skipEmptyTargetValues,
        searchMultipleFields: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    };

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }

        const comparator = createComparison({
            [searchField]: { contains: searchValue }
        }, searchRules);

        return data.filter(item => comparator(item));
    }
}