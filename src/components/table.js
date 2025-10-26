import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    // Сохраняем дополнительные элементы для последующего доступа
    root.beforeElements = [];
    root.afterElements = [];

    // Добавляем шаблоны ДО таблицы (в обратном порядке для prepend)
    if (before && before.length > 0) {
        before.reverse().forEach(subName => {
            const element = cloneTemplate(subName);
            root.beforeElements.push(element);
            root.container.prepend(element.container);
        });
    }

    // Добавляем шаблоны ПОСЛЕ таблицы
    if (after && after.length > 0) {
        after.forEach(subName => {
            const element = cloneTemplate(subName);
            root.afterElements.push(element);
            root.container.append(element.container);
        });
    }

    // @todo: #1.3 — обработать события и вызвать onAction()
    
    // Обработчик события change
    root.container.addEventListener('change', () => {
        onAction();
    });

    // Обработчик события reset
    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    // Обработчик события submit
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            // Перебираем все ключи данных
            Object.keys(item).forEach(key => {
                // Проверяем, что элемент с таким data-name существует в шаблоне
                if (key in row.elements) {
                    const element = row.elements[key];
                    
                    // Проверяем тип элемента и присваиваем значение
                    if (element instanceof HTMLInputElement || 
                        element instanceof HTMLSelectElement) {
                        // Для input и select используем value
                        element.value = item[key];
                    } else {
                        // Для остальных элементов используем textContent
                        element.textContent = item[key];
                    }
                }
            });
            
            return row.container;
        });
        
        // Заменяем содержимое контейнера строк
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {
        container: root.container,
        elements: {
            ...root.elements,
            before: root.beforeElements,
            after: root.afterElements
        },
        render
    };
}