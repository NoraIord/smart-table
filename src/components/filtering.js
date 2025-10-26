import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    const { filters } = elements;
    
    // #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach(field => {
        const filterElement = filters.elements ? filters.elements[field] : filters.querySelector(`[name="${field}"]`);
        if (filterElement && filterElement instanceof HTMLSelectElement) {
            // Добавляем пустую опцию
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Все';
            filterElement.appendChild(emptyOption);
            
            // Добавляем уникальные значения
            const uniqueValues = Array.from(indexes[field]).sort();
            uniqueValues.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                filterElement.appendChild(option);
            });
        }
    });

    return (data, state, action) => {
        // #4.2 — обработать очистку поля
        if (action && action.name === 'clear-filters') {
            Object.keys(filters.elements || {}).forEach(key => {
                const element = filters.elements[key];
                if (element) element.value = '';
            });
            return data;
        }

        let filteredData = data;

        // Применяем фильтры ко всем полям
        Object.keys(indexes).forEach(field => {
            const filterElement = filters.elements ? filters.elements[field] : filters.querySelector(`[name="${field}"]`);
            if (filterElement) {
                const filterValue = filterElement.value.trim();
                
                if (filterValue) {
                    // #4.3 — настроить компаратор
                    const comparator = createComparison({
                        [field]: { equals: filterValue }
                    }, defaultRules);
                    
                    filteredData = filteredData.filter(item => comparator(item));
                }
            }
        });

        return filteredData;
    }
}