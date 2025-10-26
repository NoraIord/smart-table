import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initSearching} from "./components/searching.js";
import {initFiltering} from "./components/filtering.js";

// Инициализируем API
const api = initData(sourceData);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

async function render(action) {
    let state = collectState();
    let query = {};
    
    query = applySearch(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    try {
        const { total, items } = await api.getRecords(query);
        updatePagination(total, query);
        sampleTable.render(items);
    } catch (error) {
        console.error('Error loading data:', error);
        sampleTable.render([]);
    }
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация модулей
const {applyPagination, updatePagination} = initPagination(
    sampleTable.elements.pagination.elements, // Используем pagination вместо after[0]
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.elements.header.elements.sortByDate,
    sampleTable.elements.header.elements.sortByTotal
]);

const applySearch = initSearching('search');

const {applyFiltering, updateIndexes} = initFiltering(
    sampleTable.elements.filter.elements
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    try {
        const indexes = await api.getIndexes();
        updateIndexes(sampleTable.elements.filter.elements, {
            searchBySeller: indexes.sellers
        });
    } catch (error) {
        console.error('Error initializing indexes:', error);
    }
}

init().then(render);