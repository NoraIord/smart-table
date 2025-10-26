export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        // Проверяем, что elements существует
        if (!elements) {
            console.error('Filter elements are undefined');
            return;
        }

        Object.keys(indexes).forEach((elementName) => {
            const element = elements[elementName];
            // Проверяем, что элемент существует и является select
            if (element && element instanceof HTMLSelectElement) {
                // Очищаем существующие опции (кроме первой)
                while (element.options.length > 1) {
                    element.remove(1);
                }
                
                // Добавляем новые опции
                Object.values(indexes[elementName]).forEach(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    element.appendChild(el);
                });
            }
        });
    }

    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            input.value = '';
            state[action.dataset.field] = '';
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        if (elements) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                if (element && ['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                    filter[`filter[${element.name}]`] = element.value;
                }
            });
        }

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }

    return {
        updateIndexes,
        applyFiltering
    }
}