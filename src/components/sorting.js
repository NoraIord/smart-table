import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            if (action.dataset && action.dataset.value && action.dataset.field) {
                action.dataset.value = sortMap[action.dataset.value];
                field = action.dataset.field;
                order = action.dataset.value;

                // @todo: #3.2 — сбросить сортировки остальных колонок
                if (columns) {
                    columns.forEach(column => {
                        if (column && column.dataset && column.dataset.field !== action.dataset.field) {
                            column.dataset.value = 'none';
                        }
                    });
                }
            }
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            if (columns) {
                columns.forEach(column => {
                    if (column && column.dataset && column.dataset.value !== 'none') {
                        field = column.dataset.field;
                        order = column.dataset.value;
                    }
                });
            }
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null;

        return sort ? Object.assign({}, query, { sort }) : query;
    }
}