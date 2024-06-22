import { setSelectedDish, menuDishes } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const filtersContainer = document.querySelector('.dishes__filters');
    const categoriesSelect = document.querySelector('.dishes__categories');
    const dishesList = document.querySelector('.dishes__list');

    let selectedFilters = [];
    let selectedCategory = '';

    const renderFilters = () => {
        const filters = new Set();
        Object.values(menuDishes).forEach(dishes => {
            dishes.forEach(dish => {
                dish.filters.forEach(filter => filters.add(filter));
            });
        });

        filtersContainer.innerHTML = '';
        filters.forEach(filter => {
            const button = document.createElement('div');
            button.textContent = filter;
            button.className = 'filter';
            button.addEventListener('click', () => {
                if (selectedFilters.includes(filter)) {
                    selectedFilters = selectedFilters.filter(f => f !== filter);
                } else {
                    selectedFilters.push(filter);
                }
                button.classList.toggle('active');
                renderDishes();
            });
            filtersContainer.appendChild(button);
        });
    };

    const renderCategories = () => {
        categoriesSelect.innerHTML = '<option value="">Все категории</option>';
        Object.keys(menuDishes).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoriesSelect.appendChild(option);
        });

        categoriesSelect.addEventListener('change', () => {
            selectedCategory = categoriesSelect.value;
            renderDishes();
        
            if (selectedCategory) {
                const categoryElements = document.querySelectorAll(`.dish`);
                for (const element of categoryElements) {
                    console.log(element);
                    if (element.dataset.category === selectedCategory) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        break;
                    };
                };
            };
        });
        
    };

    const renderDishes = () => {
        dishesList.innerHTML = '';
    
        // Перебираем все категории и блюда в них
        for (const [category, dishes] of Object.entries(menuDishes)) {
            dishes
                .filter(dish =>
                    (selectedFilters.length ? selectedFilters.every(f => dish.filters.includes(f)) : true)
                )
                .forEach(dish => {
                    const dishElement = document.createElement('div');
                    dishElement.className = 'dish';
                    dishElement.dataset.category = category;  // Устанавливаем категорию в dataset
                    dishElement.innerHTML = `
                        <h3>${dish.name}</h3>
                        <p>${dish.description}</p>
                        <p>Price: ${dish.price.usd} / ${dish.price.euro}</p>
                    `;
                    dishElement.addEventListener('click', () => {
                        setSelectedDish(dish);
                    });
                    dishesList.appendChild(dishElement);
                });
        }
    };
    
    
    renderFilters();
    renderCategories();
    renderDishes();
});
