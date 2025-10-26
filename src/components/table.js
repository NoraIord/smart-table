import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // Сохраняем дополнительные элементы с именами
    const additionalElements = {};

    // Добавляем шаблоны ДО таблицы
    if (before && before.length > 0) {
        before.reverse().forEach(subName => {
            const element = cloneTemplate(subName);
            additionalElements[subName] = element;
            root.container.prepend(element.container);
        });
    }

    // Добавляем шаблоны ПОСЛЕ таблицы
    if (after && after.length > 0) {
        after.forEach(subName => {
            const element = cloneTemplate(subName);
            additionalElements[subName] = element;
            root.container.append(element.container);
        });
    }

    // Обработчики событий
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    const element = row.elements[key];
                    
                    if (element instanceof HTMLInputElement || 
                        element instanceof HTMLSelectElement) {
                        element.value = item[key];
                    } else {
                        element.textContent = item[key];
                    }
                }
            });
            
            return row.container;
        });
        
        if (root.elements.rows) {
            root.elements.rows.replaceChildren(...nextRows);
        }
    }

    return {
        container: root.container,
        elements: {
            ...root.elements,
            ...additionalElements
        },
        render
    };
}